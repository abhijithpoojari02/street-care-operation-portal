const Issue = require('../models/Issue');
const { classifyWithConfidence } = require('../services/aiClassifier');

// @desc    Create a new issue with AI classification
// @route   POST /api/issues
// @access  Private (User)
exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, latitude, longitude, address } = req.body;

    // Use AI classification if category is not provided or is 'Other'
    let finalCategory = category;
    let aiClassified = false;
    let confidence = 0;

    if (!category || category === 'Other') {
      const classification = classifyWithConfidence(title, description);
      finalCategory = classification.category;
      aiClassified = true;
      confidence = classification.confidence;

      console.log(`✨ AI Classification: ${finalCategory} (Confidence: ${confidence}%)`);
    }

    const issue = await Issue.create({
      title,
      description,
      category: finalCategory,
      aiClassified,
      classificationConfidence: confidence,
      image: req.file ? `/uploads/images/${req.file.filename}` : null,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address
      },
      user: req.user._id
    });

    // Populate user details
    await issue.populate('user', 'name email phone');

    res.status(201).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's issues
// @route   GET /api/issues/my-issues
// @access  Private (User)
exports.getUserIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user._id })
      .populate('assignedWorker', 'name email employeeId specialization')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private (Admin)
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('user', 'name email phone')
      .populate('assignedWorker', 'name email employeeId specialization')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get issues by category (for admin dashboard filtering)
// @route   GET /api/issues/category/:category
// @access  Private (Admin)
exports.getIssuesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const issues = await Issue.find({ category })
      .populate('user', 'name email phone')
      .populate('assignedWorker', 'name email employeeId specialization')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get issue by ID
// @route   GET /api/issues/:id
// @access  Private
exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedWorker', 'name email employeeId specialization');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update issue status
// @route   PATCH /api/issues/:id/status
// @access  Private (Worker/Admin)
exports.updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Prevent Admin from marking as Resolved
    if (req.user && req.user.role === 'admin' && status === 'Resolved') {
      return res.status(403).json({ message: 'Admins cannot mark issues as Resolved. Only workers can do this.' });
    }

    // Prevent changing status if it's already Resolved
    if (issue.status === 'Resolved') {
      return res.status(400).json({ message: 'Issue is already Resolved and cannot be changed.' });
    }

    issue.status = status;
    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign worker to issue (only workers with matching specialization)
// @route   PATCH /api/issues/:id/assign
// @access  Private (Admin)
exports.assignWorkerToIssue = async (req, res) => {
  try {
    const { workerId } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Verify worker exists and has matching specialization
    const Worker = require('../models/Worker');
    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    if (!worker.isApproved) {
      return res.status(400).json({ message: 'Worker is not approved yet' });
    }

    // Check if worker specialization matches issue category
    if (worker.specialization !== issue.category && worker.specialization !== 'Other') {
      return res.status(400).json({
        message: `Worker specialization (${worker.specialization}) does not match issue category (${issue.category})`
      });
    }

    issue.assignedWorker = workerId;
    issue.status = 'In-Progress';
    await issue.save();

    const updatedIssue = await Issue.findById(req.params.id)
      .populate('assignedWorker', 'name email employeeId specialization')
      .populate('user', 'name email phone');

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit feedback on resolved issue
// @route   POST /api/issues/:id/feedback
// @access  Private (User)
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (issue.status !== 'Resolved') {
      return res.status(400).json({ message: 'Can only submit feedback on resolved issues' });
    }

    issue.feedback = {
      rating,
      comment,
      submittedAt: Date.now()
    };

    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get worker's assigned issues
// @route   GET /api/issues/worker/assigned
// @access  Private (Worker)
exports.getWorkerAssignedIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ assignedWorker: req.worker._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};