// src/pages/GoogleCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // This page handles the redirect FROM your backend after OAuth
    // The backend should redirect here with query parameters
    const searchParams = new URLSearchParams(location.search);
    const connected = searchParams.get('connected');
    const email = searchParams.get('email');
    const error = searchParams.get('error');
    const details = searchParams.get('details');

    if (connected === 'true' && email) {
      // Successfully connected - redirect to dashboard with success message
      navigate('/dashboard', { 
        state: { 
          message: `Google Calendar connected successfully for ${decodeURIComponent(email)}!`,
          type: 'success'
        } 
      });
    } else if (error) {
      // Error occurred - redirect to dashboard with error message
      const errorMessage = details 
        ? `Failed to connect Google Calendar: ${decodeURIComponent(details)}`
        : 'Failed to connect Google Calendar. Please try again.';
      
      navigate('/dashboard', { 
        state: { 
          message: errorMessage,
          type: 'error'
        } 
      });
    } else {
      // No parameters - something went wrong
      navigate('/dashboard', { 
        state: { 
          message: 'Something went wrong with the Google Calendar connection.',
          type: 'error'
        } 
      });
    }
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing Google Calendar connection...</p>
      </div>
    </div>
  );
}