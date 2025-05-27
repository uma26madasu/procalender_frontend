// src/utils/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CalendarProvider } from '@/contexts/CalendarContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Pages
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import Dashboard from '@/pages/Dashboard';
import BookingLinks from '@/pages/BookingLinks';
import CreateLink from '@/pages/CreateLink';
import CreateWindow from '@/pages/CreateWindow';
import PublicScheduler from '@/pages/PublicScheduler';
import GoogleCallback from '@/pages/GoogleCallback';
import HomePage from '@/pages/HomePage';

// Layout
import MainLayout from '@/components/layout/MainLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CalendarProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/book/:linkId" element={<PublicScheduler />} />
            
            {/* OAuth callback route */}
            <Route path="/google/callback" element={<GoogleCallback />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-links"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BookingLinks />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-link"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateLink />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-window"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CreateWindow />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Redirect any unknown routes to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </CalendarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;