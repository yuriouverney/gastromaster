const express = require('express');
const couponService = require('../services/coupon.service');
const { verifyToken, authorize } = require('../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management
 */

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all Coupons
 *     tags: [Coupons]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/', verifyToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Get Coupon by ID
 *     tags: [Coupons]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', verifyToken, authorize(['ADMIN']), async (req, res) => {
  const id = req.params.id;
  try {
    const coupon = await couponService.getCouponById(id);
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /coupons/code/{code}:
 *   get:
 *     summary: Get Coupon by Code
 *     tags: [Coupons]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Coupon Code
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/code/:code', verifyToken, async (req, res) => {
  const code = req.params.code;
  try {
    const coupon = await couponService.getCouponByCode(code);
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create a new Coupon
 *     tags: [Coupons]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Coupon value
 *               order_min_value:
 *                 type: number
 *                 description: Minimum order value to apply the coupon
 *               code:
 *                 type: string
 *                 description: Coupon code
 *               description:
 *                 type: string
 *                 description: Coupon description
 *               active:
 *                 type: boolean
 *                 description: Indicates if the coupon is active
 *               expiration_date:
 *                 type: string
 *                 format: date
 *                 description: Expiration date of the coupon (YYYY-MM-DD)
 *             required:
 *               - value
 *               - order_min_value
 *               - code
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.post('/', verifyToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     summary: Update Coupon by ID
 *     tags: [Coupons]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Updated coupon value
 *               order_min_value:
 *                 type: number
 *                 description: Updated minimum order value to apply the coupon
 *               code:
 *                 type: string
 *                 description: Updated coupon code
 *               description:
 *                 type: string
 *                 description: Updated coupon description
 *               active:
 *                 type: boolean
 *                 description: Indicates if the coupon is active
 *               expiration_date:
 *                 type: string
 *                 format: date
 *                 description: Updated expiration date of the coupon (YYYY-MM-DD)
 *             required:
 *               - value
 *               - order_min_value
 *               - code
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', verifyToken, authorize(['ADMIN']), async (req, res) => {
  const id = req.params.id;
  try {
    const coupon = await couponService.updateCoupon(id, req.body);
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
