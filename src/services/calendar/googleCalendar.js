// src/services/calendar/googleCalendar.js
import axios from 'axios';
import { auth } from '../../firebase/auth'; // Import auth directly here

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser; // Use directly
  if (currentUser) {
    try {
      const token = await currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error('Error getting Firebase ID token:', error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


class GoogleCalendarService {
  async initializeGoogleAuth() {
    try {
      const response = await api.get('/api/auth/google/url');
      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error('Backend did not provide a Google OAuth URL.');
        throw new Error('Failed to get Google OAuth URL from backend.');
      }
    } catch (error) {
      console.error('Error initializing Google auth:', error);
      throw error;
    }
  }

  // CORRECTED: No email parameter needed, backend uses Firebase UID from token
  async checkConnectionStatus() {
    try {
      const response = await api.get(`/api/auth/google/status`); // No query parameter
      return response.data;
    } catch (error) {
      console.error('Error checking calendar connection status:', error);
      return { connected: false, email: '' };
    }
  }

  // ... (rest of the methods like getEvents, disconnect, createEvent, updateEvent, deleteEvent, checkConflicts as I provided previously)

}

export default new GoogleCalendarService();