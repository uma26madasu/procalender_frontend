// src/pages/Dashboard.jsx - COMPLETE WORKING VERSION
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, RefreshCw, Link, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import googleCalendarService from '../services/calendar/googleCalendar';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // States
  const [loading, setLoading] = useState(true);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    todayMeetings: 0,
    weekMeetings: 0,
    totalSlots: 0
  });
  const [refreshing, setRefreshing] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show notification function
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Check for URL params messages
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const message = urlParams.get('message');
    const type = urlParams.get('type');
    
    if (message) {
      showNotification(decodeURIComponent(message), type || 'info');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (location.state?.message) {
      showNotification(location.state.message, location.state.type || 'info');
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Initialize dashboard
  useEffect(() => {
    if (currentUser) {
      checkCalendarConnection();
    } else {
      setLoading(false);
      setIsCalendarConnected(false);
    }
  }, [currentUser]);

  // Check calendar connection status
  const checkCalendarConnection = async () => {
    setLoading(true);
    try {
      const status = await googleCalendarService.checkConnectionStatus();
      setIsCalendarConnected(status.connected);
      
      if (status.connected) {
        await fetchAndSetEvents();
      } else {
        setEvents([]);
        setStats({ todayMeetings: 0, weekMeetings: 0, totalSlots: 0 });
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
      setIsCalendarConnected(false);
      setEvents([]);
      showNotification('Failed to check calendar connection', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch events and update stats
  const fetchAndSetEvents = async () => {
    setRefreshing(true);
    try {
      // Get events for the next year
      const start = new Date();
      const end = new Date();
      end.setFullYear(end.getFullYear() + 1);

      const fetchedEvents = await googleCalendarService.getEvents({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        maxResults: 100
      });

      setEvents(fetchedEvents);
      updateStats(fetchedEvents);

    } catch (error) {
      console.error('Error fetching events:', error);
      
      if (error.message === 'RECONNECT_REQUIRED') {
        showNotification('Google Calendar connection expired. Please reconnect.', 'error');
        setIsCalendarConnected(false);
      } else {
        showNotification('Failed to fetch events', 'error');
      }
      
      setEvents([]);
    } finally {
      setRefreshing(false);
    }
  };

  // Update statistics based on events
  const updateStats = (eventsList) => {
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

    const todayMeetings = eventsList.filter(event => {
      const eventStart = new Date(event.start?.dateTime || event.start?.date);
      return eventStart >= today && eventStart <= endOfDay;
    }).length;

    const weekMeetings = eventsList.filter(event => {
      const eventStart = new Date(event.start?.dateTime || event.start?.date);
      return eventStart >= startOfWeek && eventStart <= endOfWeek;
    }).length;

    setStats({
      todayMeetings,
      weekMeetings,
      totalSlots: 0 // Implement this based on your needs
    });
  };

  // Connect Google Calendar
  const handleConnectCalendar = async () => {
    try {
      setLoading(true);
      showNotification('Connecting to Google Calendar...', 'info');
      await googleCalendarService.initializeGoogleAuth();
      // The page will redirect, so we don't need to do anything else
    } catch (error) {
      console.error('Error connecting Google Calendar:', error);
      showNotification('Failed to connect Google Calendar. Please try again.', 'error');
      setLoading(false);
    }
  };

  // Disconnect Google Calendar
  const handleDisconnectCalendar = async () => {
    try {
      setLoading(true);
      const success = await googleCalendarService.disconnect();
      
      if (success) {
        setIsCalendarConnected(false);
        setEvents([]);
        setStats({ todayMeetings: 0, weekMeetings: 0, totalSlots: 0 });
        showNotification('Google Calendar disconnected successfully', 'success');
      } else {
        showNotification('Failed to disconnect Google Calendar', 'error');
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      showNotification('An error occurred during disconnection', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Format helper functions
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

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
            notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
            'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
            {notification.message}
          </div>
        )}

        {/* Connection Status Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-indigo-600" />
            Google Calendar Connection
          </h3>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-medium flex items-center ${
              isCalendarConnected ? 'text-green-600' : 'text-red-600'
            }`}>
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
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} /> 
                Refresh Events
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
            <Calendar className="h-6 w-6 mr-2 text-indigo-600" /> 
            Upcoming Calendar Events
          </h3>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-gray-600">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <p className="text-gray-600 text-center p-8">
              {isCalendarConnected ? 'No upcoming events found.' : 'Connect your calendar to see events.'}
            </p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {events.map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {event.summary || 'No Title'}
                      </h4>
                      {event.location && (
                        <p className="text-sm text-gray-600 mt-1">📍 {event.location}</p>
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
                    </div>
                    {event.htmlLink && (
                      <a
                        href={event.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-blue-600 hover:text-blue-700"
                        title="Open in Google Calendar"
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