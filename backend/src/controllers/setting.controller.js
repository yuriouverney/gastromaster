const express = require('express');
const settingService = require('../services/setting.service');
const { verifyToken, authorize } = require('../middlewares/auth');
const router = express.Router();
const upload = require('../middlewares/upload');

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: Setting management APIs
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Settings
 *     summary: Get settings
 *     description: Returns the settings
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const setting = await settingService.getSettings();
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /settings/settingimages:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Get setting images
 *     description: Returns the URLs of the setting images
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SettingImage'
 *       500:
 *         description: Internal server error
 */
router.get('/settingimages', async (req, res) => {
  try {
    const images = await settingService.getSettingImages();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /settings:
 *   put:
 *     security:
 *       - Bearer: []
 *     tags:
 *       - Settings
 *     summary: Update settings
 *     description: Updates the settings
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SettingUpdate'
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Setting'
 *       500:
 *         description: Internal server error
 */
router.put('/', verifyToken, upload, authorize(['ADMIN']), async (req, res) => {
  try {
    const form = req.body;
    const files = req.files;
    const setting = await settingService.updateSetting(form, files);
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
