import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the request headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Extract error message
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API endpoints
export const authService = {
  // Register a new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get current user profile
  getProfile: () => api.get('/auth/me'),
  
  // Update user profile
  updateProfile: (profileData) => api.put('/auth/me', profileData),
  
  // Upload resume
  uploadResume: (formData) => api.post('/auth/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Upload profile picture
  uploadProfilePicture: (formData) => api.post('/auth/upload-profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Job API endpoints
export const jobService = {
  // Create a new job
  createJob: (jobData) => api.post('/jobs', jobData),
  
  // Get all jobs with filters and pagination
  getJobs: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    return api.get(`/jobs?${queryParams.toString()}`);
  },
  
  // Get a single job by ID
  getJobById: (jobId) => api.get(`/jobs/${jobId}`),
  
  // Update a job
  updateJob: (jobId, jobData) => api.put(`/jobs/${jobId}`, jobData),
  
  // Delete a job
  deleteJob: (jobId) => api.delete(`/jobs/${jobId}`),
  
  // Get jobs by employer
  getJobsByEmployer: (employerId) => api.get(`/jobs/employer/${employerId}`),
  
  // Get current user's jobs
  getMyJobs: (status) => {
    const queryParams = new URLSearchParams();
    if (status) {
      queryParams.append('status', status);
    }
    return api.get(`/jobs/my-jobs?${queryParams.toString()}`);
  },
  
  // Update job status
  updateJobStatus: (jobId, status) => api.patch(`/jobs/${jobId}/status`, { status }),
  
  // Get matching jobs based on user profile
  getMatchingJobs: () => api.get('/jobs/match')
};

// Application API endpoints
export const applicationService = {
  // Submit a job application
  applyForJob: (jobId, applicationData) => api.post(`/jobs/${jobId}/apply`, applicationData),
  
  // Get all applications
  getApplications: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    return api.get(`/applications?${queryParams.toString()}`);
  },
  
  // Get a single application by ID
  getApplicationById: (applicationId) => api.get(`/applications/${applicationId}`),
  
  // Get applications for current user
  getMyApplications: () => api.get('/applications/my'),
  
  // Get applications for employer's jobs
  getEmployerApplications: () => api.get('/applications/employer'),
  
  // Update application status
  updateApplicationStatus: (applicationId, status) => api.put(
    `/applications/${applicationId}/status`, 
    { status }
  ),
  
  // Add notes to application
  addNotes: (applicationId, notes) => api.put(
    `/applications/${applicationId}/notes`, 
    { notes }
  )
};

// User API endpoints
export const userService = {
  // Get all users (admin only)
  getUsers: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    return api.get(`/users?${queryParams.toString()}`);
  },
  
  // Get a single user by ID
  getUserById: (userId) => api.get(`/users/${userId}`),
  
  // Update a user (admin or self)
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  
  // Delete a user (admin only)
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  
  // Update user skills (jobseeker)
  updateSkills: (skills) => api.put('/users/skills', { skills }),
  
  // Get user statistics (admin only)
  getStatistics: () => api.get('/users/stats')
};

// Helper function to handle form data for file uploads
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  return formData;
};

export default api;