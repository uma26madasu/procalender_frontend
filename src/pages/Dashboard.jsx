import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import apiService from '../api';
import { Card, Button, EmptyState, MainLayout } from '../components/UI';

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
      <MainLayout user={user} activePath="/dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 text-red-500">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="mt-2 text-lg font-bold text-gray-900">Dashboard Error</h2>
              <p className="mt-1 text-sm text-red-500">{error}</p>
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
      <MainLayout user={user} activePath="/dashboard">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout user={user} activePath="/dashboard">
      {/* Dashboard header with Slotify branding */}
      <div className="flex items-center justify-between py-4 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-sm mb-4 text-white">
        <div>
          <h1 className="text-xl font-bold">Welcome to <span className="font-extrabold tracking-tight">Slotify</span>, {user?.displayName || 'there'}!</h1>
          <p className="text-sm opacity-90">Manage your time effortlessly with Slotify</p>
        </div>
        <div className="text-sm opacity-90">
          <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button 
          onClick={() => navigate('/create-window')} 
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg flex items-center shadow-sm hover:shadow-md transition"
        >
          <div className="bg-blue-400 bg-opacity-30 rounded-full p-1 mr-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-sm font-medium">Create Availability</span>
        </button>
        
        <button 
          onClick={() => navigate('/create-link')} 
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg flex items-center shadow-sm hover:shadow-md transition"
        >
          <div className="bg-purple-400 bg-opacity-30 rounded-full p-1 mr-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            </svg>
          </div>
          <span className="text-sm font-medium">Create Booking Link</span>
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="p-4 card-hover">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-50 text-blue-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">Upcoming Meetings</div>
              <div className="text-lg font-bold text-gray-900">{dashboardData.meetings.upcoming}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-50 text-green-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">Availability Windows</div>
              <div className="text-lg font-bold text-gray-900">{dashboardData.availabilityWindows.count}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 card-hover">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-50 text-purple-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              </svg>
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500">Booking Links</div>
              <div className="text-lg font-bold text-gray-900">{dashboardData.bookingLinks.count}</div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
          {recentActivity.length > 0 && (
            <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              View all
            </button>
          )}
        </div>
        
        <Card className="p-4">
          {recentActivity.length === 0 ? (
            <EmptyState
              title="No recent activity yet"
              description="Start by creating an availability window or booking link to see your activity here."
              actionText="Create availability"
              onAction={() => navigate('/create-window')}
            />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentActivity.map((activity, index) => (
                <li key={index} className="py-2 hover:bg-gray-50 transition">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${activity.iconBgColor} rounded-full p-1`}>
                      {activity.icon}
                    </div>
                    <div className="ml-3">
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
