import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { getGoogleAuthUrl, isCalendarConnected as checkCalendarConnection, disconnectGoogleCalendar as disconnectGCal } from '../services/calendar/googleCalendar';

// Import components using the barrel pattern
import { MainLayout, Card, Button, Badge, Avatar, Alert, Modal } from '../components';

function Dashboard() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  
  // Calendar integration states
  const [isCalendarConnecting, setIsCalendarConnecting] = useState(false);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [calendarStats, setCalendarStats] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Approval workflow states
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [isLoadingApprovals, setIsLoadingApprovals] = useState(true);
  const [selectedForRejection, setSelectedForRejection] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Check if user has connected Google Calendar
  useEffect(() => {
    const checkCalendarConnectionStatus = async () => {
      try {
        // Use the isCalendarConnected function from googleCalendar.js
        const connected = checkCalendarConnection();
        setIsCalendarConnected(connected);
        
        if (connected) {
          // Fetch calendar stats from API instead of hardcoded values
          // This would typically be an API call
          const fetchCalendarStats = async () => {
            try {
              // Replace with actual API call
              // const response = await api.getCalendarStats();
              // setCalendarStats(response.data);
              
              // For now, just set loading state until API is implemented
              setCalendarStats(null);
            } catch (error) {
              console.error('Error fetching calendar stats:', error);
            }
          };
          
          fetchCalendarStats();
        }
      } catch (err) {
        console.error('Error checking calendar connection:', err);
      }
    };
    
    checkCalendarConnectionStatus();
  }, []);

  // Fetch pending approvals
  useEffect(() => {
    const fetchPendingApprovals = async () => {
      try {
        setIsLoadingApprovals(true);
        
        // Replace with actual API call
        // const response = await api.getPendingApprovals();
        // setPendingApprovals(response.data);
        // setIsLoadingApprovals(false);
        
        // Simulated API call - remove this when implementing real API
        setTimeout(() => {
          setPendingApprovals([]);
          setIsLoadingApprovals(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching approval requests:', err);
        setPendingApprovals([]);
        setIsLoadingApprovals(false);
      }
    };
    
    if (user) {
      fetchPendingApprovals();
    }
  }, [user]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Replace with actual API call
        // const response = await api.getDashboardData();
        // setDashboardData(response.data);
        // setIsLoading(false);
        
        // Simulated API call - remove this when implementing real API
        setTimeout(() => {
          // Initialize with empty/default structure instead of mock data
          setDashboardData({
            meetings: {
              upcoming: 0,
              today: 0,
              nextMeeting: null
            },
            availabilityWindows: {
              count: 0,
              totalHours: 0,
              mostPopular: null
            },
            bookingLinks: {
              count: 0,
              active: 0,
              mostUsed: null
            },
            analytics: {
              completedMeetings: 0,
              totalBooked: 0,
              averageDuration: 0
            },
            activity: []
          });
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "An error occurred loading the dashboard");
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Connect to Google Calendar
  const connectGoogleCalendar = async () => {
    try {
      setIsCalendarConnecting(true);
      // Get the auth URL from our service - note it doesn't need await anymore
      const authUrl = getGoogleAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      console.error('Error starting Google Auth flow:', err);
      setError('Failed to start Google Calendar authorization. Please try again.');
      setIsCalendarConnecting(false);
    }
  };
  
  // Disconnect Google Calendar
  const disconnectGoogleCalendar = async () => {
    try {
      // Use the function from googleCalendar.js
      await disconnectGCal();
      setIsCalendarConnected(false);
      setCalendarStats(null);
      setSuccessMessage('Google Calendar disconnected successfully.');
      setShowCalendarModal(false);
    } catch (err) {
      console.error('Error disconnecting calendar:', err);
      setError('Failed to disconnect Google Calendar. Please try again.');
    }
  };

  // Handle approval of booking request
  const handleApprove = async (approvalId) => {
    try {
      // In a real app, this would call your API to approve the booking
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from pending approvals
      setPendingApprovals(pendingApprovals.filter(a => a.id !== approvalId));
      
      setSuccessMessage('Booking request approved successfully!');
    } catch (err) {
      console.error('Error approving booking:', err);
      setError('Failed to approve booking request. Please try again.');
    }
  };

  // Handle rejection of booking request
  const handleReject = async () => {
    try {
      if (!selectedForRejection) return;
      
      // In a real app, this would call your API to reject the booking
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Remove from pending approvals
      setPendingApprovals(pendingApprovals.filter(a => a.id !== selectedForRejection));
      
      setSuccessMessage('Booking request rejected successfully.');
      setSelectedForRejection(null);
      setShowRejectionModal(false);
      setRejectionReason('');
    } catch (err) {
      console.error('Error rejecting booking:', err);
      setError('Failed to reject booking request. Please try again.');
    }
  };

  const [successMessage, setSuccessMessage] = useState('');

  // Loading skeleton state
  if (isLoading) {
    return (
      <MainLayout>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <MainLayout>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <svg
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Success Message */}
      {successMessage && (
        <Alert
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage('')}
          className="mb-6"
        />
      )}
      
      {/* Welcome Banner */}
      <Card className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Welcome back, {user?.displayName || 'there'}!</h2>
            <p className="mt-1 text-indigo-100">Manage your schedule and meeting links in one place.</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-3">
            <Button 
              variant="light" 
              onClick={() => navigate('/create-window')}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Create Availability
            </Button>
            <Button 
              onClick={() => navigate('/create-link')}
              className="bg-white text-indigo-700 hover:bg-indigo-50"
            >
              New Booking Link
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {/* Upcoming Meetings Card */}
        <Card className="hover:shadow-md transition-all duration-200" onClick={() => navigate('/meetings')}>
          <div className="flex items-start">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Upcoming Meetings</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{dashboardData.meetings.upcoming}</p>
                {dashboardData.meetings.today > 0 && (
                  <Badge variant="primary" size="sm" className="ml-2">
                    {dashboardData.meetings.today} today
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {dashboardData.meetings.nextMeeting && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">NEXT MEETING</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{dashboardData.meetings.nextMeeting.title}</p>
              <p className="text-xs text-gray-500">
                {dashboardData.meetings.nextMeeting.date} at {dashboardData.meetings.nextMeeting.time} with{' '}
                <span className="font-medium">{dashboardData.meetings.nextMeeting.clientName}</span>
              </p>
            </div>
          )}
        </Card>
        
        {/* Availability Windows Card */}
        <Card className="hover:shadow-md transition-all duration-200" onClick={() => navigate('/create-window')}>
          <div className="flex items-start">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Availability Windows</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{dashboardData.availabilityWindows.count}</p>
                {dashboardData.availabilityWindows.totalHours > 0 && (
                  <p className="ml-2 text-sm text-gray-500">
                    ({dashboardData.availabilityWindows.totalHours} hrs/week)
                  </p>
                )}
              </div>
            </div>
          </div>
          {dashboardData.availabilityWindows.mostPopular && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">MOST POPULAR WINDOW</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {dashboardData.availabilityWindows.mostPopular}
              </p>
            </div>
          )}
        </Card>
        
        {/* Booking Links Card */}
        <Card className="hover:shadow-md transition-all duration-200" onClick={() => navigate('/create-link')}>
          <div className="flex items-start">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Booking Links</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-gray-900">{dashboardData.bookingLinks.count}</p>
                <Badge 
                  variant="success" 
                  size="sm" 
                  className="ml-2"
                >
                  {dashboardData.bookingLinks.active} active
                </Badge>
              </div>
            </div>
          </div>
          {dashboardData.bookingLinks.mostUsed && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">MOST USED LINK</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {dashboardData.bookingLinks.mostUsed.name}
              </p>
              <p className="text-xs text-gray-500">
                Booked {dashboardData.bookingLinks.mostUsed.booked} times
              </p>
            </div>
          )}
        </Card>
        
        {/* Calendar Status Card */}
        <Card className="hover:shadow-md transition-all duration-200" onClick={() => isCalendarConnected ? setShowCalendarModal(true) : null}>
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Calendar Integration</p>
              <p className="text-lg font-bold text-gray-900">
                {isCalendarConnected ? 'Connected' : 'Not Connected'}
              </p>
            </div>
          </div>
          {isCalendarConnected && calendarStats ? (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">CALENDARS</p>
                  <p className="text-sm font-medium text-gray-900">{calendarStats.connectedCalendars}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">EVENTS</p>
                  <p className="text-sm font-medium text-gray-900">{calendarStats.upcomingEvents}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  connectGoogleCalendar();
                }}
                isLoading={isCalendarConnecting}
              >
                Connect Google Calendar
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Pending Approvals Section */}
      {!isLoadingApprovals && pendingApprovals.length > 0 && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <Badge variant="warning" className="mr-2">
                {pendingApprovals.length}
              </Badge>
              <h3 className="text-lg font-medium text-gray-900">Pending Approval Requests</h3>
            </div>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => navigate('/approvals')}
            >
              View all
            </Button>
          </div>
          
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div 
                key={approval.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-orange-100 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/approvals/${approval.id}`)}
              >
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-medium">
                    {approval.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{approval.clientName}</p>
                    <p className="text-sm text-gray-500">{approval.clientEmail}</p>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <p className="font-medium text-gray-900">{approval.meetingName}</p>
                  <p className="text-sm text-gray-500">
                    {approval.date} at {approval.time}
                  </p>
                </div>
                
                <div className="mt-3 sm:mt-0 flex space-x-2">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(approval.id);
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedForRejection(approval.id);
                      setShowRejectionModal(true);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Two Column Layout for Recent Activity and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => {/* View all activity */}}
            >
              View all
            </Button>
          </div>
          
          <div className="space-y-5">
            {dashboardData.activity.map((item) => (
              <div key={item.id} className="flex">
                <div className={`
                  flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
                  ${item.type === 'booking' ? 'bg-indigo-100 text-indigo-600' : 
                    item.type === 'link' ? 'bg-purple-100 text-purple-600' : 
                    'bg-emerald-100 text-emerald-600'}
                `}>
                  {item.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          {dashboardData.activity.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500">No recent activity yet</p>
            </div>
          )}
        </Card>
        
        {/* Quick Actions Card */}
        <Card>
          <h3 className="text-lg font-medium text-gray-900 mb-5">Quick Actions</h3>
          
          <div className="space-y-4">
            <div 
              className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer"
              onClick={() => navigate('/create-link')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded text-indigo-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Create Booking Link</h4>
                  <p className="text-xs text-gray-500">Generate shareable scheduling links</p>
                </div>
              </div>
            </div>
            
            <div 
              className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors cursor-pointer"
              onClick={() => navigate('/create-window')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-emerald-100 rounded text-emerald-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Set Availability</h4>
                  <p className="text-xs text-gray-500">Define your available time slots</p>
                </div>
              </div>
            </div>
            
            <div 
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => navigate('/meetings')}
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded text-blue-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">View Meetings</h4>
                  <p className="text-xs text-gray-500">Manage your upcoming meetings</p>
                </div>
              </div>
            </div>
            
            {/* Calendar Integration Card */}
            {isCalendarConnected ? (
              <div 
                className="p-4 border border-green-100 bg-green-50 rounded-lg cursor-pointer"
                onClick={() => setShowCalendarModal(true)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Calendar Connected</h4>
                    <p className="text-xs text-green-700">
                      {calendarStats?.primaryCalendar || 'Google Calendar'} is syncing automatically
                    </p>
                  </div>
                  <Badge variant="success" size="sm">Active</Badge>
                </div>
              </div>
            ) : (
              <div className="p-4 border border-indigo-100 bg-indigo-50 rounded-lg">
                <h4 className="text-sm font-medium text-indigo-900 mb-2">Connect Your Calendar</h4>
                <p className="text-xs text-indigo-700 mb-3">
                  Integrate with Google Calendar to automatically block unavailable times.
                </p>
                <Button 
                  variant="primary" 
                  size="sm" 
                  fullWidth 
                  className="justify-center"
                  onClick={connectGoogleCalendar}
                  isLoading={isCalendarConnecting}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" fill="#4285F4"/>
                    <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" fill="#4285F4"/>
                    <path d="M12 4.8V0C5.383 0 0 5.383 0 12h4.8c0-3.977 3.223-7.2 7.2-7.2z" fill="#34A853"/>
                    <path d="M19.2 12H24c0-6.617-5.383-12-12-12v4.8c3.977 0 7.2 3.223 7.2 7.2z" fill="#FBBC05"/>
                    <path d="M12 19.2c-3.977 0-7.2-3.223-7.2-7.2H0c0 6.617 5.383 12 12 12v-4.8z" fill="#EA4335"/>
                  </svg>
                  Connect Google Calendar
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

    </MainLayout>
  );
}

export default Dashboard;