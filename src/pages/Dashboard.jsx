import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, RefreshCw, Link, CheckCircle, XCircle } from 'lucide-react';
import googleCalendarService from '../services/calendar/googleCalendar';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    todayMeetings: 0,
    weekMeetings: 0,
    totalSlots: 0
  });
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check for OAuth callback parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const connected = urlParams.get('connected');
    const email = urlParams.get('email');
    const error = urlParams.get('error');

    if (connected === 'true' && email) {
      // Successfully connected
      setIsConnected(true);
      setUserEmail(decodeURIComponent(email));
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMessage.textContent = 'Google Calendar connected successfully!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Load calendar data
      loadCalendarData();
    } else if (error) {
      // Handle error
      console.error('OAuth error:', error);
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorMessage.textContent = 'Failed to connect Google Calendar. Please try again.';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        document.body.removeChild(errorMessage);
      }, 5000);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Check existing connection status
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      // Get user email from localStorage or your auth system
      const storedEmail = localStorage.getItem('userEmail') || userEmail;
      if (storedEmail) {
        const status = await googleCalendarService.checkConnectionStatus(storedEmail);
        setIsConnected(status.connected);
        if (status.connected) {
          setUserEmail(status.email);
          await loadCalendarData();
        }
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      
      // Get today's events
      const todayEvents = await googleCalendarService.getTodaysMeetings();
      
      // Get this week's events
      const weekEvents = await googleCalendarService.getEvents({
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });

      setEvents(weekEvents);
      setStats({
        todayMeetings: todayEvents.length,
        weekMeetings: weekEvents.length,
        totalSlots: 50 // You can calculate this based on your availability windows
      });
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectCalendar = () => {
    googleCalendarService.initializeGoogleAuth();
  };

  const handleDisconnectCalendar = async () => {
    try {
      // You might need to get userId from your auth system
      const userId = localStorage.getItem('userId');
      if (userId) {
        const success = await googleCalendarService.disconnect(userId);
        if (success) {
          setIsConnected(false);
          setEvents([]);
          setStats({
            todayMeetings: 0,
            weekMeetings: 0,
            totalSlots: 0
          });
        }
      }
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCalendarData();
    setRefreshing(false);
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
          <p className="mt-2 text-gray-600">Manage your meetings and availability</p>
        </div>

        {/* Connection Status */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700 font-medium">Google Calendar</span>
              {isConnected ? (
                <span className="ml-3 flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Connected ({userEmail})
                </span>
              ) : (
                <span className="ml-3 flex items-center text-gray-500">
                  <XCircle className="h-4 w-4 mr-1" />
                  Not connected
                </span>
              )}
            </div>
            {isConnected ? (
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
              disabled={!isConnected || refreshing}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isConnected 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule Meeting
            </button>
          </div>
        </div>

        {/* Calendar Events */}
        <div className="bg-white rounded-lg shadow">
          {!isConnected ? (
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
                        <span>{formatEventDate(event.start.dateTime || event.start.date)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>
                          {formatEventTime(event.start.dateTime || event.start.date)} - 
                          {formatEventTime(event.end.dateTime || event.end.date)}
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