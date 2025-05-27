// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, RefreshCw, Link, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

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
    // Show any messages from navigation state (from GoogleCallback)
    if (location.state?.message) {
      showNotification(location.state.message, location.state.type || 'info');
      // Clear the state
      window.history.replaceState({}, document.title);
    }

    checkCalendarConnection();
  }, [currentUser, location]);

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white px-4 py-2 rounded-lg shadow-lg z-50`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  };

  const checkCalendarConnection = async () => {
    if (!currentUser?.email) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/auth/google/status?email=${encodeURIComponent(currentUser.email)}`
      );
      
      setIsCalendarConnected(response.data.connected);
      
      if (response.data.connected) {
        await loadCalendarData();
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarData = async () => {
    try {
      // Get the auth token from Firebase if available
      const token = await currentUser?.getIdToken();
      
      const response = await axios.get(`${API_BASE_URL}/api/google-calendar/events`, {
        params: {
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          maxResults: 50
        },
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (response.data.success) {
        const calendarEvents = response.data.data || [];
        setEvents(calendarEvents);
        
        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        
        const todayEvents = calendarEvents.filter(event => {
          const eventStart = new Date(event.start?.dateTime || event.start?.date);
          return eventStart >= today && eventStart <= todayEnd;
        });

        setStats({
          todayMeetings: todayEvents.length,
          weekMeetings: calendarEvents.length,
          totalSlots: 50 // Calculate based on your availability
        });
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
      if (error.response?.status === 401) {
        // Token might be expired, disconnect and ask to reconnect
        setIsCalendarConnected(false);
        showNotification('Calendar connection expired. Please reconnect.', 'error');
      }
    }
  };

  const handleConnectCalendar = () => {
    // Redirect to backend OAuth flow
    window.location.href = `${API_BASE_URL}/api/auth/google/url`;
  };

  const handleDisconnectCalendar = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/google/revoke`, {
        userId: currentUser?.uid,
        email: currentUser?.email
      });
      
      setIsCalendarConnected(false);
      setEvents([]);
      setStats({
        todayMeetings: 0,
        weekMeetings: 0,
        totalSlots: 0
      });
      
      showNotification('Google Calendar disconnected', 'success');
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      showNotification('Failed to disconnect calendar', 'error');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCalendarData();
    setRefreshing(false);
    showNotification('Calendar refreshed', 'success');
  };

  const formatEventTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {currentUser?.displayName || currentUser?.email}</p>
        </div>

        {/* Calendar Connection Status */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">Google Calendar</span>
              {isCalendarConnected ? (
                <span className="ml-3 flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Connected
                </span>
              ) : (
                <span className="ml-3 flex items-center text-gray-500">
                  <XCircle className="h-4 w-4 mr-1" />
                  Not connected
                </span>
              )}
            </div>
            {isCalendarConnected ? (
              <button
                onClick={handleDisconnectCalendar}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnectCalendar}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Calendar
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Meetings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.todayMeetings}</p>
              </div>
              <Clock className="h-10 w-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.weekMeetings}</p>
              </div>
              <Calendar className="h-10 w-10 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Available Slots</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalSlots}</p>
              </div>
              <Users className="h-10 w-10 text-purple-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Meetings</h2>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={!isCalendarConnected || refreshing}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isCalendarConnected 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => window.location.href = '/create-link'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Booking Link
            </button>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="bg-white rounded-lg shadow">
          {!isCalendarConnected ? (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Calendar</h3>
              <p className="text-gray-500 mb-4">
                Connect your Google Calendar to see your meetings and manage availability
              </p>
              <button
                onClick={handleConnectCalendar}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Connect Google Calendar
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Meetings</h3>
              <p className="text-gray-500">Your calendar is clear for the next 7 days</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {events.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {event.summary || 'Untitled Meeting'}
                      </h3>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
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