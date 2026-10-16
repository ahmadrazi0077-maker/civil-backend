const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Check if controller functions exist
console.log('Auth Controller loaded:', Object.keys(authController));

// Simple middleware for protected routes
const protect = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  next();
};

// Public routes
router.post('/login', authController.loginAdmin);

// Protected routes
router.get('/profile', protect, authController.getAdminProfile);
router.put('/profile', protect, authController.updateAdminProfile);

module.exports = router;