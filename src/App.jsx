import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CreateWindow from './pages/CreateWindow';
import CreateLink from './pages/CreateLink';
import PublicScheduler from './pages/PublicScheduler';
import MeetingViewer from './pages/MeetingViewer';
import GoogleCallback from './pages/GoogleCallback';
import GitHubCallback from './pages/GitHubCallback';
import LinkedInCallback from './pages/LinkedInCallback';

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
      {/* Make root redirect to login or dashboard based on auth state */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />
      
      {/* Public routes - both login and signup now use the same component */}
      <Route path="/login" element={<LoginPage initialSignUp={false} />} />
      <Route path="/signup" element={<LoginPage initialSignUp={true} />} />
      <Route path="/schedule/:linkId" element={<PublicScheduler />} />
      
      {/* OAuth callbacks */}
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/auth/github/callback" element={<GitHubCallback />} />
      <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
      
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