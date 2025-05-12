// src/pages/GoogleCallback.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { apiService } from '../api';

export default function GoogleCallback() {
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the code from URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('No authorization code received');
        }
        
        // Get current user ID
        const userId = auth.currentUser?.uid;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        // Call your backend to handle the OAuth code exchange
        const response = await apiService.connectGoogleCalendar(code, userId);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to connect Google Calendar');
        }
        
        setStatus('Google Calendar connected successfully!');
        
        // Redirect back to dashboard after a delay
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Failed to connect Google Calendar');
        
        // Redirect back to dashboard after a delay
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };
    
    handleOAuthCallback();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          {!error ? (
            <>
              <div className="mx-auto h-12 w-12 text-blue-500">
                {status === 'Processing...' ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                ) : (
                  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">{status}</h2>
              <p className="mt-2 text-sm text-gray-500">
                You'll be redirected back to the dashboard shortly.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto h-12 w-12 text-red-500">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">Connection Failed</h2>
              <p className="mt-2 text-sm text-red-500">{error}</p>
              <p className="mt-2 text-sm text-gray-500">
                You'll be redirected back to the dashboard shortly.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}