// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import AuthForm from './components/AuthForm';
import Dashboard from './pages/Dashboard';
import FeaturesPage from './pages/FeaturesPage';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      </div>
      <h2 className="text-lg font-medium text-gray-900 mb-2">Loading Slotify</h2>
      <p className="text-gray-600">Please wait while we prepare your dashboard...</p>
    </div>
  </div>
);

// Error component
const ErrorPage = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="text-red-600 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        {error?.message || 'There was an error loading the application.'}
      </p>
      <div className="space-y-2">
        <button 
          onClick={onRetry}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
);

// Landing Page Content
const LandingPageContent = ({ user }) => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Slotify</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/features'}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors"
              >
                Features
              </button>
              {user ? (
                <>
                  <button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-4xl mx-auto px-4">
          {user ? (
            <>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Welcome back to <span className="text-blue-600">Slotify</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Ready to schedule your next meeting? Your dashboard is waiting with all your upcoming meetings and tools.
              </p>
              <div className="space-x-4">
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-flex items-center"
                >
                  Go to Dashboard
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button 
                  onClick={() => window.location.href = '/features'}
                  className="bg-white text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 text-lg font-medium"
                >
                  Explore Features
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-blue-600">Slotify</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Smart scheduling made simple. Stop the back-and-forth emails and let AI find the perfect meeting times for everyone.
              </p>
              <div className="space-x-4">
                <button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium inline-flex items-center"
                >
                  Get Started Free
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
                <button 
                  onClick={() => window.location.href = '/features'}
                  className="bg-white text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-300 text-lg font-medium"
                >
                  Learn More
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorPage error={error} onRetry={() => window.location.reload()} />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPageContent user={user} />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <AuthForm />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;