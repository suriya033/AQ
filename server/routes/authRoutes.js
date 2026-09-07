const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { verifyAdmin } = require('../middleware/auth');
const { isInMemoryDB, getMemoryStore } = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    let admin = null;
    if (isInMemoryDB()) {
      const store = getMemoryStore();
      admin = store.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    } else {
      admin = await Admin.findOne({ email: email.toLowerCase() });
    }

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign(
      { id: admin._id || admin.id, email: admin.email, name: admin.name, role: admin.role },
      process.env.JWT_SECRET || 'luxe_salon_jwt_secret_key_2026_super_secure',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin._id || admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', verifyAdmin, async (req, res) => {
  try {
    return res.json({
      success: true,
      admin: req.admin
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching user details.' });
  }
});

module.exports = router;
