// API services for ProCalendar application
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function for handling API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || `API Error: ${response.status} ${response.statusText}`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }
  return response.json();
};

// General request function with authentication
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (credentials) => 
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    
  register: (userData) => 
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
    
  verifyToken: () => 
    request('/auth/verify'),
    
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// Meetings API
export const meetingsAPI = {
  getAll: (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    return request(`/meetings${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => 
    request(`/meetings/${id}`),
    
  create: (meetingData) => 
    request('/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    }),
    
  update: (id, meetingData) => 
    request(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meetingData),
    }),
    
  delete: (id) => 
    request(`/meetings/${id}`, {
      method: 'DELETE',
    }),
    
  getAvailability: (date) => 
    request(`/meetings/availability?date=${date}`),
};

// User API
export const userAPI = {
  getProfile: () => 
    request('/users/profile'),
    
  updateProfile: (userData) => 
    request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => 
    request('/dashboard/stats'),
    
  getUpcomingMeetings: () => 
    request('/dashboard/upcoming-meetings'),
    
  getRecentLinks: () => 
    request('/dashboard/recent-links'),
};

// Analytics API
export const analyticsAPI = {
  getProjectStats: () => 
    request('/analytics/projects'),
    
  getTaskStats: () => 
    request('/analytics/tasks'),
    
  getTeamMemberStats: () => 
    request('/analytics/team'),
    
  getActivityLog: () => 
    request('/analytics/activity'),
};

// Scheduler API
export const schedulerAPI = {
  getAvailableDates: (startDate, endDate) => 
    request(`/scheduler/available-dates?start=${startDate}&end=${endDate}`),
    
  getTimeSlots: (date) => 
    request(`/scheduler/time-slots?date=${date}`),
    
  scheduleAppointment: (appointmentData) => 
    request('/scheduler/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
};

// Export all APIs
export default {
  auth: authAPI,
  meetings: meetingsAPI,
  users: userAPI,
  dashboard: dashboardAPI,
  analytics: analyticsAPI,
  scheduler: schedulerAPI,
};