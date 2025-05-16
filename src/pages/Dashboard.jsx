// Import only apiService from the API file
import apiService from '../api';
// Import the OAuth config directly
import oauthConfig from '../config/oauth';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

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
      
      // Use the OAuth config to get the LinkedIn authorization URL
      if (!oauthConfig.linkedin.isConfigured()) {
        console.warn("LinkedIn OAuth is not configured properly.");
      }
      
      const authUrl = oauthConfig.linkedin.getAuthUrl();
      
      // Redirect to the LinkedIn OAuth URL
      window.location.href = authUrl;
      
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
      
      // This function would need to be implemented in your API
      const response = await apiService.disconnectLinkedIn(userId);
      
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
      
      // Use the OAuth config to get the GitHub authorization URL
      if (!oauthConfig.github.isConfigured()) {
        console.warn("GitHub OAuth is not configured properly.");
      }
      
      const authUrl = oauthConfig.github.getAuthUrl();
      
      // Redirect to the GitHub OAuth URL
      window.location.href = authUrl;
      
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
      
      // This function would need to be implemented in your API
      const response = await apiService.disconnectGitHub(userId);
      
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

  // Rest of the component remains the same...
  // The existing JSX for your Dashboard component goes here
}