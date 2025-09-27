const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { handleUpload } = require('../middlewares/upload');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @route   POST /api/applications
// @desc    Submit a job application
// @access  Private (Jobseeker only)
router.post('/', protect, authorize('jobseeker'), handleUpload, async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create new application
    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      resume: req.file ? req.file.path : req.user.resume,
      coverLetter
    });

    // Save application to database
    await application.save();

    // Add application to job's applications array
    job.applications.push(application._id);
    await job.save();

    // Score the application (dummy AI logic)
    const score = await calculateApplicationScore(application._id);
    application.score = score;
    await application.save();

    res.status(201).json(application);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/applications
// @desc    Get all applications for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    let query = {};

    // If jobseeker, get their applications
    if (req.user.role === 'jobseeker') {
      query = { applicant: req.user.id };
    }
    // If employer, get applications for their jobs
    else if (req.user.role === 'employer') {
      const jobs = await Job.find({ postedBy: req.user.id }, '_id');
      const jobIds = jobs.map(job => job._id);
      query = { job: { $in: jobIds } };
    }
    // If admin, get all applications
    else if (req.user.role === 'admin') {
      query = {};
    }

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(Number(limit))
      .populate('job', 'title company location')
      .populate('applicant', 'name email skills');

    res.json({
      applications,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location description requirements')
      .populate('applicant', 'name email skills experience education resume profilePicture');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized to view this application
    if (
      req.user.role !== 'admin' &&
      req.user.id !== application.applicant.toString()
    ) {
      // For employers, check if they own the job
      const job = await Job.findById(application.job);
      if (!job || job.postedBy.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    }

    res.json(application);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Employer or Admin only)
router.put('/:id/status', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // For employers, check if they own the job
    if (req.user.role !== 'admin') {
      const job = await Job.findById(application.job);
      if (!job || job.postedBy.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    }

    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    res.json(application);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/applications/:id/note
// @desc    Add a note to an application
// @access  Private (Employer or Admin only)
router.put('/:id/note', protect, authorize('employer', 'admin'), async (req, res) => {
  try {
    const { content } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // For employers, check if they own the job
    if (req.user.role !== 'admin') {
      const job = await Job.findById(application.job);
      if (!job || job.postedBy.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
    }

    application.notes.push({
      author: req.user.id,
      content
    });

    await application.save();
    res.json(application);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Dummy AI logic to score applications
const calculateApplicationScore = async (applicationId) => {
  try {
    const application = await Application.findById(applicationId)
      .populate('job', 'skills requirements')
      .populate('applicant', 'skills experience education');

    if (!application) return 0;

    let score = 0;
    const { job, applicant } = application;

    // Calculate skill match (50% of total score)
    if (job.skills && job.skills.length > 0 && applicant.skills && applicant.skills.length > 0) {
      const matchingSkills = job.skills.filter(skill => 
        applicant.skills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(userSkill.toLowerCase())
        )
      );
      const skillScore = (matchingSkills.length / job.skills.length) * 50;
      score += skillScore;
    }

    // Calculate experience score (30% of total score)
    if (applicant.experience && applicant.experience.length > 0) {
      const totalExperienceYears = applicant.experience.reduce((total, exp) => {
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate);
          const end = new Date(exp.endDate);
          const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
          return total + years;
        }
        return total;
      }, 0);

      // Cap experience at 10 years for scoring
      const expScore = Math.min(totalExperienceYears / 10, 1) * 30;
      score += expScore;
    }

    // Calculate education score (20% of total score)
    if (applicant.education && applicant.education.length > 0) {
      // Simple logic: more education = higher score
      const eduScore = Math.min(applicant.education.length / 3, 1) * 20;
      score += eduScore;
    }

    return Math.round(score);
  } catch (error) {
    console.error('Error calculating application score:', error);
    return 0;
  }
};

module.exports = router;