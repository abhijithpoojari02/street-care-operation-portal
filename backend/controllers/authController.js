const User = require('../models/User');
const Worker = require('../models/Worker');
const { generateToken } = require('../middleware/authMiddleware');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await User.create({
      name,
      email: normalizedEmail,
      password,
      phone,
      role: 'user', // Always create as user
    });

    // ✅ only message, no token (frontend will redirect to login)
    return res.status(201).json({
      message: 'Registration successful! Please login to continue.',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check for user (not admin)
    const user = await User.findOne({ email: normalizedEmail, role: 'user' });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Admin login (Only one admin can exist)
// @route   POST /api/auth/admin/login
// @access  Public
// @desc    Admin login (Only one admin can exist)
// @route   POST /api/auth/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase();

    // Check for THE admin user (only one exists)
    const admin = await User.findOne({ email: normalizedEmail, role: 'admin' });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials. Only authorized admin can login.' });
    }

    if (await admin.matchPassword(password)) {
      return res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id, admin.role),
      });
    }

    return res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Worker registration (self-registration, needs admin approval)
// @route   POST /api/auth/worker/register
// @access  Public
// @desc    Worker registration (self-registration, needs admin approval)
// @route   POST /api/auth/worker/register
// @access  Public
exports.registerWorker = async (req, res) => {
  try {
    const { name, email, password, phone, employeeId, specialization } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check if worker exists by email
    const workerExists = await Worker.findOne({ email: normalizedEmail });
    if (workerExists) {
      return res.status(400).json({ message: 'Worker with this email already exists' });
    }

    // Check if worker exists by employeeId
    const employeeExists = await Worker.findOne({ employeeId });
    if (employeeExists) {
      return res.status(400).json({ message: 'Worker with this employee ID already exists' });
    }

    // Create worker (not approved by default)
    const worker = await Worker.create({
      name,
      email: normalizedEmail,
      password,
      phone,
      employeeId,
      specialization,
      isApproved: false, // Needs admin approval
      isActive: true,
    });

    return res.status(201).json({
      message: 'Registration successful! Please wait for admin approval.',
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        employeeId: worker.employeeId,
        specialization: worker.specialization,
        isApproved: worker.isApproved,
      },
    });
  } catch (error) {
    console.error('Worker register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Worker login
// @route   POST /api/auth/worker/login
// @access  Public
exports.workerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    // Check for worker
    const worker = await Worker.findOne({ email: normalizedEmail });

    if (!worker) {
      return res.status(401).json({ message: 'Invalid worker credentials' });
    }

    if (!worker.isApproved) {
      return res
        .status(403)
        .json({ message: 'Your account is pending admin approval. Please contact administrator.' });
    }

    if (!worker.isActive) {
      return res
        .status(403)
        .json({ message: 'Your account has been deactivated. Please contact administrator.' });
    }

    if (await worker.matchPassword(password)) {
      return res.json({
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        employeeId: worker.employeeId,
        specialization: worker.specialization,
        role: 'worker',
        isApproved: worker.isApproved,
        token: generateToken(worker._id, 'worker'),
      });
    }

    return res.status(401).json({ message: 'Invalid worker credentials' });
  } catch (error) {
    console.error('Worker login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user/worker profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    if (req.user) {
      res.json(req.user);
    } else if (req.worker) {
      res.json(req.worker);
    } else {
      res.status(404).json({ message: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};