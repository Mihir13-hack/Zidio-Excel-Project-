const express = require('express');
const router = express.Router();
const History = require('../models/History');
const authMiddleware = require('../middleware/authMiddleware');

// Save chart/upload history
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { fileName, selectedXAxis, selectedYAxis, chartType } = req.body;
    const entry = await History.create({
      userId: req.user._id,
      fileName,
      selectedXAxis,
      selectedYAxis,
      chartType
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save history' });
  }
});

// Get current user's history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id }).sort({ uploadDate: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history' });
  }
});

module.exports = router;
