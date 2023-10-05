const express = require('express');
const orderService = require('../services/order.service');
const { verifyToken, authorize } = require('../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/', verifyToken, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const users = await orderService.getAllOrders();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders/user:
 *   get:
 *     summary: Get orders of the authenticated user
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const users = await orderService.getUserOrders(userId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const category = await orderService.getOrderById(id);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of product IDs
 *             required:
 *               - data
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const productsId = req.body.data;
    const coupon = req.body.couponCode ? req.body.couponCode : null;
    const userId = req.user.id;
    const order = await orderService.createOrder(productsId, coupon, userId);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update order by ID
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               form:
 *                 type: object
 *                 description: Updated order data
 *             required:
 *               - form
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const form = req.body;
    const order = await orderService.updateOrder(id, form);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /orders/orderitem/{id}:
 *   delete:
 *     summary: Delete order item by ID
 *     tags: [Orders]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.delete('/orderitem/:id', verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    const orderitem = await orderService.deleteOrderItem(id);
    res.json(orderitem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
