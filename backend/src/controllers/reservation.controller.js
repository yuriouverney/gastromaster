const express = require('express');
const reservationService = require('../services/reservation.service');
const { verifyToken, authorize } = require('../middlewares/auth');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservation management
 */

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
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
    const reservations = await reservationService.getAllReservations();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reservations/user/{id}:
 *   get:
 *     summary: Get reservation by ID (user)
 *     tags: [Reservations]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/user/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const reservation = await reservationService.getReservationById(id, userId);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reservations/user:
 *   get:
 *     summary: Get reservations by user
 *     tags: [Reservations]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/user', verifyToken, async (req, res) => {
  const id = req.user.id;
  try {
    const users = await reservationService.getAllReservationsByUser(id);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Get reservation by ID (admin)
 *     tags: [Reservations]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', verifyToken, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  const id = req.params.id;
  try {
    const reservation = await reservationService.getReservationByIdAdmin(id);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Reservation date
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               amountPeople:
 *                 type: integer
 *                 description: Number of people
 *               obs:
 *                 type: string
 *                 description: Additional information
 *             required:
 *               - date
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const reservation = await reservationService.createReservation(req.body, userId);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Update reservation by ID (admin/manager)
 *     tags: [Reservations]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Reservation date
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               amountPeople:
 *                 type: integer
 *                 description: Number of people
 *               obs:
 *                 type: string
 *                 description: Additional information
 *               status:
 *                 type: string
 *                 description: Reservation status (APPROVED, CANCELED, PENDING)
 *             required:
 *               - date
 *               - status
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', verifyToken, authorize(['ADMIN', 'MANAGER']), async (req, res) => {
  const id = req.params.id;
  try {
    const reservation = await reservationService.updateReservationAdmin(id, req.body);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reservations/user/{id}:
 *   put:
 *     summary: Update reservation by ID (user)
 *     tags: [Reservations]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Reservation date
 *               phone:
 *                 type: string
 *                 description: Phone number
 *               amountPeople:
 *                 type: integer
 *                 description: Number of people
 *               obs:
 *                 type: string
 *                 description: Additional information
 *             required:
 *               - date
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.put('/user/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const reservation = await reservationService.updateReservation(id, req.body);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Delete reservation by ID (admin/manager)
 *     tags: [Reservations]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const reservation = await reservationService.deleteReservationAdmin(id);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /reservations/user/{id}:
 *   delete:
 *     summary: Delete reservation by ID (user)
 *     tags: [Reservations]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: Internal Server Error
 */
router.delete('/user/:id', verifyToken, async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const reservation = await reservationService.deleteReservation(id, userId);
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
