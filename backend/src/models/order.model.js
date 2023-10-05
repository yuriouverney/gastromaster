const { DataTypes, Model } = require('sequelize');
const OrderStatus = require('./enums/order-status.enum');
class Order extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        status: {
          type: DataTypes.ENUM,
          values: Object.values(OrderStatus),
          allowNull: false,
        },
        coupon_discount: {
          type: DataTypes.DECIMAL(7, 2),
        },
        order_price: {
          type: DataTypes.DECIMAL(7, 2),
          allowNull: false,
        },
        paid_value: {
          type: DataTypes.DECIMAL(7, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Order',
        freezeTableName: true,
        timestamps: true,
        name: {
          singular: 'Order',
          plural: 'Orders',
        },
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
    });
    this.belongsTo(models.Order, {
      foreignKey: 'coupon_id',
    });
    this.hasMany(models.OrderItem, {
      as: 'order_items',
      foreignKey: 'order_id',
    });
  }
}

module.exports = Order;
