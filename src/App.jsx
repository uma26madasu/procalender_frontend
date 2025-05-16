// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Pages
import LoginPage from './pages/LoginPage';
import DebugPage from './pages/DebugPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import CreateWindow from './pages/CreateWindow';
import CreateLink from './pages/CreateLink';
import PublicScheduler from './pages/PublicScheduler';
import MeetingViewer from './pages/MeetingViewer';
import GoogleCallback from './pages/GoogleCallback';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [authError, setAuthError] = useState(null);
  
  useEffect(() => {
    // Check if Firebase is properly initialized
    if (auth === null) {
      setAuthError('Firebase authentication is not initialized. Check your configuration.');
    }
  }, []);
  
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md w-full">
          <h2 className="font-bold mb-2">Authentication Error</h2>
          <p>{authError}</p>
        </div>
      </div>
    );
  }
  
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
  console.log('App component rendering');
  
  return (
    <Routes>
      {/* Public routes - Make SignupPage the default landing page */}
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/schedule/:linkId" element={<PublicScheduler />} />
      <Route path="/debug" element={<DebugPage />} />
      
      {/* OAuth callback */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      
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
    </Routes>
  );
}

export default App;