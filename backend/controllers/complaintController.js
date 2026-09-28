const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (User)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, latitude, longitude, address } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Video file is required' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address
      },
      video: `/uploads/videos/${req.file.filename}`,
      user: req.user._id
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's complaints
// @route   GET /api/complaints/my-complaints
// @access  Private (User)
exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark action taken on complaint
// @route   PATCH /api/complaints/:id/action
// @access  Private (Admin)
exports.markActionTaken = async (req, res) => {
  try {
    const { actionNotes } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.actionTaken = true;
    complaint.actionNotes = actionNotes || 'Action taken by admin';
    complaint.actionDate = Date.now();

    await complaint.save();

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};