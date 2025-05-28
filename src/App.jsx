import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components to prevent blocking errors
const Dashboard = React.lazy(() => import('./pages/Dashboard').catch(() => ({ default: () => <div>Dashboard failed to load</div> })));
const Login = React.lazy(() => import('./pages/Login').catch(() => ({ default: () => <div>Login failed to load</div> })));
const Calendar = React.lazy(() => import('./pages/Calendar').catch(() => ({ default: () => <div>Calendar failed to load</div> })));

// Simple Loading Component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px'
  }}>
    🔄 Loading ProCalendar...
  </div>
);

// Simple Error Fallback
const ErrorFallback = ({ error, retry }) => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  }}>
    <h1>❌ Oops! Something went wrong</h1>
    <p>ProCalendar encountered an error. Please try refreshing the page.</p>
    <details style={{ marginTop: '20px', textAlign: 'left' }}>
      <summary>Error Details (for debugging)</summary>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '12px',
        overflow: 'auto'
      }}>
        {error?.toString()}
      </pre>
    </details>
    <div style={{ marginTop: '20px' }}>
      <button 
        onClick={() => window.location.reload()} 
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        🔄 Refresh Page
      </button>
    </div>
  </div>
);

function App() {
  const [initError, setInitError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test environment variables
        const requiredEnvVars = [
          'VITE_FIREBASE_API_KEY',
          'VITE_FIREBASE_AUTH_DOMAIN', 
          'VITE_FIREBASE_PROJECT_ID'
        ];

        const missingVars = requiredEnvVars.filter(
          varName => !import.meta.env[varName]
        );

        if (missingVars.length > 0) {
          throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
        }

        // Try to initialize Firebase (if config exists)
        try {
          await import('./firebase/config');
          console.log('✅ Firebase initialized successfully');
        } catch (firebaseError) {
          console.warn('⚠️ Firebase initialization warning:', firebaseError);
          // Don't fail the entire app for Firebase issues
        }

        setIsReady(true);
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setInitError(error);
      }
    };

    initializeApp();
  }, []);

  if (initError) {
    return <ErrorFallback error={initError} />;
  }

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="*" element={
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <a href="/" style={{ color: '#007bff' }}>← Go Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;