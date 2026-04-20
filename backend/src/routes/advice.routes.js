const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const Expense = require('../models/Expense');
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth');
const OpenAI = require('openai');

router.get('/', protect, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });
    const expenses = await Expense.find({ user: req.user.id });
    const goals = await Goal.find({ user: req.user.id });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const summary = `
    User Financial Profile:
    Income: ₹${profile.income}
    Base Monthly Expenses Estimate: ₹${profile.baseMonthlyExpenses}
    Actual Tracked Expenses (Total): ₹${totalExpenses}
    Current Savings: ₹${profile.savings}
    Investments: ₹${profile.investments}
    Goals: ${goals.map(g => `${g.name} (Target: ₹${g.targetAmount})`).join(', ')}
    `;

    let adviceText = '';
    
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY') {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a financial advisor. Return exactly 3 short, actionable, and specific tips based on the user profile. The response must be a JSON array of strings ONLY. No extra text.' },
            { role: 'user', content: summary }
          ],
        });
        adviceText = completion.choices[0].message.content;
      } catch (aiError) {
        console.error('OpenAI Error:', aiError.message);
        // Fallback gracefully on quota errors
        adviceText = null; 
      }
    } 

    if (!adviceText) {
      adviceText = `[
        "Reduce food expenses by 10% this month.",
        "Increase savings rate to reach your goals faster.",
        "Avoid unnecessary subscriptions to save more money."
      ]`;
    }

    let parsedAdvice;
    try {
      parsedAdvice = JSON.parse(adviceText.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch {
      parsedAdvice = adviceText.split('\n').filter(line => line.trim() !== '' && line.trim() !== '[' && line.trim() !== ']');
    }

    res.json({ advice: parsedAdvice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
