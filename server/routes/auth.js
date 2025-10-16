const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Simplified login route - no role validation
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    console.log('Login attempt:', { username: req.body.username, role: req.body.role });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;

    // Find user by username (ignore role for now)
    const user = await User.findOne({ username });
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

// Create or ensure default users exist (idempotent)
router.post('/create-default-users', async (req, res) => {
  try {
    const defaultUsers = [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'ramzin', password: 'ramzin123', role: 'ramzin' },
      { username: 'editor', password: 'editor123', role: 'editor' },
      { username: 'editor2', password: 'editor2123', role: 'editor2' }
    ];

    const created = [];
    const existing = [];

    for (const def of defaultUsers) {
      const found = await User.findOne({ username: def.username, role: def.role });
      if (!found) {
        const newUser = new User(def);
        await newUser.save();
        created.push({ username: newUser.username, role: newUser.role });
      } else {
        existing.push({ username: found.username, role: found.role });
      }
    }

    res.json({
      message: 'Default users ensured',
      created,
      existing
    });
  } catch (error) {
    console.error('Create default users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
