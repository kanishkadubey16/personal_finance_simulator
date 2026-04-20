const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const { protect } = require('../middleware/auth');

// Get profile
router.get('/', protect, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = await UserProfile.create({
        user: req.user.id,
        income: 50000,
        baseMonthlyExpenses: 30000,
        savings: 5000,
        investments: 0
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
router.put('/', protect, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new UserProfile({ ...req.body, user: req.user.id });
      await profile.save();
    } else {
      profile = await UserProfile.findOneAndUpdate(
        { user: req.user.id }, 
        req.body, 
        { returnDocument: 'after' }
      );
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
