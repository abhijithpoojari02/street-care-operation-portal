const express = require('express');
const router = express.Router();
const {
  createIssue,
  getUserIssues,
  getAllIssues,
  getIssueById,
  updateIssueStatus,
  assignWorkerToIssue,
  submitFeedback,
  getWorkerAssignedIssues
} = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminOnly');
const { uploadImage } = require('../config/multerConfig');

// User routes
router.post('/', protect, uploadImage.single('image'), createIssue);
router.get('/my-issues', protect, getUserIssues);
router.post('/:id/feedback', protect, submitFeedback);

// Worker routes
router.get('/worker/assigned', protect, getWorkerAssignedIssues);
router.patch('/:id/status', protect, updateIssueStatus);

// Admin routes
router.get('/', protect, adminOnly, getAllIssues);
router.get('/:id', protect, getIssueById);
router.patch('/:id/assign', protect, adminOnly, assignWorkerToIssue);

module.exports = router;