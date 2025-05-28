import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

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

// Simple Dashboard Component (inline until you create pages)
const Dashboard = () => (
  <div style={{ padding: '20px' }}>
    <h1>📅 ProCalendar Dashboard</h1>
    <p>Welcome to your calendar management system!</p>
    <div style={{ marginTop: '20px' }}>
      <Link to="/calendar" style={{ 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px',
        marginRight: '10px'
      }}>
        📅 View Calendar
      </Link>
      <Link to="/login" style={{ 
        padding: '10px 20px', 
        backgroundColor: '#28a745', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '5px'
      }}>
        🔑 Login
      </Link>
    </div>
  </div>
);

// Simple Login Component (inline until you create pages)
const Login = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>🔑 Login to ProCalendar</h1>
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#4285f4',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        marginBottom: '10px'
      }}>
        🔐 Login with Google
      </button>
      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer'
      }}>
        🐙 Login with GitHub
      </button>
    </div>
    <div style={{ marginTop: '20px' }}>
      <Link to="/" style={{ color: '#007bff' }}>← Back to Dashboard</Link>
    </div>
  </div>
);

// Simple Calendar Component (inline until you create pages)
const Calendar = () => (
  <div style={{ padding: '20px' }}>
    <h1>📅 ProCalendar View</h1>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(7, 1fr)', 
      gap: '10px',
      marginTop: '20px'
    }}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} style={{ 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          {day}
        </div>
      ))}
      {Array.from({length: 35}, (_, i) => (
        <div key={i} style={{ 
          padding: '20px', 
          border: '1px solid #dee2e6',
          textAlign: 'center',
          minHeight: '60px'
        }}>
          {i + 1 <= 31 ? i + 1 : ''}
        </div>
      ))}
    </div>
    <div style={{ marginTop: '20px' }}>
      <Link to="/" style={{ color: '#007bff' }}>← Back to Dashboard</Link>
    </div>
  </div>
);

// Simple Error Fallback
const ErrorFallback = ({ error }) => (
  <div style={{ 
    padding: '20px', 
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif'
  }}>
    <h1>❌ Oops! Something went wrong</h1>
    <p>ProCalendar encountered an error. Please try refreshing the page.</p>
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
          console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
          // Don't fail for missing env vars, just warn
        }

        // Try to initialize Firebase (if config exists)
        try {
          // Only import firebase if the file exists
          const firebaseModule = await import('./firebase/config').catch(() => null);
          if (firebaseModule) {
            console.log('✅ Firebase initialized successfully');
          } else {
            console.log('⚠️ Firebase config not found - using mock mode');
          }
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
        <div className="App" style={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#333'
        }}>
          <nav style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '10px 20px',
            backdropFilter: 'blur(10px)'
          }}>
            <Link to="/" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              📅 ProCalendar
            </Link>
          </nav>
          
          <div style={{ 
            background: 'white', 
            margin: '20px', 
            borderRadius: '10px',
            minHeight: 'calc(100vh - 80px)',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="*" element={
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The page you're looking for doesn't exist.</p>
                  <Link to="/" style={{ color: '#007bff' }}>← Go Home</Link>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;