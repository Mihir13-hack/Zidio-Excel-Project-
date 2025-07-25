const express = require('express');
const router = express.Router();
const User = require('../models/User');
const History = require('../models/History');
const adminMiddleware = require('../middleware/adminMiddleware');

// GET /api/admin/stats
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await History.countDocuments();
    const chartAgg = await History.aggregate([
      { $group: { _id: '$chartType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);
    res.json({
      totalUsers,
      totalUploads,
      topChartTypes: chartAgg.map(c => ({ type: c._id, count: c.count }))
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// GET /api/admin/users
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// PUT /api/admin/users/:id/block
router.put('/users/:id/block', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: user.isBlocked ? 'User blocked' : 'User unblocked' });
  } catch {
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
