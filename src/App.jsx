import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MeetingViewer from './pages/MeetingViewer';
import CreateWindow from './pages/CreateWindow';
import CreateLink from './pages/CreateLink';
import PublicScheduler from './pages/PublicScheduler';
import { Card, Button } from './components/UI';
import SlotifyLogo from './components/SlotifyLogo';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [user, loading] = useAuthState(auth);
  
  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!authInitialized && !loading) {
        console.warn("Auth initialization timed out");
        setAuthInitialized(true);
        setAuthError("Authentication initialization timed out. Please try refreshing the page.");
      }
    }, 10000); // 10 second timeout
    
    // Check if Firebase Auth is available
    if (!auth) {
      console.error("Firebase auth not initialized");
      setAuthError("Firebase authentication failed to initialize");
      setAuthInitialized(true); // Set to true to exit loading state
      return () => clearTimeout(timeoutId);
    }
    
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        console.log("Auth state changed, user:", user ? "logged in" : "not logged in");
        setAuthInitialized(true);
      },
      (error) => {
        console.error("Auth state error:", error);
        setAuthError("Authentication error: " + error.message);
        setAuthInitialized(true); // Set to true to exit loading state
      }
    );
    
    return () => {
      clearTimeout(timeoutId);
      unsubscribe && unsubscribe();
    };
  }, [loading]);
  
  // Loading state
  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <SlotifyLogo size={48} showText className="mb-8" textClassName="text-xl" />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // Auth error state
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full p-6">
          <div className="text-center mb-6">
            <SlotifyLogo size={48} showText className="mx-auto mb-6" textClassName="text-xl" />
            <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h1>
            <p className="text-gray-700 mb-4">{authError}</p>
            <p className="text-gray-600 mb-6">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            fullWidth
          >
            Refresh Page
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage initialSignUp={false} />} />
      <Route path="/signup" element={<LoginPage initialSignUp={true} />} />
      <Route path="/book/:linkId" element={<PublicScheduler />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/meetings" element={
        <ProtectedRoute>
          <MeetingViewer />
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
      
      {/* 404 - Redirect to dashboard if logged in, otherwise to login */}
      <Route path="*" element={
        user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

export default App;