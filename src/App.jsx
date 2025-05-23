import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner'; // Fixed import (removed curly braces)

// Lazy load pages
const PublicDashboard = React.lazy(() => import('./pages/PublicDashboard'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const MeetingViewer = React.lazy(() => import('./pages/MeetingViewer'));
const Availability = React.lazy(() => import('./pages/ApprovalsPage'));
const BookingLinks = React.lazy(() => import('./pages/BookingLinks'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />; // Changed from LoadingScreen
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />; // Changed from LoadingScreen
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingSpinner />}> {/* Changed from LoadingScreen */}
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <PublicDashboard />
            </PublicRoute>
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          
          <Route path="/signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
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
          
          <Route path="/availability" element={
            <ProtectedRoute>
              <Availability />
            </ProtectedRoute>
          } />
          
          <Route path="/booking-links" element={
            <ProtectedRoute>
              <BookingLinks />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;