const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Employer and Admin)
router.post('/', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { 
      title, 
      company, 
      location, 
      jobType, 
      salary, 
      salaryType, 
      description, 
      requirements, 
      responsibilities, 
      skills, 
      experienceLevel, 
      educationLevel 
    } = req.body;

    // Create new job
    const job = new Job({
      title,
      company,
      location,
      jobType,
      salary,
      salaryType,
      description,
      requirements,
      responsibilities,
      skills,
      experienceLevel,
      educationLevel,
      postedBy: req.user.id
    });

    // Save job to database
    await job.save();

    res.status(201).json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs
// @desc    Get all jobs with filters and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, location, jobType, experienceLevel, sort, page = 1, limit = 10 } = req.query;
    const query = {
      status: 'Active',
      expiresAt: { $gte: new Date() }
    };

    // Apply filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const total = await Job.countDocuments(query);

    // Determine sort order
    let sortBy = { createdAt: -1 };
    if (sort === 'date-asc') {
      sortBy = { createdAt: 1 };
    } else if (sort === 'salary-desc') {
      sortBy = { salary: -1 };
    } else if (sort === 'salary-asc') {
      sortBy = { salary: 1 };
    }

    // Fetch jobs with filters, pagination, and sorting
    const jobs = await Job.find(query)
      .sort(sortBy)
      .skip(startIndex)
      .limit(Number(limit))
      .populate('postedBy', 'name email companyName companyLogo');

    // Increment view count for each job
    jobs.forEach(job => {
      Job.findByIdAndUpdate(job._id, { $inc: { views: 1 } }).exec();
    });

    res.json({
      jobs,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs/my-jobs
// @desc    Get jobs posted by the authenticated user
// @access  Private (Employer and Admin)
router.get('/my-jobs', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { postedBy: req.user._id };

    // Apply status filter if provided
    if (status && ['active', 'inactive', 'filled'].includes(status.toLowerCase())) {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    // Fetch jobs with filters
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email companyName companyLogo');

    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name email companyName companyLogo');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment view count
    await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Employer and Admin)
router.put('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update job
    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PATCH /api/jobs/:id/status
// @desc    Update job status
// @access  Private (Employer and Admin)
router.patch('/:id/status', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Active', 'Inactive', 'Filled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: Active, Inactive, Filled' });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update job status
    job.status = status;
    await job.save();

    res.json(job);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Employer and Admin)
router.delete('/:id', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user is the owner of the job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete associated applications
    await Application.deleteMany({ job: req.params.id });

    // Delete job
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs/my-jobs
// @desc    Get jobs posted by the authenticated user
// @access  Private
router.get('/my-jobs', protect, authorize('employer'), async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = { postedBy: req.user._id };

    // Apply status filter if provided
    if (status && ['active', 'inactive', 'filled'].includes(status.toLowerCase())) {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    // Fetch jobs with filters
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email companyName companyLogo');

    res.json(jobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs/user/:userId
// @desc    Get jobs posted by a user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const query = { postedBy: req.params.userId };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(Number(limit))
      .populate('postedBy', 'name email companyName companyLogo');

    res.json({
      jobs,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/jobs/match/:userId
// @desc    Get jobs matching user skills
// @access  Private (Jobseeker only)
router.get('/match/:userId', protect, authorize('jobseeker'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.skills.length) {
      return res.status(400).json({ message: 'User has no skills to match' });
    }

    // Find jobs that match user skills
    const matchingJobs = await Job.find({
      skills: { $in: user.skills },
      status: 'Active',
      expiresAt: { $gte: new Date() }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('postedBy', 'name email companyName companyLogo');

    res.json(matchingJobs);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;