// src/contexts/CalendarContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import calendarService from '../services/calendar/calendar';

const CalendarContext = createContext();

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const { user } = useAuth(); // Changed from currentUser to user
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [calendarEmail, setCalendarEmail] = useState('');

  useEffect(() => {
    if (user?.email) {
      checkCalendarConnection();
    } else {
      setLoading(false);
      setIsConnected(false);
    }
  }, [user]); // Changed from currentUser to user

  const checkCalendarConnection = async () => {
    try {
      setLoading(true);
      const status = await calendarService.checkConnectionStatus(user.email); // Changed from currentUser to user
      setIsConnected(status.connected);
      if (status.connected) {
        setCalendarEmail(status.email);
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const connectCalendar = async () => {
    try {
      await calendarService.initializeGoogleAuth();
      // The user will be redirected to Google OAuth
    } catch (error) {
      console.error('Error connecting calendar:', error);
      throw error;
    }
  };

  const disconnectCalendar = async () => {
    try {
      const success = await calendarService.disconnect(user.email); // Changed from currentUser to user
      if (success) {
        setIsConnected(false);
        setCalendarEmail('');
        setEvents([]);
      }
      return success;
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      return false;
    }
  };

  const fetchEvents = async (params = {}) => {
    try {
      if (!isConnected) {
        console.log('Calendar not connected');
        return [];
      }
      const fetchedEvents = await calendarService.getEvents(params);
      setEvents(fetchedEvents);
      return fetchedEvents;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  };

  const getTodaysMeetings = async () => {
    try {
      if (!isConnected) return [];
      return await calendarService.getTodaysMeetings();
    } catch (error) {
      console.error('Error fetching today\'s meetings:', error);
      return [];
    }
  };

  const getWeekMeetings = async () => {
    try {
      if (!isConnected) return [];
      return await calendarService.getWeekMeetings();
    } catch (error) {
      console.error('Error fetching week meetings:', error);
      return [];
    }
  };

  const createEvent = async (eventData) => {
    try {
      if (!isConnected) {
        throw new Error('Calendar not connected');
      }
      const newEvent = await calendarService.createEvent(eventData);
      await fetchEvents(); // Refresh events
      return newEvent;
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
      const updatedEvent = await calendarService.updateEvent(eventId, updates);
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
      const success = await calendarService.deleteEvent(eventId);
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
      return await calendarService.checkConflicts(startTime, endTime);
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
    checkCalendarConnection
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext;