const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Then check cookies (for admin panel)
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    // For API routes, return JSON; for admin pages, redirect to login
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    } else {
      return res.redirect('/admin/login');
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      throw new Error('User not found');
    }
    next();
  } catch (error) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    } else {
      return res.redirect('/admin/login');
    }
  }
};

module.exports = { protect };