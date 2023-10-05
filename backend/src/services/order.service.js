const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Coupon = require('../models/coupon.model');
const BaseCrudService = require('./base-crud.service');
const sequelize = require('../db/database');
const OrderStatus = require('../models/enums/order-status.enum');
const OrderItem = require('../models/order-item.model');
const User = require('../models/user.model');
const moment = require('moment');

class OrderService extends BaseCrudService {
  constructor() {
    super(Order);
  }

  async getAllOrders() {
    return this.model.findAll({ order: [['createdAt', 'DESC']] });
  }

  async validateCoupon(couponCode) {
    const today = moment().format('YYYY-MM-DD');
    const coupon = await Coupon.findOne({ where: { code: couponCode } });
    if (!coupon) {
      return false;
    } else if (coupon.expiration_date && coupon.expiration_date < today) {
      return false;
    } else if (!coupon.active) {
      return false;
    } else {
      return coupon;
    }
  }

  async createOrder(productsId, couponCode, userId) {
    const transaction = await sequelize.transaction();
    try {
      const products = await Product.findAll({
        where: {
          id: productsId,
        },
        transaction: transaction,
      });
      const coupon = await this.validateCoupon(couponCode);

      const productsCart = this.productsCart(productsId, products);
      const orderPrice = productsCart.reduce((total, item) => total + parseFloat(item.price), 0);
      const paidValue = coupon ? orderPrice - coupon.value : orderPrice;
      const order = await this.create({
        status: OrderStatus.PENDING,
        order_price: orderPrice,
        paid_value: paidValue,
        user_id: userId,
        coupon_discount: coupon ? coupon.value : 0,
        coupon_id: coupon ? coupon.id : null,
      });
      for (let product of productsCart) {
        await OrderItem.create({
          order_id: order.id,
          product_id: product.id,
          price: product.price,
        });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  productsCart(productsId, products) {
    products = products.map((product) => {
      if (product.promotion && product.promotion_percent) {
        product.price = parseFloat(
          (product.price - product.price * (product.promotion_percent / 100)).toFixed(2)
        );
      }
      return product;
    });
    return productsId.map((productId) => {
      const product = products.find((product) => product.id === productId);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
      };
    });
  }

  async getOrderById(id) {
    try {
      return this.model.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: User,
            atributtes: ['id', 'name', 'email'],
          },
          {
            model: OrderItem,
            as: 'order_items',
            include: [
              {
                model: Product,
                as: 'product',
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteOrderItem(id) {
    const transaction = await sequelize.transaction();
    try {
      const item = await OrderItem.findOne({
        where: {
          id: id,
        },
        transaction,
      });

      const order = await Order.findOne({
        where: {
          id: item.order_id,
        },
        transaction,
      });

      const refreshTotalPrice = parseFloat(order.order_price) - parseFloat(item.price);
      order.update({ order_price: refreshTotalPrice }, { transaction });

      await OrderItem.destroy({
        where: {
          id: id,
        },
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateOrder(id, form) {
    try {
      const order = await this.model.findOne({
        where: {
          id: id,
        },
      });
      return order.update(form);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getUserOrders(userId) {
    return this.model.findAll({
      where: {
        user_id: userId,
      },
      order: [['createdAt', 'DESC']],
    });
  }
}
module.exports = new OrderService();
