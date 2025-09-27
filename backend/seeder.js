const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
  },
  {
    name: 'Employer One',
    email: 'employer1@example.com',
    password: 'employer123',
    role: 'employer',
    companyName: 'Tech Innovations',
    companyDescription: 'Leading technology company specializing in AI solutions',
    companyWebsite: 'https://techinnovations.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6) // 6 days ago
  },
  {
    name: 'Employer Two',
    email: 'employer2@example.com',
    password: 'employer123',
    role: 'employer',
    companyName: 'Global Solutions',
    companyDescription: 'Multinational company providing software services worldwide',
    companyWebsite: 'https://globalsolutions.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
  },
  {
    name: 'Jobseeker One',
    email: 'jobseeker1@example.com',
    password: 'jobseeker123',
    role: 'jobseeker',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
    experience: [
      {
        company: 'Web Experts',
        position: 'Frontend Developer',
        startDate: new Date(2020, 0, 1),
        endDate: new Date(2023, 0, 1),
        description: 'Developed and maintained web applications using React and Node.js'
      }
    ],
    education: [
      {
        institution: 'Computer Science University',
        degree: 'Bachelor',
        field: 'Computer Science',
        startYear: 2016,
        endYear: 2020
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4) // 4 days ago
  },
  {
    name: 'Jobseeker Two',
    email: 'jobseeker2@example.com',
    password: 'jobseeker123',
    role: 'jobseeker',
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
    experience: [
      {
        company: 'Data Analytics Inc.',
        position: 'Backend Developer',
        startDate: new Date(2019, 0, 1),
        endDate: new Date(2022, 0, 1),
        description: 'Built and scaled backend systems for data processing'
      }
    ],
    education: [
      {
        institution: 'Tech Institute',
        degree: 'Master',
        field: 'Software Engineering',
        startYear: 2014,
        endYear: 2016
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  }
];

const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'Tech Innovations',
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    salary: 120000,
    salaryType: 'Yearly',
    description: 'We are looking for a Senior Frontend Developer to join our team and help build amazing user experiences.',
    requirements: [
      '5+ years of experience with React and modern JavaScript',
      'Experience with state management libraries like Redux or Context API',
      'Strong understanding of responsive design principles'
    ],
    responsibilities: [
      'Develop and maintain user-facing features',
      'Collaborate with designers and backend developers',
      'Optimize applications for performance'
    ],
    skills: ['React', 'JavaScript', 'Redux', 'CSS', 'HTML'],
    experienceLevel: 'Senior Level',
    educationLevel: 'Bachelor\'s degree in Computer Science or related field',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },
  {
    title: 'Full Stack Developer',
    company: 'Tech Innovations',
    location: 'Remote',
    jobType: 'Full-time',
    salary: 100000,
    salaryType: 'Yearly',
    description: 'Join our team as a Full Stack Developer to build and maintain web applications from frontend to backend.',
    requirements: [
      '3+ years of experience with Node.js and React',
      'Experience with MongoDB or other NoSQL databases',
      'Knowledge of RESTful API design'
    ],
    responsibilities: [
      'Develop and maintain both frontend and backend code',
      'Work with product managers to implement new features',
      'Troubleshoot and debug issues across the stack'
    ],
    skills: ['Node.js', 'React', 'MongoDB', 'Express', 'JavaScript'],
    experienceLevel: 'Mid Level',
    educationLevel: 'Bachelor\'s degree in Computer Science or related field',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    title: 'Backend Developer',
    company: 'Global Solutions',
    location: 'New York, NY',
    jobType: 'Full-time',
    salary: 110000,
    salaryType: 'Yearly',
    description: 'We are seeking a Backend Developer to help build and scale our server-side applications.',
    requirements: [
      '4+ years of experience with Node.js',
      'Strong understanding of database systems',
      'Experience with API design and development'
    ],
    responsibilities: [
      'Design and implement RESTful APIs',
      'Optimize database queries for performance',
      'Collaborate with frontend developers'
    ],
    skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'AWS'],
    experienceLevel: 'Mid Level',
    educationLevel: 'Bachelor\'s degree in Computer Science or related field',
    status: 'Active',
    createdAt: new Date()
  },
  {
    title: 'UI/UX Designer',
    company: 'Global Solutions',
    location: 'Chicago, IL',
    jobType: 'Contract',
    salary: 80000,
    salaryType: 'Yearly',
    description: 'Join our team as a UI/UX Designer to create beautiful and intuitive user interfaces.',
    requirements: [
      '2+ years of experience in UI/UX design',
      'Proficiency with design tools like Figma or Adobe XD',
      'Understanding of user-centered design principles'
    ],
    responsibilities: [
      'Create wireframes and prototypes',
      'Design user interfaces that are both beautiful and functional',
      'Collaborate with developers to implement designs'
    ],
    skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD', 'User Research'],
    experienceLevel: 'Mid Level',
    educationLevel: 'Bachelor\'s degree in Design or related field',
    status: 'Active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  }
];

const seedDatabase = async () => {
  try {
    // Delete existing data
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log('Deleted existing data');

    // Create users with hashed passwords
    const hashedUsers = [];
    for (const user of sampleUsers) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      hashedUsers.push(user);
    }

    // Insert users
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Inserted users');

    // Assign employers to jobs
    const employer1 = createdUsers.find(user => user.email === 'employer1@example.com');
    const employer2 = createdUsers.find(user => user.email === 'employer2@example.com');

    // Add postedBy field to jobs
    sampleJobs[0].postedBy = employer1._id;
    sampleJobs[1].postedBy = employer1._id;
    sampleJobs[2].postedBy = employer2._id;
    sampleJobs[3].postedBy = employer2._id;

    // Insert jobs
    const createdJobs = await Job.insertMany(sampleJobs);
    console.log('Inserted jobs');

    // Create applications
    const jobseeker1 = createdUsers.find(user => user.email === 'jobseeker1@example.com');
    const jobseeker2 = createdUsers.find(user => user.email === 'jobseeker2@example.com');

    const applications = [
      {
        job: createdJobs[0]._id,
        applicant: jobseeker1._id,
        resume: 'uploads/resume1.pdf',
        coverLetter: 'I am excited to apply for the Senior Frontend Developer position...',
        status: 'Applied',
        score: 85
      },
      {
        job: createdJobs[1]._id,
        applicant: jobseeker1._id,
        resume: 'uploads/resume1.pdf',
        coverLetter: 'I would like to apply for the Full Stack Developer role...',
        status: 'Reviewed',
        score: 75
      },
      {
        job: createdJobs[2]._id,
        applicant: jobseeker2._id,
        resume: 'uploads/resume2.pdf',
        coverLetter: 'I am applying for the Backend Developer position...',
        status: 'Interviewed',
        score: 90
      }
    ];

    // Insert applications
    const createdApplications = await Application.insertMany(applications);
    console.log('Inserted applications');

    // Update jobs with application references
    for (const app of createdApplications) {
      await Job.findByIdAndUpdate(app.job, {
        $push: { applications: app._id }
      });
    }

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};