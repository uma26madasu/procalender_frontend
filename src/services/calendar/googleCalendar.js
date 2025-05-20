import axios from '../utils/axios';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';
const GOOGLE_API_URL = 'https://www.googleapis.com/calendar/v3';
const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Google Calendar API Service
 * Handles all interactions with Google Calendar API
 */
class GoogleCalendarService {
  constructor() {
    this.tokens = null;
    this.syncInterval = null;
    this.eventListeners = {
      'calendar-updated': [],
      'conflict-detected': []
    };
    
    // Initialize from localStorage if available
    this.loadTokens();
  }

  /**
   * Load tokens from localStorage
   */
  loadTokens() {
    try {
      const tokensString = localStorage.getItem('googleCalendarTokens');
      if (tokensString) {
        this.tokens = JSON.parse(tokensString);
      }
    } catch (error) {
      console.error('Failed to load Google Calendar tokens:', error);
      this.tokens = null;
    }
  }

  /**
   * Save tokens to localStorage
   */
  saveTokens(tokens) {
    try {
      localStorage.setItem('googleCalendarTokens', JSON.stringify(tokens));
      this.tokens = tokens;
    } catch (error) {
      console.error('Failed to save Google Calendar tokens:', error);
    }
  }

  /**
   * Check if calendar is connected
   */
  isConnected() {
    return !!this.tokens;
  }

  /**
   * Get the authorization URL for Google Calendar
   */
  getAuthUrl() {
    return `${API_BASE_URL}/auth/google-calendar`;
  }

  /**
   * Handle the OAuth callback and save tokens
   */
  async handleAuthCallback(code) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google-calendar/callback`, { code });
      this.saveTokens(response.data.tokens);
      this.startSyncProcess();
      return true;
    } catch (error) {
      console.error('Failed to authenticate with Google Calendar:', error);
      return false;
    }
  }

  /**
   * Disconnect from Google Calendar
   */
  async disconnect() {
    try {
      if (this.tokens) {
        // Revoke access on Google's end
        await axios.post(`${API_BASE_URL}/auth/google-calendar/revoke`, {
          token: this.tokens.access_token
        });
      }
      
      // Clear local storage and stop sync
      localStorage.removeItem('googleCalendarTokens');
      this.tokens = null;
      this.stopSyncProcess();
      
      return true;
    } catch (error) {
      console.error('Failed to disconnect Google Calendar:', error);
      return false;
    }
  }
  
  /**
   * Add event listener
   */
  addEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }
  
  /**
   * Remove event listener
   */
  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event]
        .filter(cb => cb !== callback);
    }
  }
  
  /**
   * Emit event to all listeners
   */
  emitEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
    }
  }

  /**
   * Start the background sync process
   */
  startSyncProcess() {
    if (this.syncInterval) {
      this.stopSyncProcess();
    }
    
    // Perform initial sync
    this.syncCalendars();
    
    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.syncCalendars();
    }, SYNC_INTERVAL);
    
    // Set up webhook endpoint registration
    this.registerWebhooks();
  }
  
  /**
   * Stop the background sync process
   */
  stopSyncProcess() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    // Unregister webhooks
    this.unregisterWebhooks();
  }
  
  /**
   * Register webhooks for real-time updates
   */
  async registerWebhooks() {
    if (!this.tokens) return;
    
    try {
      // Get list of calendars
      const calendars = await this.getCalendarList();
      
      // Register webhook for each calendar
      for (const calendar of calendars) {
        await axios.post(`${API_BASE_URL}/webhooks/google-calendar/register`, {
          calendarId: calendar.id,
          token: this.tokens.access_token
        });
      }
    } catch (error) {
      console.error('Failed to register webhooks:', error);
    }
  }
  
  /**
   * Unregister webhooks
   */
  async unregisterWebhooks() {
    if (!this.tokens) return;
    
    try {
      await axios.post(`${API_BASE_URL}/webhooks/google-calendar/unregister`, {
        token: this.tokens.access_token
      });
    } catch (error) {
      console.error('Failed to unregister webhooks:', error);
    }
  }

  /**
   * Make authenticated request to Google Calendar API
   */
  async makeRequest(endpoint, method = 'GET', data = null) {
    if (!this.tokens) {
      throw new Error('Not authenticated with Google Calendar');
    }
    
    try {
      const response = await axios({
        method,
        url: `${GOOGLE_API_URL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.tokens.access_token}`
        },
        data
      });
      
      return response.data;
    } catch (error) {
      // Handle token expiration
      if (error.response && error.response.status === 401) {
        await this.refreshTokens();
        // Retry the request
        return this.makeRequest(endpoint, method, data);
      }
      
      throw error;
    }
  }
  
  /**
   * Refresh access token
   */
  async refreshTokens() {
    if (!this.tokens || !this.tokens.refresh_token) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google-calendar/refresh`, {
        refresh_token: this.tokens.refresh_token
      });
      
      this.saveTokens({
        ...this.tokens,
        access_token: response.data.access_token,
        expires_at: response.data.expires_at
      });
      
      return true;
    } catch (error) {
      console.error('Failed to refresh Google Calendar token:', error);
      return false;
    }
  }

  /**
   * Get list of user's calendars
   */
  async getCalendarList() {
    const data = await this.makeRequest('/users/me/calendarList');
    return data.items || [];
  }
  
  /**
   * Get calendar statistics
   */
  async getCalendarStats() {
    try {
      const calendars = await this.getCalendarList();
      
      // Find primary calendar
      const primaryCalendar = calendars.find(cal => cal.primary) || calendars[0];
      
      // Get upcoming events for the next 30 days
      const timeMin = new Date().toISOString();
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 30);
      
      const events = await this.getEvents(primaryCalendar.id, {
        timeMin,
        timeMax: timeMax.toISOString(),
        maxResults: 100
      });
      
      return {
        connectedCalendars: calendars.length,
        primaryCalendar: primaryCalendar.summary,
        upcomingEvents: events.length,
        lastSynced: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to get calendar stats:', error);
      throw error;
    }
  }
  
  /**
   * Get events from a specific calendar
   */
  async getEvents(calendarId, params = {}) {
    const queryParams = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
      
    const data = await this.makeRequest(`/calendars/${encodeURIComponent(calendarId)}/events?${queryParams}`);
    return data.items || [];
  }
  
  /**
   * Create an event in Google Calendar
   */
  async createEvent(calendarId, event) {
    return this.makeRequest(`/calendars/${encodeURIComponent(calendarId)}/events`, 'POST', event);
  }
  
  /**
   * Update an event in Google Calendar
   */
  async updateEvent(calendarId, eventId, event) {
    return this.makeRequest(`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, 'PUT', event);
  }
  
  /**
   * Delete an event from Google Calendar
   */
  async deleteEvent(calendarId, eventId) {
    return this.makeRequest(`/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`, 'DELETE');
  }

  /**
   * Get availability from Google Calendar
   * Returns busy periods
   */
  async getAvailability(calendarIds, timeMin, timeMax) {
    try {
      const response = await this.makeRequest('/freeBusy', 'POST', {
        timeMin,
        timeMax,
        items: calendarIds.map(id => ({ id }))
      });
      
      // Extract all busy periods
      const busyPeriods = [];
      Object.entries(response.calendars || {}).forEach(([calendarId, calendar]) => {
        (calendar.busy || []).forEach(period => {
          busyPeriods.push({
            calendarId,
            start: period.start,
            end: period.end
          });
        });
      });
      
      return busyPeriods;
    } catch (error) {
      console.error('Failed to get availability:', error);
      throw error;
    }
  }
  
  /**
   * Sync all calendars
   * This is the main function that keeps everything in sync
   */
  async syncCalendars() {
    if (!this.tokens) return;
    
    try {
      // 1. Get all calendars
      const calendars = await this.getCalendarList();
      
      // 2. Get local availability windows
      const availabilityWindows = await this.getLocalAvailabilityWindows();
      
      // 3. For each calendar, get events and update local availability
      for (const calendar of calendars) {
        // Skip secondary calendars if configured to do so
        if (!calendar.primary && !this.shouldSyncSecondaryCalendars()) {
          continue;
        }
        
        // Get events for this calendar
        const events = await this.getEvents(calendar.id, {
          timeMin: new Date().toISOString(),
          timeMax: this.getMaxSyncDate().toISOString(),
          singleEvents: true
        });
        
        // Update local availability based on events
        this.updateLocalAvailability(events, availabilityWindows);
      }
      
      // 4. Check for conflicts with scheduled meetings
      await this.detectConflicts();
      
      // 5. Emit calendar updated event
      this.emitEvent('calendar-updated', { timestamp: new Date().toISOString() });
      
    } catch (error) {
      console.error('Failed to sync calendars:', error);
    }
  }
  
  /**
   * Get max sync date (how far into the future to sync)
   */
  getMaxSyncDate() {
    const date = new Date();
    date.setDate(date.getDate() + 60); // Sync next 60 days
    return date;
  }
  
  /**
   * Check if secondary calendars should be synced
   */
  shouldSyncSecondaryCalendars() {
    // This could be a user preference
    return true;
  }
  
  /**
   * Get local availability windows from the database
   */
  async getLocalAvailabilityWindows() {
    try {
      const response = await axios.get(`${API_BASE_URL}/availability-windows`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get local availability windows:', error);
      return [];
    }
  }
  
  /**
   * Update local availability based on Google Calendar events
   */
  async updateLocalAvailability(events, availabilityWindows) {
    // Convert events to blocked periods
    const blockedPeriods = events.map(event => ({
      start: new Date(event.start.dateTime || `${event.start.date}T00:00:00`),
      end: new Date(event.end.dateTime || `${event.end.date}T23:59:59`),
      title: event.summary || 'Busy',
      sourceCalendarId: event.organizer ? event.organizer.email : null,
      eventId: event.id
    }));
    
    // Update local availability windows
    const updatedWindows = [];
    
    for (const window of availabilityWindows) {
      // Check if this window needs updating
      let windowUpdated = false;
      const newSlots = [];
      
      for (const slot of window.availableSlots) {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        let slotConflicts = false;
        
        // Check for conflicts with each blocked period
        for (const period of blockedPeriods) {
          // Check if there's an overlap
          if (
            (period.start <= slotStart && period.end > slotStart) ||
            (period.start < slotEnd && period.end >= slotEnd) ||
            (period.start >= slotStart && period.end <= slotEnd)
          ) {
            slotConflicts = true;
            windowUpdated = true;
            break;
          }
        }
        
        // If no conflicts, keep the slot
        if (!slotConflicts) {
          newSlots.push(slot);
        }
      }
      
      // Update the window if needed
      if (windowUpdated) {
        const updatedWindow = {
          ...window,
          availableSlots: newSlots
        };
        
        updatedWindows.push(updatedWindow);
        
        // Save to database
        await axios.put(`${API_BASE_URL}/availability-windows/${window.id}`, updatedWindow);
      }
    }
    
    return updatedWindows;
  }
  
  /**
   * Detect conflicts between scheduled meetings and Google Calendar events
   */
  async detectConflicts() {
    try {
      // 1. Get all scheduled meetings
      const response = await axios.get(`${API_BASE_URL}/meetings`, {
        params: { status: 'confirmed' }
      });
      const meetings = response.data || [];
      
      // 2. Get all calendar IDs
      const calendars = await this.getCalendarList();
      const calendarIds = calendars.map(cal => cal.id);
      
      // 3. Check each meeting for conflicts
      for (const meeting of meetings) {
        // Skip meetings that are already completed
        if (new Date(meeting.end) < new Date()) {
          continue;
        }
        
        // Get busy periods from Google Calendar during meeting time
        const busyPeriods = await this.getAvailability(
          calendarIds,
          meeting.start,
          meeting.end
        );
        
        // If there are busy periods, this meeting has a conflict
        if (busyPeriods.length > 0) {
          // Emit conflict event
          this.emitEvent('conflict-detected', {
            meeting,
            conflictingEvents: busyPeriods
          });
          
          // Mark the meeting as having a conflict in the database
          await axios.put(`${API_BASE_URL}/meetings/${meeting.id}`, {
            ...meeting,
            hasConflict: true,
            conflictDetails: busyPeriods
          });
        }
      }
    } catch (error) {
      console.error('Failed to detect conflicts:', error);
    }
  }
  
  /**
   * Handle webhook notification 
   * This should be called by the backend when a webhook is received
   */
  async handleWebhookNotification(data) {
    // Triggered when a webhook notification is received
    // Force an immediate sync
    await this.syncCalendars();
  }
}

// Create and export a singleton instance
const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;

// Utility functions for module export
export const getGoogleAuthUrl = () => googleCalendarService.getAuthUrl();
export const isCalendarConnected = () => googleCalendarService.isConnected();
export const disconnectGoogleCalendar = () => googleCalendarService.disconnect();
export const getCalendarStats = () => googleCalendarService.getCalendarStats();