// backend/controllers/workerController.js
const Worker = require('../models/Worker');

// Get all workers (Admin only)
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    console.error('Get all workers error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Approve worker (Admin only)
exports.approveWorker = async (req, res) => {
  try {
    const workerId = req.params.id;

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Set approved
    worker.isApproved = true;
    await worker.save();

    return res.json({
      message: 'Worker approved successfully',
      worker,
    });
  } catch (error) {
    console.error('Approve worker error:', error);
    res.status(500).json({ message: error.message });
  }
};
