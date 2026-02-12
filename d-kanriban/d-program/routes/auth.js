const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};


router.post('/register', async (req, res) => {
  const { username, name, pin } = req.body;
  try {
    if (!username || !name || !pin) {
      return res.status(400).json({ message: 'Username, Name, and PIN are required' });
    }
    if (pin.length < 4 || pin.length > 6) {
      return res.status(400).json({ message: 'PIN must be 4-6 characters' });
    }
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ message: 'Name must be 2-100 characters' });
    }
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create(username, name, pin);
    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        name: user.name,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





router.post('/login', async (req, res) => {
  const { username, pin } = req.body;
  try {
    // Validasi input
    if (!username || !pin) {
      return res.status(400).json({ message: 'Username and PIN are required' });
    }
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await User.comparePin(pin, user.pin);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      _id: user.id,
      username: user.username,
      name: user.name,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/profile', protect, (req, res) => {
  res.json({
    _id: req.user.id,
    username: req.user.username,
    name: req.user.name, 
    createdAt: req.user.created_at,
  });
});

module.exports = router;