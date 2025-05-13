import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
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
import DebugPage from './pages/DebugPage';
import FirebaseTest from './pages/FirebaseTest';
import FirebaseStatus from './pages/FirebaseStatus';

// Simple Homepage component
const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">ProCalender</h1>
        <p className="text-gray-600 text-center mb-6">Schedule meetings with ease</p>
        
        <div className="space-y-4">
          <a 
            href="/login" 
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-center rounded-md"
          >
            Login
          </a>
          
          <a 
            href="/signup" 
            className="block w-full py-2 px-4 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium text-center rounded-md"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

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
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/schedule/:linkId" element={<PublicScheduler />} />
      <Route path="/firebase-test" element={<FirebaseTest />} />
      <Route path="/firebase-status" element={<FirebaseStatus />} />
      
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
      <Route path="/debug" element={<DebugPage />} />
    </Routes>
  );
}

export default App;