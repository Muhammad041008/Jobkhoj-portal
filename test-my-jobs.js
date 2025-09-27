const axios = require('axios');

// This script tests the MyJobs functionality
// Make sure the backend is running on http://localhost:5000

const BASE_URL = 'http://localhost:5000/api';
let token = '';
let testJobId = '';

// Test authentication first to get a token
const login = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    token = response.data.token;
    console.log('Authentication successful. Token obtained.');
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test creating a job (for testing status update)
const createTestJob = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/jobs`, {
      title: 'Test Developer Position',
      company: 'Test Company',
      location: 'Remote',
      jobType: 'Full-time',
      description: 'This is a test job posting for API testing purposes.',
      status: 'Active'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    testJobId = response.data._id;
    console.log('Test job created successfully. Job ID:', testJobId);
  } catch (error) {
    console.error('Create test job failed:', error.response?.data || error.message);
  }
};

// Test getting my jobs endpoint
const testGetMyJobs = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/my-jobs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Get my jobs successful:', response.data.length, 'jobs found');
  } catch (error) {
    console.error('Get my jobs failed:', error.response?.data || error.message);
  }
};

// Test updating job status endpoint
const testUpdateJobStatus = async () => {
  if (!testJobId) {
    console.log('No job available to test status update');
    return;
  }
  
  try {
    // Toggle between active and inactive
    const currentStatus = Math.random() > 0.5 ? 'Inactive' : 'Active';
    const response = await axios.patch(`${BASE_URL}/jobs/${testJobId}/status`, 
      { status: currentStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(`Job status updated to ${currentStatus}:`, response.data);
  } catch (error) {
    console.error('Update job status failed:', error.response?.data || error.message);
  }
};

// Test deleting the test job
const testDeleteJob = async () => {
  if (!testJobId) {
    console.log('No job available to test deletion');
    return;
  }
  
  try {
    await axios.delete(`${BASE_URL}/jobs/${testJobId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Test job deleted successfully');
  } catch (error) {
    console.error('Delete job failed:', error.response?.data || error.message);
  }
};

// Run all tests
const runTests = async () => {
  console.log('Starting tests for MyJobs functionality...\n');
  try {
    await login();
    console.log('\nStep 1: Creating a test job...');
    await createTestJob();
    
    console.log('\nStep 2: Fetching user\'s jobs...');
    await testGetMyJobs();
    
    console.log('\nStep 3: Testing job status update...');
    await testUpdateJobStatus();
    
    console.log('\nStep 4: Testing job deletion...');
    await testDeleteJob();
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Tests failed to complete:', error);
    
    // Clean up: try to delete the test job if it was created
    if (testJobId) {
      try {
        await axios.delete(`${BASE_URL}/jobs/${testJobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Test job cleaned up successfully');
      } catch (cleanupError) {
        console.error('Failed to clean up test job:', cleanupError);
      }
    }
  }
};

runTests();