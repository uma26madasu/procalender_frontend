import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateWindow from './pages/CreateWindow';
import CreateLink from './pages/CreateLink';
import PublicScheduler from './pages/PublicScheduler';
import MeetingViewer from './pages/MeetingViewer';
import GoogleCallback from './pages/GoogleCallback';

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
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/schedule/:linkId" element={<PublicScheduler />} />
        
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
        
        {/* Redirect root to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;