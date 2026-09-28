// middleware/adminOnly.js
function adminOnly(req, res, next) {
  // If req.user exists and role is admin -> continue
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  // Otherwise deny
  return res.status(403).json({ message: 'Access denied. Admin only.' });
}

module.exports = { adminOnly };
