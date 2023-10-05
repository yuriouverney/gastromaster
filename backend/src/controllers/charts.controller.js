const express = require('express');
const chartService = require('../services/chart.service');
const { verifyToken, authorize } = require('../middlewares/auth');
const router = express.Router();

router.get('/productssoldpermonth', verifyToken, authorize(['ADMIN']), async (req, res) => {
  try {
    const chart = await chartService.getProductsSoldPerMonth();
    res.json(chart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
