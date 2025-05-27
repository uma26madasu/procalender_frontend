// src/contexts/CalendarContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useAuth } from './AuthContext';
import googleCalendarService from '../services/calendar/googleCalendar'; // Renamed import to be consistent with file name

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Use currentUser as it's from AuthContext
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [calendarEmail, setCalendarEmail] = useState(''); // Keep this if you want to display the email

  // Use useCallback to memoize the function and prevent unnecessary re-renders/loops
  const checkCalendarConnection = useCallback(async () => {
    setLoading(true);
    try {
      // CORRECTED: Call without email parameter
      const status = await googleCalendarService.checkConnectionStatus();
      setIsConnected(status.connected);
      if (status.connected) {
        setCalendarEmail(status.email); // Set the email returned from the backend
        await fetchEvents(); // Fetch events if connected
      } else {
        setEvents([]); // Clear events if not connected
        setCalendarEmail(''); // Clear email
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setIsConnected(false);
      setEvents([]);
      setCalendarEmail('');
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  const fetchEvents = useCallback(async () => {
    if (!isConnected) return []; // Don't fetch if not connected
    try {
      const start = new Date();
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1); // Fetch for the next year

      const fetchedEvents = await googleCalendarService.getEvents({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        maxResults: 100 // Or whatever limit you need
      });
      setEvents(fetchedEvents);
      return fetchedEvents;
    } catch (error) {
      console.error('Error fetching events in CalendarContext:', error);
      setEvents([]); // Clear events on error
      // Potentially handle reconnection prompt if error.response.data.reconnect is true
      if (error.response && error.response.data && error.response.data.reconnect) {
         setIsConnected(false); // Indicate disconnection
         setCalendarEmail(''); // Clear email
      }
      return [];
    }
  }, [isConnected]); // Depends on isConnected state

  useEffect(() => {
    if (currentUser) {
      checkCalendarConnection();
    } else {
      setLoading(false);
      setIsConnected(false);
      setCalendarEmail('');
      setEvents([]); // Clear events if no user
    }
  }, [currentUser, checkCalendarConnection]); // Added checkCalendarConnection to dependencies

  const connectCalendar = async () => {
    try {
      await googleCalendarService.initializeGoogleAuth();
      // The redirect will handle the rest
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      throw error; // Propagate for UI to handle
    }
  };

  const disconnectCalendar = async () => {
    try {
      const success = await googleCalendarService.disconnect();
      if (success) {
        setIsConnected(false);
        setCalendarEmail('');
        setEvents([]);
      }
      return success;
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      throw error;
    }
  };

  const getTodaysMeetings = useCallback(async () => {
    if (!isConnected) return [];
    try {
      return await googleCalendarService.getTodaysMeetings();
    } catch (error) {
      console.error('Error getting today\'s meetings:', error);
      return [];
    }
  }, [isConnected]);

  const getWeekMeetings = useCallback(async () => {
    if (!isConnected) return [];
    try {
      return await googleCalendarService.getWeekMeetings();
    } catch (error) {
      console.error('Error getting week\'s meetings:', error);
      return [];
    }
  }, [isConnected]);

  const createEvent = async (eventDetails) => {
    try {
      if (!isConnected) {
        throw new Error('Calendar not connected');
      }
      const createdEvent = await googleCalendarService.createEvent(eventDetails);
      await fetchEvents(); // Refresh events after creation
      return createdEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (eventId, updates) => {
    try {
      if (!isConnected) {
        throw new Error('Calendar not connected');
      }
      // This will call the confirmEvent on the backend
      const updatedEvent = await googleCalendarService.updateEvent(eventId, updates);
      await fetchEvents(); // Refresh events
      return updatedEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      if (!isConnected) {
        throw new Error('Calendar not connected');
      }
      const success = await googleCalendarService.deleteEvent(eventId);
      if (success) {
        await fetchEvents(); // Refresh events
      }
      return success;
    } catch (error) {
      console.error('Error deleting event:', error);
      return false;
    }
  };

  const checkConflicts = async (startTime, endTime) => {
    try {
      if (!isConnected) {
        return { hasConflicts: false, conflicts: [] };
      }
      return await googleCalendarService.checkConflicts(startTime, endTime);
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return { hasConflicts: false, conflicts: [] };
    }
  };

  const value = {
    isConnected,
    loading,
    events,
    calendarEmail,
    connectCalendar,
    disconnectCalendar,
    fetchEvents,
    getTodaysMeetings,
    getWeekMeetings,
    createEvent,
    updateEvent,
    deleteEvent,
    checkConflicts,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};