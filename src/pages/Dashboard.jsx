import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import apiService from '../api';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

function Dashboard() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize with empty data
        // In a real app, fetch actual data from your API here
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
  
  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-red-500">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Dashboard Error</h2>
              <p className="mt-2 text-sm text-red-500">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-3">Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Dashboard header with welcome message and date */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.displayName || 'there'}!</h1>
            <p className="text-sm text-gray-600">Here's what's happening with your schedule today</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg shadow text-sm">
            <div className="text-gray-400">Today</div>
            <div className="text-lg font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Stats with improved cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card hover className="card-hover">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Upcoming Meetings</h3>
              <div className="flex items-end">
                <div className="text-3xl font-bold text-gray-900">{dashboardData.meetings.upcoming}</div>
                <div className="ml-2 text-sm text-gray-500 mb-1">
                  {dashboardData.meetings.upcoming === 0 ? 'No meetings scheduled' : `Next: ${dashboardData.meetings.nextMeeting}`}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => navigate('/meetings')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View schedule →
            </button>
          </div>
        </Card>

        <Card hover className="card-hover">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Available Windows</h3>
              <div className="flex items-end">
                <div className="text-3xl font-bold text-gray-900">{dashboardData.availabilityWindows.count}</div>
                <div className="ml-2 text-sm text-gray-500 mb-1">
                  {dashboardData.availabilityWindows.totalHours > 0 
                    ? `Total hours: ${dashboardData.availabilityWindows.totalHours}` 
                    : 'No availability set'}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => navigate('/create-window')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Manage availability →
            </button>
          </div>
        </Card>

        <Card hover className="card-hover">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 text-purple-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Booking Links</h3>
              <div className="flex items-end">
                <div className="text-3xl font-bold text-gray-900">{dashboardData.bookingLinks.count}</div>
                <div className="ml-2 text-sm text-gray-500 mb-1">
                  {dashboardData.bookingLinks.active > 0 
                    ? `Active links: ${dashboardData.bookingLinks.active}` 
                    : 'No booking links created'}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button onClick={() => navigate('/create-link')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Create new link →
            </button>
          </div>
        </Card>
      </div>

      {/* Quick Actions with nice gradient backgrounds */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/create-window')} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition"
          >
            <div className="bg-blue-400 bg-opacity-30 rounded-full p-2 mr-3">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-medium">Create Availability Window</span>
          </button>
          
          <button 
            onClick={() => navigate('/create-link')} 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition"
          >
            <div className="bg-purple-400 bg-opacity-30 rounded-full p-2 mr-3">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              </svg>
            </div>
            <span className="font-medium">Create Booking Link</span>
          </button>
        </div>
      </div>
      
      {/* Recent Activity with clean design */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          {recentActivity.length > 0 && (
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all
            </button>
          )}
        </div>
        
        <Card>
          {recentActivity.length === 0 ? (
            <EmptyState
              title="No recent activity yet"
              description="Start by creating an availability window or booking link to see your activity here."
              actionText="Create your first availability window"
              onAction={() => navigate('/create-window')}
              illustration="/illustrations/empty-state.svg" // Add a placeholder image path
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <li key={index} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${activity.iconBgColor} rounded-full p-2`}>
                      {activity.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-500">
                      {activity.timeAgo}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

export default Dashboard;