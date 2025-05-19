import { axiosWithAuth } from '../utils/axios';

export const calendarService = {
  // Fetch user's calendars
  getCalendars: async () => {
    try {
      const response = await axiosWithAuth.get('https://www.googleapis.com/calendar/v3/users/me/calendarList');
      return response.data.items;
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw error;
    }
  },

  // Fetch events from a specific calendar
  getEvents: async (calendarId, timeMin, timeMax) => {
    try {
      const response = await axiosWithAuth.get(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
          params: {
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
          }
        }
      );
      return response.data.items;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Create a new event
  createEvent: async (calendarId, eventData) => {
    try {
      const response = await axiosWithAuth.post(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Create a tentative event
  createTentativeEvent: async (calendarId, eventData) => {
    try {
      // Add tentative status to event
      const tentativeEvent = {
        ...eventData,
        status: 'tentative',
        colorId: '5', // Light yellow color for tentative events
        transparency: 'transparent', // Don't block time until approved
        description: (eventData.description || '') + '\n\n[Status: Tentative - Pending Approval]'
      };
      
      const response = await axiosWithAuth.post(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        tentativeEvent
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating tentative event:', error);
      throw error;
    }
  },

  // Confirm a tentative event
  confirmEvent: async (calendarId, eventId) => {
    try {
      const response = await axiosWithAuth.patch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        {
          status: 'confirmed',
          colorId: '2', // Green color for confirmed events
          transparency: 'opaque', // Block time once approved
          description: (event.description || '').replace('[Status: Tentative - Pending Approval]', '[Status: Confirmed]')
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error confirming event:', error);
      throw error;
    }
  },

  // Reject a tentative event (delete it)
  rejectEvent: async (calendarId, eventId, reason = '') => {
    try {
      // First get the event to notify the attendee
      const event = await axiosWithAuth.get(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`
      );
      
      // Then delete the event
      await axiosWithAuth.delete(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`
      );
      
      // Return the deleted event data for notification purposes
      return {
        ...event.data,
        rejectionReason: reason
      };
    } catch (error) {
      console.error('Error rejecting event:', error);
      throw error;
    }
  },

  // Find free time slots
  findFreeBusy: async (calendars, timeMin, timeMax) => {
    try {
      const response = await axiosWithAuth.post(
        'https://www.googleapis.com/calendar/v3/freeBusy',
        {
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          items: calendars.map(calendar => ({ id: calendar.id }))
        }
      );
      return response.data.calendars;
    } catch (error) {
      console.error('Error checking free/busy:', error);
      throw error;
    }
  },

  // Update an existing event
  updateEvent: async (calendarId, eventId, updates) => {
    try {
      const response = await axiosWithAuth.patch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (calendarId, eventId) => {
    try {
      await axiosWithAuth.delete(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`
      );
      return true;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
};