// Format date to a human-readable string
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  const options = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', options);
};

// Format time to a human-readable string
export const formatTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid Time';
  
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleTimeString('en-US', options);
};

// Format date and time to a human-readable string
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid DateTime';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', options);
};

// Format currency amount
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format number with commas
export const formatNumber = (number) => {
  if (number === null || number === undefined || isNaN(number)) return '0';
  
  return new Intl.NumberFormat('en-US').format(number);
};

// Format percentage
export const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  return `${Math.round(value * 100)}%`;
};

// Format job type (e.g., 'full-time' to 'Full Time')
export const formatJobType = (jobType) => {
  if (!jobType) return '';
  
  const typeMap = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'temporary': 'Temporary',
    'internship': 'Internship',
    'freelance': 'Freelance'
  };
  
  return typeMap[jobType.toLowerCase()] || jobType;
};

// Format experience level
export const formatExperienceLevel = (level) => {
  if (!level) return '';
  
  const levelMap = {
    'entry': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'executive': 'Executive Level',
    'intern': 'Internship'
  };
  
  return levelMap[level.toLowerCase()] || level;
};

// Format salary range
export const formatSalaryRange = (min, max, currency = 'USD') => {
  if (min === null || min === undefined || max === null || max === undefined) {
    return '';
  }
  
  if (min === max) {
    return `${formatCurrency(min, currency)}`;
  }
  
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
};

// Format job application status
export const formatApplicationStatus = (status) => {
  if (!status) return '';
  
  const statusMap = {
    'pending': 'Pending',
    'reviewed': 'Reviewed',
    'interview': 'Interview Scheduled',
    'rejected': 'Rejected',
    'offered': 'Offer Sent',
    'accepted': 'Accepted'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

// Format user role
export const formatUserRole = (role) => {
  if (!role) return '';
  
  const roleMap = {
    'jobseeker': 'Job Seeker',
    'employer': 'Employer',
    'admin': 'Administrator'
  };
  
  return roleMap[role.toLowerCase()] || role;
};

// Truncate text to a specified length
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + suffix;
};

// Capitalize first letter of each word
export const capitalizeWords = (text) => {
  if (!text) return '';
  
  return text.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Get initials from a full name
export const getInitials = (fullName) => {
  if (!fullName) return '';
  
  const names = fullName.split(' ');
  const initials = names.map(name => name.charAt(0).toUpperCase());
  
  return initials.join('');
};

// Calculate time ago from a date
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  
  if (interval >= 1) {
    return interval === 1 ? '1 year ago' : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? '1 month ago' : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? '1 day ago' : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
  }
  
  return seconds <= 1 ? 'Just now' : `${seconds} seconds ago`;
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number format
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[s.-]?[0-9]{3}[s.-]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

// Validate URL format
export const isValidURL = (url) => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlRegex.test(url);
};

// Generate a random ID
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Sort an array of objects by a key
export const sortByKey = (array, key, order = 'asc') => {
  return array.sort((a, b) => {
    if (a[key] < b[key]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

// Group array of objects by a key
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = (groups[item[key]] || []);
    group.push(item);
    groups[item[key]] = group;
    return groups;
  }, {});
};

// Filter array of objects by multiple criteria
export const filterByCriteria = (array, criteria) => {
  return array.filter(item => {
    return Object.keys(criteria).every(key => {
      const itemValue = item[key];
      const criteriaValue = criteria[key];
      
      // If criteria value is null or undefined, skip this filter
      if (criteriaValue === null || criteriaValue === undefined || criteriaValue === '') {
        return true;
      }
      
      // If item value is an array, check if it includes the criteria value
      if (Array.isArray(itemValue)) {
        return itemValue.some(val => {
          if (typeof val === 'string' && typeof criteriaValue === 'string') {
            return val.toLowerCase().includes(criteriaValue.toLowerCase());
          }
          return val === criteriaValue;
        });
      }
      
      // If both values are strings, do a case-insensitive search
      if (typeof itemValue === 'string' && typeof criteriaValue === 'string') {
        return itemValue.toLowerCase().includes(criteriaValue.toLowerCase());
      }
      
      // For all other cases, do a strict equality check
      return itemValue === criteriaValue;
    });
  });
};

// Deep merge two objects
export const deepMerge = (target, source) => {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] instanceof Object && key in target) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  
  return result;
};

// Get the current year
export const getCurrentYear = () => {
  return new Date().getFullYear();
};