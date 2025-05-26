// src/services/calendar/googleCalendar.js
import axios from 'axios';

// Use your backend API URL
const API_BASE_URL = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'https://procalender-backend.onrender.com';

// Create axios instance with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class GoogleCalendarService {
  // Initialize Google OAuth flow
  async initializeGoogleAuth() {
    try {
      const response = await api.get('/api/auth/google/url');
      if (response.data.success && response.data.url) {
        // Redirect to Google OAuth
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error initializing Google auth:', error);
      throw error;
    }
  }

  // Check if Google Calendar is connected
  async checkConnectionStatus(email) {
    try {
      const response = await api.get(`/api/auth/google/status?email=${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      console.error('Error checking connection status:', error);
      return { connected: false };
    }
  }

  // List user's calendars
  async listCalendars() {
    try {
      const response = await api.get('/api/google-calendar/calendars');
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error listing calendars:', error);
      return [];
    }
  }

  // Get calendar events
  async getEvents(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        calendarId: params.calendarId || 'primary',
        startDate: params.startDate || new Date().toISOString(),
        endDate: params.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        limit: params.limit || 50
      });

      const response = await api.get(`/api/google-calendar/events?${queryParams}`);
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  // Create a new event
  async createEvent(event) {
    try {
      const response = await api.post('/api/google-calendar/events', {
        calendarId: 'primary',
        event
      });
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update an event
  async updateEvent(eventId, updates) {
    try {
      const response = await api.put(`/api/google-calendar/events/${eventId}`, {
        calendarId: 'primary',
        event: updates
      });
      return response.data.success ? response.data.data : null;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete an event
  async deleteEvent(eventId) {
    try {
      const response = await api.delete(`/api/google-calendar/events/${eventId}?calendarId=primary`);
      return response.data.success;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  }

  // Check for conflicts
  async checkConflicts(startTime, endTime) {
    try {
      const response = await api.post('/api/google-calendar/check-conflicts', {
        startTime,
        endTime,
        calendarIds: ['primary']
      });
      return response.data;
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return { hasConflicts: false, conflicts: [] };
    }
  }

  // Disconnect Google Calendar
  async disconnect(userId) {
    try {
      const response = await api.post('/api/auth/google/revoke', { userId });
      return response.data.success;
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      return false;
    }
  }

  // Register webhook for real-time updates
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

  // Get upcoming meetings count
  async getUpcomingMeetingsCount() {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7); // Next 7 days

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

  // Get today's meetings
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
}

export default new GoogleCalendarService();