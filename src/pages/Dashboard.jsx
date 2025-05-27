// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, RefreshCw, Link, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import googleCalendarService from '../services/calendar/googleCalendar'; // Use the service

// Use Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    todayMeetings: 0,
    weekMeetings: 0,
    totalSlots: 0
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      showNotification(location.state.message, location.state.type || 'info');
      window.history.replaceState({}, document.title);
    }

    if (currentUser) { // Only check connection if a user is logged in
      checkCalendarConnection();
    } else {
      setLoading(false); // If no user, not connected and not loading
      setIsCalendarConnected(false);
    }
  }, [currentUser, location]);

  const showNotification = (message, type) => { /* ... */ };

  const checkCalendarConnection = async () => {
    setLoading(true);
    try {
      // CORRECTED: Call without email parameter
      const status = await googleCalendarService.checkConnectionStatus();
      setIsCalendarConnected(status.connected);
      if (status.connected) {
        // You can use status.email here if you want to display it
        // setCalendarEmail(status.email); // If you have a state for this
        fetchAndSetEvents();
      } else {
        setEvents([]); // Clear events if not connected
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setIsCalendarConnected(false);
      setEvents([]);
      showNotification('Failed to check calendar connection. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAndSetEvents = async () => {
    setRefreshing(true);
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

      // Update stats based on fetched events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);

      const todayMeetings = fetchedEvents.filter(event => {
        const eventStart = new Date(event.start?.dateTime || event.start?.date);
        return eventStart >= today && eventStart <= endOfDay;
      }).length;

      const weekMeetings = fetchedEvents.filter(event => {
        const eventStart = new Date(event.start?.dateTime || event.start?.date);
        return eventStart >= startOfWeek && eventStart <= endOfWeek;
      }).length;

      setStats({
        todayMeetings,
        weekMeetings,
        totalSlots: 0 // You need logic to calculate totalSlots if applicable
      });

    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      if (error.response && error.response.data && error.response.data.reconnect) {
        showNotification('Google Calendar connection expired. Please reconnect.', 'error');
        setIsCalendarConnected(false); // Indicate disconnection
      } else {
        showNotification('Failed to fetch events.', 'error');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleConnectCalendar = async () => {
    try {
      setLoading(true);
      await googleCalendarService.initializeGoogleAuth();
      // The redirect will handle the rest
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      showNotification('Failed to initiate Google Calendar connection.', 'error');
      setLoading(false);
    }
  };

  const handleDisconnectCalendar = async () => {
    try {
      setLoading(true);
      const success = await googleCalendarService.disconnect();
      if (success) {
        setIsCalendarConnected(false);
        setEvents([]);
        setStats({ todayMeetings: 0, weekMeetings: 0, totalSlots: 0 });
        showNotification('Google Calendar disconnected successfully.', 'success');
      } else {
        showNotification('Failed to disconnect Google Calendar.', 'error');
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      showNotification('An error occurred during disconnection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper for formatting dates and times
  const formatEventDate = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatEventTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Dashboard</h2>

        {/* Connection Status Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-indigo-600" />
            Google Calendar Connection
          </h3>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-medium flex items-center ${isCalendarConnected ? 'text-green-600' : 'text-red-600'}`}>
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" /> Checking status...
                </>
              ) : isCalendarConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" /> Connected
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 mr-2" /> Not Connected
                </>
              )}
            </span>
            <div>
              {isCalendarConnected ? (
                <button
                  onClick={handleDisconnectCalendar}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150"
                  disabled={loading || refreshing}
                >
                  Disconnect Calendar
                </button>
              ) : (
                <button
                  onClick={handleConnectCalendar}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
                  disabled={loading || refreshing}
                >
                  Connect Calendar
                </button>
              )}
            </div>
          </div>
          {isCalendarConnected && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Your calendar is connected! Events are shown below.</p>
              <button
                onClick={fetchAndSetEvents}
                className="mt-2 px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 flex items-center"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Events
              </button>
            </div>
          )}
        </div>

        {/* Meeting Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-semibold text-blue-800">Today's Meetings</h4>
            <p className="text-3xl font-bold text-blue-600">{stats.todayMeetings}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-semibold text-green-800">This Week's Meetings</h4>
            <p className="text-3xl font-bold text-green-600">{stats.weekMeetings}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-md text-center">
            <h4 className="text-lg font-semibold text-yellow-800">Total Available Slots</h4>
            <p className="text-3xl font-bold text-yellow-600">{stats.totalSlots}</p>
          </div>
        </div>

        {/* Upcoming Events List */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-indigo-600" /> Upcoming Calendar Events
          </h3>
          {loading ? (
            <p className="text-gray-600">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-600">No upcoming events found or calendar not connected.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{event.summary || 'No Title'}</h4>
                    {event.location && (
                      <p className="text-sm text-gray-600 mt-1">Location: {event.location}</p>
                    )}
                    <div className="mt-2 text-gray-600">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatEventDate(event.start?.dateTime || event.start?.date)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {formatEventTime(event.start?.dateTime || event.start?.date)} -
                          {formatEventTime(event.end?.dateTime || event.end?.date)}
                        </span>
                      </div>
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{event.attendees.length} attendee(s)</span>
                        </div>
                      )}
                    </div>
                    {event.htmlLink && (
                      <a
                        href={event.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-blue-600 hover:text-blue-700"
                      >
                        <Link className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;