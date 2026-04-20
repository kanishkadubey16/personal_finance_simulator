require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Mount routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/profile', require('./src/routes/profile.routes'));
app.use('/api/expenses', require('./src/routes/expense.routes'));
app.use('/api/goals', require('./src/routes/goal.routes'));
app.use('/api/simulation', require('./src/routes/simulation.routes'));
app.use('/api/advice', require('./src/routes/advice.routes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
