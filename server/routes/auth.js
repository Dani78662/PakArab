const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Login route
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'ramzin', 'editor']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;

    // Find user by username and role
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      userId: user._id,
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role
    }
  });
});

// Create default users (for development)
router.post('/create-default-users', async (req, res) => {
  try {
    // Check if users already exist
    const existingUsers = await User.find();
    if (existingUsers.length > 0) {
      return res.json({ message: 'Default users already exist' });
    }

    // Create default users
    const defaultUsers = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'ramzin', password: 'ramzin123', role: 'ramzin' },
      { username: 'editor', password: 'editor123', role: 'editor' }
    ];

    const users = await User.insertMany(defaultUsers);
    
    res.json({ 
      message: 'Default users created successfully',
      users: users.map(user => ({
        username: user.username,
        role: user.role
      }))
    });
  } catch (error) {
    console.error('Create default users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
