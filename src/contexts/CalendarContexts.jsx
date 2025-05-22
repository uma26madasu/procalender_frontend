import React, { createContext, useState, useEffect, useContext } from 'react';
import googleCalendarService from '../services/calendar/googleCalendar';
import { useAuth } from './AuthContext';

export const CalendarContext = createContext(null);

export const CalendarProvider = ({ children }) => {
  const { user } = useAuth();
  const [calendars, setCalendars] = useState([]);
  const [events, setEvents] = useState([]);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Check if calendar is connected
  useEffect(() => {
    const checkConnection = () => {
      const connected = googleCalendarService.isConnected();
      setIsCalendarConnected(connected);
      
      if (connected && user) {
        // If connected, fetch initial data
        fetchCalendarData();
      } else {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, [user]);

  // Fetch calendar data
  const fetchCalendarData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get calendar list
      const calendarList = await googleCalendarService.getCalendarList();
      setCalendars(calendarList);

      // Get primary calendar
      const primaryCalendar = calendarList.find(cal => cal.primary) || calendarList[0];
      
      if (primaryCalendar) {
        // Fetch events from primary calendar
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        const calendarEvents = await googleCalendarService.getEvents(primaryCalendar.id, {
          timeMin: now.toISOString(),
          timeMax: thirtyDaysFromNow.toISOString(),
          singleEvents: true,
          orderBy: 'startTime'
        });
        
        setEvents(calendarEvents);
      }

      setLastSyncTime(new Date());
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);
      setError('Failed to fetch calendar data');
      setIsLoading(false);
    }
  };

  // Connect to Google Calendar
  const connectCalendar = () => {
    const authUrl = googleCalendarService.getAuthUrl();
    window.location.href = authUrl;
  };

  // Handle OAuth callback
  const handleAuthCallback = async (code) => {
    try {
      const success = await googleCalendarService.handleAuthCallback(code);
      if (success) {
        setIsCalendarConnected(true);
        await fetchCalendarData();
      }
      return success;
    } catch (err) {
      console.error('Failed to handle auth callback:', err);
      return false;
    }
  };

  // Disconnect from Google Calendar
  const disconnectCalendar = async () => {
    try {
      const success = await googleCalendarService.disconnect();
      if (success) {
        setIsCalendarConnected(false);
        setCalendars([]);
        setEvents([]);
        setLastSyncTime(null);
      }
      return success;
    } catch (err) {
      console.error('Failed to disconnect calendar:', err);
      return false;
    }
  };

  // Refresh calendar data
  const refreshCalendarData = async () => {
    if (isCalendarConnected) {
      await fetchCalendarData();
    }
  };

  // Create calendar event
  const createCalendarEvent = async (eventData) => {
    try {
      const primaryCalendar = calendars.find(cal => cal.primary) || calendars[0];
      if (!primaryCalendar) {
        throw new Error('No primary calendar found');
      }

      const event = await googleCalendarService.createEvent(primaryCalendar.id, eventData);
      
      // Refresh events list
      await refreshCalendarData();
      
      return event;
    } catch (err) {
      console.error('Failed to create calendar event:', err);
      throw err;
    }
  };

  // Update calendar event
  const updateCalendarEvent = async (eventId, eventData) => {
    try {
      const primaryCalendar = calendars.find(cal => cal.primary) || calendars[0];
      if (!primaryCalendar) {
        throw new Error('No primary calendar found');
      }

      const event = await googleCalendarService.updateEvent(primaryCalendar.id, eventId, eventData);
      
      // Refresh events list
      await refreshCalendarData();
      
      return event;
    } catch (err) {
      console.error('Failed to update calendar event:', err);
      throw err;
    }
  };

  // Delete calendar event
  const deleteCalendarEvent = async (eventId) => {
    try {
      const primaryCalendar = calendars.find(cal => cal.primary) || calendars[0];
      if (!primaryCalendar) {
        throw new Error('No primary calendar found');
      }

      await googleCalendarService.deleteEvent(primaryCalendar.id, eventId);
      
      // Refresh events list
      await refreshCalendarData();
      
      return true;
    } catch (err) {
      console.error('Failed to delete calendar event:', err);
      throw err;
    }
  };

  // Get calendar availability
  const getCalendarAvailability = async (timeMin, timeMax) => {
    try {
      const calendarIds = calendars.map(cal => cal.id);
      const busyPeriods = await googleCalendarService.getAvailability(calendarIds, timeMin, timeMax);
      return busyPeriods;
    } catch (err) {
      console.error('Failed to get calendar availability:', err);
      throw err;
    }
  };

  // Set up event listeners
  useEffect(() => {
    const handleCalendarUpdate = () => {
      // Refresh data when calendar is updated
      refreshCalendarData();
    };

    const handleConflictDetected = (data) => {
      // Handle conflict detection
      console.warn('Calendar conflict detected:', data);
      // You can emit this to other parts of your app or show a notification
    };

    googleCalendarService.addEventListener('calendar-updated', handleCalendarUpdate);
    googleCalendarService.addEventListener('conflict-detected', handleConflictDetected);

    // Start sync process if connected
    if (isCalendarConnected) {
      googleCalendarService.startSyncProcess();
    }

    // Cleanup
    return () => {
      googleCalendarService.removeEventListener('calendar-updated', handleCalendarUpdate);
      googleCalendarService.removeEventListener('conflict-detected', handleConflictDetected);
    };
  }, [isCalendarConnected]);

  // Context value
  const value = {
    // State
    calendars,
    events,
    isCalendarConnected,
    isLoading,
    error,
    lastSyncTime,
    
    // Actions
    connectCalendar,
    handleAuthCallback,
    disconnectCalendar,
    refreshCalendarData,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    getCalendarAvailability,
    
    // Direct service access for advanced use cases
    googleCalendarService
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

// Custom hook for using calendar context
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};