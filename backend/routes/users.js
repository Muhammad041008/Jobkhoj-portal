const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const query = {};

    // Apply filters
    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const total = await User.countDocuments(query);

    // Fetch users
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(Number(limit))
      .select('-password');

    res.json({
      users,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Only admin or the user themselves can view complete profile
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      // Return limited information for other users
      const limitedUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        companyLogo: user.companyLogo
      };
      return res.json(limitedUser);
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or User)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user exists
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is authorized to update
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Admin can update role, others cannot
    if (req.user.role !== 'admin' && req.body.role) {
      delete req.body.role;
    }

    // Update user
    user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete associated data based on user role
    if (user.role === 'employer') {
      // Find all jobs posted by this user
      const jobs = await Job.find({ postedBy: req.params.id });
      const jobIds = jobs.map(job => job._id);

      // Delete all applications for these jobs
      await Application.deleteMany({ job: { $in: jobIds } });

      // Delete all jobs
      await Job.deleteMany({ postedBy: req.params.id });
    } else if (user.role === 'jobseeker') {
      // Delete all applications submitted by this user
      await Application.deleteMany({ applicant: req.params.id });
    }

    // Delete user
    await user.remove();

    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users/analytics
// @desc    Get user analytics
// @access  Private (Admin only)
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    // Get user counts by role
    const userCountByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersLast30Days = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get active jobs count
    const activeJobsCount = await Job.countDocuments({
      status: 'Active',
      expiresAt: { $gte: new Date() }
    });

    // Get total applications count
    const totalApplicationsCount = await Application.countDocuments({});

    res.json({
      userCountByRole,
      newUsersLast30Days,
      activeJobsCount,
      totalApplicationsCount
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/:id/skills
// @desc    Update user skills
// @access  Private (Jobseeker only)
router.put('/:id/skills', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const { skills } = req.body;
    
    // Check if user exists
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is authorized
    if (req.user.id !== req.params.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update skills
    user.skills = skills;
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;