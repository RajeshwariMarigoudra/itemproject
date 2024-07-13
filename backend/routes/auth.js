// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if user already exists
      let user = await User.findOne({ username });
  
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user
      user = new User({
        username,
        password // Note: In production, hash the password before storing
      });
  
      await user.save();
  
      res.json({ message: 'User registered successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if user exists
      let user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // For simplicity, compare passwords in plain text (not recommended for production)
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      res.json({ message: 'Login successful' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
    res.clearCookie('connect.sid');
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
