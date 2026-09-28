// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  adminLogin,
  workerLogin,
  registerWorker,
  getProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin route
router.post('/admin/login', adminLogin);

// Worker routes
router.post('/worker/register', registerWorker);   // <-- THIS WAS MISSING
router.post('/worker/login', workerLogin);

// Protected route to get profile
router.get('/profile', protect, getProfile);

module.exports = router;
