// src/services/calendar/googleCalendar.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const { auth } = await import('../../firebase/auth');
  const currentUser = auth.currentUser;

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
      const response = await api.get(`/api/auth/google/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking calendar connection status:', error);
      return { connected: false, email: '' };
    }
  }

  async getEvents({ startDate, endDate, maxResults = 100 }) { // Increased default maxResults to match backend controller
    try {
      const response = await api.get('/api/google-calendar/events', {
        params: { startDate, endDate, maxResults }
      });
      return response.data.events || [];
    } catch (error) {
      console.error('Error getting calendar events:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      const response = await api.post('/api/auth/google/revoke');
      return response.data.success;
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      return false;
    }
  }

  async registerWebhook() {
    try {
      const response = await api.post('/api/google-calendar/register-webhook', {
        calendarId: 'primary'
      });
      return response.data.success;
    } catch (error) {
      console.error('Error registering webhook:', error);
      return false;
    }
  }

  async getUpcomingMeetingsCount() {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);

      const events = await this.getEvents({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      return events.length;
    } catch (error) {
      console.error('Error getting upcoming meetings count:', error);
      return 0;
    }
  }

  async getTodaysMeetings() {
    try {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const events = await this.getEvents({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      return events;
    } catch (error) {
      console.error('Error getting today\'s meetings:', error);
      return [];
    }
  }

  async getWeekMeetings() {
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(today);
      endDate.setDate(today.getDate() + (6 - today.getDay()));
      endDate.setHours(23, 59, 59, 999);

      const events = await this.getEvents({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      return events;
    } catch (error) {
      console.error('Error getting week\'s meetings:', error);
      return [];
    }
  }

  // CORRECTED: Endpoint URL to match backend's /api/google-calendar/create-event
  async createEvent(eventDetails) {
    try {
      const response = await api.post('/api/google-calendar/create-event', eventDetails);
      return response.data.event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // CORRECTED: Changed to call backend's confirmEvent endpoint (PATCH method)
  async updateEvent(eventId, updates) {
    try {
      // Assuming 'updates' might contain calendarId if needed for confirmation
      const calendarId = updates?.calendarId || 'primary';
      const response = await api.patch(`/api/google-calendar/events/${eventId}/confirm`, { calendarId });
      return response.data.event;
    } catch (error) {
      console.error('Error confirming event:', error); // Updated log message
      throw error;
    }
  }

  async deleteEvent(eventId) {
    try {
      const response = await api.delete(`/api/google-calendar/events/${eventId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  async checkConflicts(startTime, endTime) {
    try {
      const response = await api.get('/api/google-calendar/check-conflicts', {
        params: { startTime, endTime }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking conflicts:', error);
      throw error;
    }
  }
}

export default new GoogleCalendarService();