const express = require('express');
const router = express.Router();

const settingController = require('./setting.controller');
const userController = require('./user.controller');
const authController = require('./auth.controller');
const productController = require('./product.controller');
const categoryController = require('./category.controller');
const reservationController = require('./reservation.controller');
const orderController = require('./order.controller');
const couponsController = require('./coupon.controller');
const chartsController = require('./charts.controller');

router.use('/auth', authController);
router.use('/settings', settingController);
router.use('/users', userController);
router.use('/products', productController);
router.use('/categories', categoryController);
router.use('/reservations', reservationController);
router.use('/orders', orderController);
router.use('/coupons', couponsController);
router.use('/charts', chartsController);

module.exports = router;
