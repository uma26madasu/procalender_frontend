import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { apiService, getLinkedInAuthUrl, disconnectLinkedIn, getGitHubAuthUrl, disconnectGitHub } from '../api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [windows, setWindows] = useState([]);
  const [links, setLinks] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [isGitHubConnected, setIsGitHubConnected] = useState(false);

  // Fetch user data and schedule information
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch data from your API
        // For now, initialize with empty arrays to show empty states
        setIsGoogleConnected(false);
        setIsLinkedInConnected(false);
        setIsGitHubConnected(false);
        setWindows([]);
        setLinks([]);
        setUpcomingMeetings([]);
        
        // Simulate API call completion
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
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
      // Call your API to get Google OAuth URL
      const response = await apiService.getGoogleAuthUrl();
      
      if (response.success) {
        // Redirect to Google OAuth URL
        window.location.href = response.url;
      } else {
        setError('Failed to generate Google authorization URL');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error connecting to Google:', err);
      setError('Failed to connect to Google Calendar. Please try again.');
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
      setLoading(false);
    } catch (err) {
      console.error('Error disconnecting from Google:', err);
      setError('Failed to disconnect from Google Calendar. Please try again.');
      setLoading(false);
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      setLoading(true);
      // Call your API to get LinkedIn OAuth URL
      const response = await getLinkedInAuthUrl();
      
      if (response.success) {
        // Redirect to the LinkedIn OAuth URL
        window.location.href = response.url;
      } else {
        setError('Failed to generate LinkedIn authorization URL');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error connecting to LinkedIn:', err);
      setError('Failed to connect to LinkedIn. Please try again.');
      setLoading(false);
    }
  };

  const handleDisconnectLinkedIn = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await disconnectLinkedIn(userId);
      
      if (response.success) {
        setIsLinkedInConnected(false);
      } else {
        setError('Failed to disconnect LinkedIn');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error disconnecting from LinkedIn:', err);
      setError('Failed to disconnect from LinkedIn. Please try again.');
      setLoading(false);
    }
  };

  const handleConnectGitHub = async () => {
    try {
      setLoading(true);
      // Call your API to get GitHub OAuth URL
      const response = await getGitHubAuthUrl();
      
      if (response.success) {
        // Redirect to the GitHub OAuth URL
        window.location.href = response.url;
      } else {
        setError('Failed to generate GitHub authorization URL');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error connecting to GitHub:', err);
      setError('Failed to connect to GitHub. Please try again.');
      setLoading(false);
    }
  };

  const handleDisconnectGitHub = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      const response = await disconnectGitHub(userId);
      
      if (response.success) {
        setIsGitHubConnected(false);
      } else {
        setError('Failed to disconnect GitHub');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error disconnecting from GitHub:', err);
      setError('Failed to disconnect from GitHub. Please try again.');
      setLoading(false);
    }
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
            <span className="text-gray-600">{auth.currentUser?.email}</span>
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

        {/* Stats summary cards */}
        <div className="mb-8">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Meetings
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {upcomingMeetings.length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Scheduling Links
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {links.length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Availability Windows
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {windows.length}
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Connected Services
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {(isGoogleConnected ? 1 : 0) + (isLinkedInConnected ? 1 : 0) + (isGitHubConnected ? 1 : 0)}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        {/* Connected Services */}
        <section className="mb-10 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connected Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Google Calendar */}
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
            
            {/* LinkedIn */}
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full mr-3">
                    <svg className="w-6 h-6 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">LinkedIn</h3>
                    <p className="text-sm text-gray-500">
                      {isLinkedInConnected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {isLinkedInConnected ? (
                  <button 
                    onClick={handleDisconnectLinkedIn}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={handleConnectLinkedIn}
                    className="px-3 py-1 bg-blue-700 text-white text-sm rounded-md"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
            
            {/* GitHub */}
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                    <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">GitHub</h3>
                    <p className="text-sm text-gray-500">
                      {isGitHubConnected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {isGitHubConnected ? (
                  <button 
                    onClick={handleDisconnectGitHub}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={handleConnectGitHub}
                    className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md"
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
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No availability windows</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first availability window.</p>
              <div className="mt-6">
                <Link
                  to="/create-window"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Window
                </Link>
              </div>
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
                          onClick={() => {
                            navigator.clipboard.writeText(link.url)
                              .then(() => alert('Link copied to clipboard!'))
                              .catch(err => console.error('Failed to copy link:', err));
                          }}
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
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No scheduling links</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first scheduling link to share with others.</p>
              <div className="mt-6">
                <Link
                  to="/create-link"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Link
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Upcoming Meetings */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Meetings</h2>
            <Link
              to="/meetings"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          
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
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming meetings</h3>
              <p className="mt-1 text-sm text-gray-500">When clients book time with you, you'll see their meetings here.</p>
              <div className="mt-6">
                <Link
                  to="/create-link"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Scheduling Link
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}