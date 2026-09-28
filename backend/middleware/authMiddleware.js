// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Worker = require('../models/Worker');

async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user or worker from token
      if (decoded && (decoded.role === 'user' || decoded.role === 'admin')) {
        req.user = await User.findById(decoded.id).select('-password');
        return next();
      } else if (decoded && decoded.role === 'worker') {
        req.worker = await Worker.findById(decoded.id).select('-password');
        return next();
      } else {
        // token exists but role is not recognized
        return res.status(401).json({ message: 'Not authorized, invalid role' });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // no token provided
  return res.status(401).json({ message: 'Not authorized, no token' });
}

// Generate JWT Token
function generateToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
}

module.exports = {
  protect,
  generateToken,
};
