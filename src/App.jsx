import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebase';

// Pages
import LoginPage from './pages/LoginPage';
// Import other pages...

function App() {
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (!authInitialized) {
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
  }, []);
  
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{authError}</p>
          <p className="text-gray-600 mb-4">Please try refreshing the page or contact support if the issue persists.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  
  if (!authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Original return with routes
  return (
    <Routes>
      {/* Public routes that don't require authentication */}
      <Route path="/login" element={<LoginPage initialSignUp={false} />} />
      <Route path="/signup" element={<LoginPage initialSignUp={true} />} />
      
      {/* Add a catch-all route that redirects to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;