const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Application must be for a job']
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Application must have an applicant']
  },
  resume: {
    type: String,
    required: [true, 'Please upload a resume']
  },
  coverLetter: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewed', 'Interviewed', 'Rejected', 'Accepted'],
    default: 'Applied'
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  notes: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);