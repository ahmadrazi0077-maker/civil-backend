const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // For now, accept hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
      return res.json({
        _id: '1',
        username: 'admin',
        email: 'admin@civilpro.com',
        role: 'admin',
        token: generateToken('1'),
      });
    }

    // If using MongoDB
    try {
      const admin = await Admin.findOne({ username });
      
      if (admin && (await admin.matchPassword(password))) {
        admin.lastLogin = new Date();
        await admin.save();

        return res.json({
          _id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          token: generateToken(admin._id),
        });
      }
    } catch (dbError) {
      console.log('Database not available, using demo credentials only');
    }

    res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  res.json({
    _id: '1',
    username: 'admin',
    email: 'admin@civilpro.com',
    role: 'admin',
  });
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  res.json({
    _id: '1',
    username: req.body.username || 'admin',
    email: req.body.email || 'admin@civilpro.com',
    role: 'admin',
  });
};

// Export all functions
module.exports = {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
};