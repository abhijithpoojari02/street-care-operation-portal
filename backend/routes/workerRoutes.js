// backend/routes/workerRoutes.js
const express = require('express');
const router = express.Router();

// Correct imports:
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminOnly');

const {
  getAllWorkers,
  approveWorker,
} = require('../controllers/workerController');

// Admin: View all workers
router.get('/', protect, adminOnly, getAllWorkers);

// Admin: Approve worker
router.patch('/:id/approve', protect, adminOnly, approveWorker);

module.exports = router;
