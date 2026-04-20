const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const queryIncome = req.query.income ? Number(req.query.income) : profile.income;
    const queryExpenses = req.query.expenses ? Number(req.query.expenses) : profile.baseMonthlyExpenses;
    const addedSavings = req.query.addedSavings ? Number(req.query.addedSavings) : 0;
    
    const currentMonthlySavings = queryIncome - queryExpenses + addedSavings;

    const simulation = {
      currentInvestments: profile.investments,
      currentSavings: profile.savings,
      monthlyNet: currentMonthlySavings,
      projections: [
        { months: 6, totalSavings: profile.savings + (currentMonthlySavings * 6) },
        { months: 12, totalSavings: profile.savings + (currentMonthlySavings * 12) },
        { months: 24, totalSavings: profile.savings + (currentMonthlySavings * 24) },
      ]
    };

    res.json(simulation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
