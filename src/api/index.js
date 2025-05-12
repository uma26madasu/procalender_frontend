// src/api/index.js
const API_BASE = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';

console.log('API Base URL:', API_BASE);

// Check API connectivity on startup
fetch(`${API_BASE}/api/test`)
  .then(response => {
    if (response.ok) return response.json();
    throw new Error(`API test failed with status: ${response.status}`);
  })
  .then(data => console.log('API connectivity test:', data))
  .catch(error => console.error('API connectivity test failed:', error));

export const apiService = {
  // User and Authentication
  createUser: async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await response.json();
    } catch (error) {
      console.error('API Error in createUser:', error);
      return { success: false, message: error.message || 'Failed to create user' };
    }
  },
  
  // Google Calendar OAuth
  getGoogleAuthUrl: async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/google/url`);
      return await response.json();
    } catch (error) {
      console.error('API Error in getGoogleAuthUrl:', error);
      return { success: false, message: error.message || 'Failed to get Google auth URL' };
    }
  },
  
  // Remaining methods with error handling...
  // (keeping the same functionality but adding try/catch blocks)
  
  connectGoogleCalendar: async (code, userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/google/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, userId })
      });
      return await response.json();
    } catch (error) {
      console.error('API Error in connectGoogleCalendar:', error);
      return { success: false, message: error.message || 'Failed to connect Google Calendar' };
    }
  },
  
  disconnectGoogleCalendar: async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/google/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      return await response.json();
    } catch (error) {
      console.error('API Error in disconnectGoogleCalendar:', error);
      return { success: false, message: error.message || 'Failed to disconnect Google Calendar' };
    }
  },
  
  // Add other API methods with similar error handling
};

export default apiService;