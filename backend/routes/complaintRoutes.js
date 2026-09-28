const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  markActionTaken
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminOnly');
const { uploadVideo } = require('../config/multerConfig');

// User routes
router.post('/', protect, uploadVideo.single('video'), createComplaint);
router.get('/my-complaints', protect, getUserComplaints);

// Admin routes
router.get('/', protect, adminOnly, getAllComplaints);
router.patch('/:id/action', protect, adminOnly, markActionTaken);

module.exports = router;