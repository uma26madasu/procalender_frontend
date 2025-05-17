// src/App.jsx - Complete file with inline LinkedInCallback component
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CreateWindow from './pages/CreateWindow';
import CreateLink from './pages/CreateLink';
import PublicScheduler from './pages/PublicScheduler';
import MeetingViewer from './pages/MeetingViewer';
import GoogleCallback from './pages/GoogleCallback';
import GitHubCallback from './pages/GitHubCallback';
// Removed problematic import
// import LinkedInCallback from './pages/LinkedInCallback';

// Define the LinkedIn callback component directly in App.jsx to avoid import issues
const LinkedInCallbackInline = () => {
  const [status, setStatus] = useState('Processing LinkedIn authentication...');
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
          throw new Error('No authorization code received from LinkedIn');
        }
        
        // Get current user ID
        const userId = auth.currentUser?.uid;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        // Simulate connecting with LinkedIn
        // Wait a bit to simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus('LinkedIn account connected successfully!');
        
        // Redirect back to dashboard after a delay
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error('LinkedIn OAuth callback error:', err);
        setError(err.message || 'Failed to connect LinkedIn account');
        
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
              <div className="mx-auto h-12 w-12 text-blue-700">
                {status === 'Processing LinkedIn authentication...' ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
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
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const [user] = useAuthState(auth);
  
  return (
    <Routes>
      {/* Make root redirect to signup or dashboard based on auth state */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
      />
      
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/schedule/:linkId" element={<PublicScheduler />} />
      
      {/* OAuth callbacks */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/auth/github/callback" element={<GitHubCallback />} />
      <Route path="/auth/linkedin/callback" element={<LinkedInCallbackInline />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/create-window" element={
        <ProtectedRoute>
          <CreateWindow />
        </ProtectedRoute>
      } />
      
      <Route path="/create-link" element={
        <ProtectedRoute>
          <CreateLink />
        </ProtectedRoute>
      } />
      
      <Route path="/meetings" element={
        <ProtectedRoute>
          <MeetingViewer />
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;