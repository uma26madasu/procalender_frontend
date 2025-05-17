// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api';
import { auth } from '../firebase';

function Dashboard() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize with empty data
        setDashboardData({
          meetings: {
            upcoming: 0,
            nextMeeting: 'No upcoming meetings'
          },
          availabilityWindows: {
            count: 0,
            totalHours: 0
          },
          bookingLinks: {
            count: 0,
            active: 0
          }
        });
        
        // Initialize with empty activity data
        setRecentActivity([]);
        
        setIsLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "An error occurred loading the dashboard");
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-500">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Dashboard Error</h2>
            <p className="mt-2 text-sm text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading dashboard...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Navigation Bar */}
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex mt-4 space-x-4">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-md border border-gray-200 hover:bg-gray-100">
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/meetings')} 
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md border border-gray-200 hover:bg-gray-100"
          >
            Meetings
          </button>
          <button 
            onClick={handleSignOut} 
            className="px-4 py-2 text-sm font-medium text-red-600 bg-white rounded-md border border-gray-200 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Quick stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Meetings</h2>
          <div className="text-3xl font-bold text-blue-600">{dashboardData.meetings.upcoming}</div>
          <p className="text-sm text-gray-500 mt-1">Next: {dashboardData.meetings.nextMeeting}</p>
          <button 
            onClick={() => navigate('/meetings')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            View all meetings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Available Windows</h2>
          <div className="text-3xl font-bold text-green-600">{dashboardData.availabilityWindows.count}</div>
          <p className="text-sm text-gray-500 mt-1">
            {dashboardData.availabilityWindows.totalHours > 0 
              ? `Total hours: ${dashboardData.availabilityWindows.totalHours}` 
              : 'No availability set'}
          </p>
          <button 
            onClick={() => navigate('/create-window')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            Manage availability
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Booking Links</h2>
          <div className="text-3xl font-bold text-purple-600">{dashboardData.bookingLinks.count}</div>
          <p className="text-sm text-gray-500 mt-1">
            {dashboardData.bookingLinks.active > 0 
              ? `Active links: ${dashboardData.bookingLinks.active}` 
              : 'No booking links created'}
          </p>
          <button 
            onClick={() => navigate('/create-link')}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800"
          >
            Create new link
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/create-window')} 
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center"
          >
            <span className="mr-2">➕</span> Create Availability Window
          </button>
          <button 
            onClick={() => navigate('/create-link')} 
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center"
          >
            <span className="mr-2">🔗</span> Create Booking Link
          </button>
        </div>
      </div>
      
      {/* Recent activity section - only show when there's actual activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">No recent activity yet. Start by creating an availability window!</p>
              <button 
                onClick={() => navigate('/create-window')} 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create your first availability window
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <li key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${activity.iconBgColor} rounded-full p-2`}>
                      {activity.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                      {activity.timeAgo}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;