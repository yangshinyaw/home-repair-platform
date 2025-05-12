const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware to check if user is an admin
const adminOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin only' });
  }
};

// Middleware to check if user is a professional
const professionalOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'professional') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Professional only' });
  }
};

// Middleware to check if user is a homeowner
const homeownerOnly = async (req, res, next) => {
  if (req.user && req.user.role === 'homeowner') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Homeowner only' });
  }
};

module.exports = { auth, adminOnly, professionalOnly, homeownerOnly };