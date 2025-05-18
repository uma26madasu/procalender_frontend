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
    // Check if Firebase Auth is available
    if (!auth) {
      console.error("Firebase auth not initialized");
      setAuthError("Firebase authentication failed to initialize");
      return;
    }
    
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setAuthInitialized(true);
      },
      (error) => {
        console.error("Auth state error:", error);
        setAuthError("Authentication error: " + error.message);
      }
    );
    
    return unsubscribe;
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
      {/* Your existing routes */}
      <Route path="/login" element={<LoginPage initialSignUp={false} />} />
      {/* Other routes... */}
    </Routes>
  );
}

export default App;