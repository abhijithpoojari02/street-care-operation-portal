const Issue = require('../models/Issue');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Complaint = require('../models/Complaint');

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res) => {
  try {
    // Total counts
    const totalIssues = await Issue.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalWorkers = await Worker.countDocuments();
    const totalComplaints = await Complaint.countDocuments();

    // Issues by status
    const pendingIssues = await Issue.countDocuments({ status: 'Pending' });
    const inProgressIssues = await Issue.countDocuments({ status: 'In-Progress' });
    const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });

    // Issues by category
    const issuesByCategory = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Recent issues
    const recentIssues = await Issue.find()
      .populate('user', 'name email')
      .populate('assignedWorker', 'name employeeId')
      .sort({ createdAt: -1 })
      .limit(5);

    // Complaints status
    const actionTakenComplaints = await Complaint.countDocuments({ actionTaken: true });
    const pendingComplaints = await Complaint.countDocuments({ actionTaken: false });

    res.json({
      totals: {
        issues: totalIssues,
        users: totalUsers,
        workers: totalWorkers,
        complaints: totalComplaints
      },
      issuesByStatus: {
        pending: pendingIssues,
        inProgress: inProgressIssues,
        resolved: resolvedIssues
      },
      issuesByCategory,
      complaintStatus: {
        actionTaken: actionTakenComplaints,
        pending: pendingComplaints
      },
      recentIssues
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};