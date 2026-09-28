const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminOnly');

// Admin only route
router.get('/', protect, adminOnly, getAnalytics);

module.exports = router;