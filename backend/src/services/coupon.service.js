const Coupon = require('../models/coupon.model');
const BaseCrudService = require('./base-crud.service');

class CouponService extends BaseCrudService {
  constructor() {
    super(Coupon);
  }

  async getAllCoupons() {
    return await this.model.findAll();
  }

  async getCouponById(id) {
    return this.model.findByPk(id);
  }

  async getCouponByCode(code) {
    return this.model.findOne({ where: { code } });
  }

  async createCoupon(form) {
    const hasCouponSameCode = await this.model.findOne({ where: { code: form.code } });
    if (hasCouponSameCode) throw new Error('Já existe um cupom com este código');
    return await this.model.create(form);
  }

  async updateCoupon(id, form) {
    return await this.model.update(form, { where: { id } });
  }
}
module.exports = new CouponService();
