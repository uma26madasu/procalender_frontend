import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { apiService } from '../api';

export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [windows, setWindows] = useState([]);
  const [links, setLinks] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isHubspotConnected, setIsHubspotConnected] = useState(false);

  // Fetch user data and schedule information
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Mock data for development - replace with actual API calls
        // In a real implementation, you would fetch:
        // 1. User account status and connected services
        // 2. Scheduling windows
        // 3. Created scheduling links
        // 4. Upcoming meetings
        
        // Mock data
        setIsGoogleConnected(true); // Assuming user logged in with Google OAuth
        setIsHubspotConnected(false);
        
        setWindows([
          { id: 'w1', dayOfWeek: 'Monday', startHour: '09:00', endHour: '12:00' },
          { id: 'w2', dayOfWeek: 'Wednesday', startHour: '13:00', endHour: '17:00' },
          { id: 'w3', dayOfWeek: 'Friday', startHour: '10:00', endHour: '15:00' },
        ]);
        
        setLinks([
          { 
            id: 'l1', 
            name: 'Initial Consultation', 
            meetingLength: 30,
            created: '2025-05-01T12:00:00Z',
            usageCount: 5,
            url: 'https://procalender-frontend.vercel.app/schedule/l1'
          },
          { 
            id: 'l2', 
            name: 'Follow-up Session', 
            meetingLength: 45,
            created: '2025-05-05T09:30:00Z',
            usageCount: 2,
            url: 'https://procalender-frontend.vercel.app/schedule/l2'
          },
        ]);
        
        setUpcomingMeetings([
          {
            id: 'm1',
            clientName: 'John Smith',
            clientEmail: 'john@example.com',
            startTime: '2025-05-14T10:00:00Z',
            endTime: '2025-05-14T10:30:00Z',
            meetingName: 'Initial Consultation'
          },
          {
            id: 'm2',
            clientName: 'Sarah Johnson',
            clientEmail: 'sarah@example.com',
            startTime: '2025-05-15T14:00:00Z',
            endTime: '2025-05-15T14:45:00Z',
            meetingName: 'Follow-up Session'
          },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out. Please try again.');
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGoogleAuthUrl();
      
      if (response.success) {
        // Redirect to Google OAuth URL
        window.location.href = response.url;
      } else {
        setError('Failed to generate Google authorization URL');
      }
    } catch (err) {
      console.error('Error connecting to Google:', err);
      setError('Failed to connect to Google Calendar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await apiService.disconnectGoogleCalendar(userId);
      
      if (response.success) {
        setIsGoogleConnected(false);
      } else {
        setError('Failed to disconnect Google Calendar');
      }
    } catch (err) {
      console.error('Error disconnecting from Google:', err);
      setError('Failed to disconnect from Google Calendar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectHubspot = () => {
    // In a real implementation, this would redirect to HubSpot OAuth flow
    alert('This would redirect to HubSpot OAuth authorization');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Copy link to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">ProCalender Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Connected Services */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connected Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-7.5v4a1 1 0 0 1-2 0v-4H7a1 1 0 0 1 0-2h4V7a1 1 0 0 1 2 0v3.5h4a1 1 0 0 1 0 2h-4z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Google Calendar</h3>
                    <p className="text-sm text-gray-500">
                      {isGoogleConnected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {isGoogleConnected ? (
                  <button 
                    onClick={handleDisconnectGoogle}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={handleConnectGoogle}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full mr-3">
                    <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5h-3V4h3v3zm5 10h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5h-3V4h3v3zm5 10h-3v-8h3v8zm0-10h-3V4h3v3z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">HubSpot CRM</h3>
                    <p className="text-sm text-gray-500">
                      {isHubspotConnected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {isHubspotConnected ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Connected
                  </span>
                ) : (
                  <button 
                    onClick={handleConnectHubspot}
                    className="px-3 py-1 bg-orange-500 text-white text-sm rounded-md"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/create-window"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm2 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create Scheduling Window</h3>
                  <p className="text-gray-600">Set your regular availability hours</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/create-link"
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create Scheduling Link</h3>
                  <p className="text-gray-600">Generate a shareable booking link</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Availability Windows */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Availability Windows</h2>
            <Link
              to="/create-window"
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md"
            >
              Add Window
            </Link>
          </div>
          
          {windows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">Day</th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">Start Time</th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">End Time</th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {windows.map((window) => (
                    <tr key={window.id} className="border-b border-gray-200">
                      <td className="py-3 px-3">{window.dayOfWeek}</td>
                      <td className="py-3 px-3">{window.startHour}</td>
                      <td className="py-3 px-3">{window.endHour}</td>
                      <td className="py-3 px-3">
                        <button className="text-blue-500 hover:text-blue-700 mr-2">Edit</button>
                        <button className="text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No availability windows set. Add your first one to start scheduling.
            </div>
          )}
        </section>

        {/* Scheduling Links */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Scheduling Links</h2>
            <Link
              to="/create-link"
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md"
            >
              Create Link
            </Link>
          </div>
          
          {links.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">Meeting Name</th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">Duration</th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">Created</th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">Usage</th>
                    <th className="py-2 px-3 text-left text-gray-500 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id} className="border-b border-gray-200">
                      <td className="py-3 px-3">{link.name}</td>
                      <td className="py-3 px-3">{link.meetingLength} min</td>
                      <td className="py-3 px-3">{new Date(link.created).toLocaleDateString()}</td>
                      <td className="py-3 px-3">{link.usageCount} bookings</td>
                      <td className="py-3 px-3 flex">
                        <button 
                          onClick={() => copyToClipboard(link.url)}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                          title="Copy Link"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                          </svg>
                        </button>
                        <button className="text-blue-500 hover:text-blue-700 mr-3">Edit</button>
                        <button className="text-red-500 hover:text-red-700">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No scheduling links created yet. Create your first one to start booking meetings.
            </div>
          )}
        </section>

        {/* Upcoming Meetings */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
          
          {upcomingMeetings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="border rounded-md p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{meeting.meetingName}</h3>
                      <p className="text-sm text-gray-600">With: {meeting.clientName}</p>
                      <p className="text-sm text-gray-600">Email: {meeting.clientEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatDate(meeting.startTime)}</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No upcoming meetings scheduled.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}