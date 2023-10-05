const express = require('express');
const userService = require('../services/user.service');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { verifyToken } = require('../middlewares/auth');
dotenv.config();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication management APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Create a new user
 *     description: Returns a list of all users
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                form:
 *                  type: object
 *                  properties:
 *                    name:
 *                      type: string
 *                    email:
 *                      type: string
 *                    password:
 *                      type: string
 *              example:
 *                form:
 *                  name: John Doe
 *                  email: john@example.com
 *                  password: password123
 *     responses:
 *       200:
 *         description: Successfully created a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.post('/register', async (req, res) => {
  try {
    const { form } = req.body;
    const user = await userService.createUser(form);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /auth/getuserdata:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Authentication
 *     summary: Get user data
 *     description: Returns data of the currently authenticated user
 *     responses:
 *       200:
 *         description: Successfully retrieved user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get('/getuserdata', verifyToken, async (req, res) => {
  const id = req.user.id;
  try {
    const session = await userService.getUserSession(id);
    res.json({ session });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Log in the user and return a JWT token
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                form:
 *                  type: object
 *                  properties:
 *                    email:
 *                      type: string
 *                    password:
 *                      type: string
 *              example:
 *                form:
 *                  email: john@example.com
 *                  password: password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.post('/login', async (req, res) => {
  try {
    const { form } = req.body;
    const session = await userService.login(form);
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.SECRET_KEY_JWT, {
      expiresIn: process.env.TIME_JWT,
    });
    res.redirect(`${process.env.GOOGLE_POST_LOGIN}${token}`);
  }
);

module.exports = router;
