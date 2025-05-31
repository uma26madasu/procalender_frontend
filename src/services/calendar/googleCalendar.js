// src/services/calendar/googleCalendar.js - ADD DEBUG LOGGING
import axios from 'axios';
import { auth } from '../../firebase/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    try {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Firebase token added to request:', token.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ Error getting Firebase ID token:', error);
    }
  } else {
    console.log('⚠️ No current user - request without auth token');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

class GoogleCalendarService {
  async initializeGoogleAuth() {
    try {
      console.log('🚀 Starting Google auth initialization...');
      const response = await api.get('/api/auth/google/url');
      console.log('📱 Backend response:', response.data);
      
      if (response.data.success && response.data.url) {
        console.log('✅ Redirecting to:', response.data.url);
        window.location.href = response.data.url;
      } else {
        console.error('❌ Backend did not provide a Google OAuth URL:', response.data);
        throw new Error('Failed to get Google OAuth URL from backend.');
      }
    } catch (error) {
      console.error('❌ Error initializing Google auth:', error);
      if (error.response) {
        console.error('Backend error response:', error.response.data);
      }
      throw error;
    }
  }

  // ENHANCED: Add comprehensive debugging
  async checkConnectionStatus() {
    try {
      console.log('🔍 Checking Google Calendar connection status...');
      console.log('🔗 API URL:', `${API_BASE_URL}/api/auth/google/status`);
      console.log('👤 Current user:', auth.currentUser?.email || 'No user');
      
      const response = await api.get('/api/auth/google/status');
      console.log('📊 Connection status response:', response.data);
      
      // Validate response structure
      if (typeof response.data.connected !== 'boolean') {
        console.warn('⚠️ Backend returned invalid connection status:', response.data);
        return { connected: false, email: '' };
      }
      
      if (response.data.connected) {
        console.log('✅ Google Calendar is connected for:', response.data.email);
      } else {
        console.log('❌ Google Calendar is not connected');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error checking calendar connection status:', error);
      
      if (error.response) {
        console.error('Backend error details:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Check for specific error types
        if (error.response.status === 401) {
          console.error('🚫 Authentication failed - Firebase token might be invalid');
        } else if (error.response.status === 403) {
          console.error('🚫 Forbidden - User might not have access');
        } else if (error.response.status === 500) {
          console.error('💥 Server error - Backend issue');
        }
      } else if (error.request) {
        console.error('🌐 Network error - No response from backend:', error.request);
      } else {
        console.error('⚠️ Request setup error:', error.message);
      }
      
      return { connected: false, email: '' };
    }
  }

  // Add other methods as needed...
  async getEvents(params) {
    try {
      console.log('📅 Fetching events with params:', params);
      const response = await api.get('/api/calendar/events', { params });
      console.log('📊 Events response:', response.data);
      return response.data.events || [];
    } catch (error) {
      console.error('❌ Error fetching events:', error);
      if (error.response?.data?.reconnect) {
        console.error('🔄 Need to reconnect Google Calendar');
      }
      throw error;
    }
  }

  async disconnect() {
    try {
      console.log('🔌 Disconnecting Google Calendar...');
      const response = await api.post('/api/auth/google/disconnect');
      console.log('📊 Disconnect response:', response.data);
      return response.data.success;
    } catch (error) {
      console.error('❌ Error disconnecting calendar:', error);
      return false;
    }
  }
}

// Export function for other components
export const getGoogleAuthUrl = async () => {
  try {
    const response = await api.get('/api/auth/google/url');
    if (response.data.success && response.data.url) {
      return response.data.url;
    } else {
      throw new Error('Failed to get Google OAuth URL from backend.');
    }
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
    throw error;
  }
};

export default new GoogleCalendarService();