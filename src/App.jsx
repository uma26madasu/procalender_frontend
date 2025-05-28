import React, { useState, useEffect } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Google OAuth configuration
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin + '/auth/google/callback';

  // Check for auth callback on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleAuthCallback(code);
    }

    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('procalendar_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('procalendar_user');
      }
    }
  }, []);

  // Handle Google OAuth login
  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      alert('Google Client ID not configured. Please check your environment variables.');
      return;
    }

    setIsLoadingAuth(true);
    
    const scope = [
      'openid',
      'profile',
      'email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ].join(' ');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`;

    window.location.href = authUrl;
  };

  // Handle auth callback
  const handleAuthCallback = async (code) => {
    setIsLoadingAuth(true);
    try {
      // In a real app, you'd send this code to your backend
      // For now, let's just simulate a successful login
      const mockUser = {
        id: 'google_123',
        name: 'Google User',
        email: 'user@gmail.com',
        picture: 'https://via.placeholder.com/40',
        accessToken: 'mock_access_token'
      };
      
      setUser(mockUser);
      localStorage.setItem('procalendar_user', JSON.stringify(mockUser));
      setCurrentPage('dashboard');
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      alert('✅ Successfully connected to Google Calendar!');
    } catch (error) {
      console.error('Auth callback error:', error);
      alert('❌ Authentication failed. Please try again.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('procalendar_user');
    setCurrentPage('dashboard');
  };

  // Simple page navigation
  const renderPage = () => {
    if (isLoadingAuth) {
      return (
        <div style={{ 
          padding: '60px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</div>
          <h2>Connecting to Google...</h2>
          <p>Please wait while we set up your account.</p>
        </div>
      );
    }

    switch(currentPage) {
      case 'login':
        if (user) {
          return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <h1>👋 Welcome back, {user.name}!</h1>
              <div style={{ 
                maxWidth: '400px', 
                margin: '20px auto',
                padding: '30px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={user.picture} 
                  alt="Profile" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%',
                    marginBottom: '20px'
                  }}
                />
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Status:</strong> ✅ Google Calendar Connected</p>
                
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: '20px'
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          );
        }

        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>🔑 Login to ProCalendar</h1>
            <p style={{ marginBottom: '30px', color: '#666' }}>
              Connect your Google account to access your calendar and schedule meetings
            </p>
            <div style={{ 
              maxWidth: '400px', 
              margin: '20px auto',
              padding: '30px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <button 
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={handleGoogleLogin}
                disabled={!GOOGLE_CLIENT_ID}
              >
                🔐 Continue with Google
              </button>
              
              {!GOOGLE_CLIENT_ID && (
                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '10px' }}>
                  ⚠️ Google OAuth not configured
                </p>
              )}
              
              <button 
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => alert('GitHub login coming soon!')}
              >
                🐙 Continue with GitHub
              </button>
            </div>
          </div>
        );
      
      case 'calendar':
        return (
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h1>📅 Calendar View</h1>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%',
                      marginRight: '10px'
                    }}
                  />
                  <span>{user.name}</span>
                </div>
              )}
            </div>
            
            {!user && (
              <div style={{ 
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px'
              }}>
                ⚠️ Please <button 
                  onClick={() => setCurrentPage('login')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#007bff', 
                    textDecoration: 'underline',
                    cursor: 'pointer' 
                  }}
                >
                  sign in
                </button> to access your Google Calendar
              </div>
            )}
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(7, 1fr)', 
              gap: '2px',
              marginTop: '30px',
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px'
            }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ 
                  padding: '15px', 
                  backgroundColor: '#007bff', 
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  borderRadius: '5px'
                }}>
                  {day}
                </div>
              ))}
              {Array.from({length: 35}, (_, i) => (
                <div key={i} style={{ 
                  padding: '20px', 
                  backgroundColor: 'white',
                  textAlign: 'center',
                  minHeight: '80px',
                  borderRadius: '5px',
                  border: '1px solid #dee2e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '500',
                  color: i + 1 <= 31 ? '#333' : '#ccc',
                  cursor: user ? 'pointer' : 'default',
                  opacity: user ? 1 : 0.6
                }}
                onClick={() => user && alert(`Calendar event for ${i + 1} would go here!`)}
                >
                  {i + 1 <= 31 ? i + 1 : ''}
                </div>
              ))}
            </div>
          </div>
        );
      
      default: // dashboard
        return (
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '2.5em', margin: 0 }}>
                📅 ProCalendar Dashboard
              </h1>
              {user && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      marginRight: '10px'
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Google Connected ✅</div>
                  </div>
                </div>
              )}
            </div>
            
            <p style={{ fontSize: '1.2em', marginBottom: '40px', color: '#666' }}>
              Welcome to your professional calendar management system!
            </p>
            
            {!user && (
              <div style={{ 
                backgroundColor: '#d4edda',
                border: '1px solid #c3e6cb',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '30px'
              }}>
                🎯 <strong>Get Started:</strong> <button 
                  onClick={() => setCurrentPage('login')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#007bff', 
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Connect your Google account
                </button> to access your calendar and start scheduling!
              </div>
            )}
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginTop: '30px'
            }}>
              <div style={{
                padding: '30px',
                backgroundColor: user ? '#007bff' : '#6c757d',
                color: 'white',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                opacity: user ? 1 : 0.7
              }}
              onClick={() => setCurrentPage('calendar')}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📅 Calendar</h3>
                <p style={{ margin: 0 }}>
                  {user ? 'View and manage your schedule' : 'Connect Google to view calendar'}
                </p>
              </div>
              
              <div style={{
                padding: '30px',
                backgroundColor: user ? '#28a745' : '#17a2b8',
                color: 'white',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => setCurrentPage('login')}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>
                  {user ? '👤 Account' : '🔑 Login'}
                </h3>
                <p style={{ margin: 0 }}>
                  {user ? 'Manage your account settings' : 'Connect your Google account'}
                </p>
              </div>
              
              <div style={{
                padding: '30px',
                backgroundColor: '#17a2b8',
                color: 'white',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => alert('Settings coming soon!')}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>⚙️ Settings</h3>
                <p style={{ margin: 0 }}>Configure your preferences</p>
              </div>
            </div>

            <div style={{ 
              marginTop: '40px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              border: '1px solid #dee2e6'
            }}>
              <h3>🎯 Environment Status:</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>API URL: {import.meta.env.VITE_API_URL ? '✅ Connected' : '❌ Missing'}</div>
                <div>Firebase: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Configured' : '❌ Missing'}</div>
                <div>Google OAuth: {GOOGLE_CLIENT_ID ? '✅ Ready' : '❌ Missing'}</div>
                <div>User Status: {user ? '✅ Logged In' : '⚪ Not Logged In'}</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Header */}
      <nav style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '15px 30px',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            style={{ 
              background: 'none',
              border: 'none',
              color: 'white', 
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📅 ProCalendar
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              style={{
                background: currentPage === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 16px',
                margin: '0 5px',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              🏠 Dashboard
            </button>
            <button 
              onClick={() => setCurrentPage('calendar')}
              style={{
                background: currentPage === 'calendar' ? 'rgba(255,255,255,0.2)' : 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 16px',
                margin: '0 5px',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              📅 Calendar
            </button>
            <button 
              onClick={() => setCurrentPage('login')}
              style={{
                background: currentPage === 'login' ? 'rgba(255,255,255,0.2)' : 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 16px',
                margin: '0 5px',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              {user ? '👤 Account' : '🔑 Login'}
            </button>
            
            {user && (
              <img 
                src={user.picture} 
                alt="Profile" 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%',
                  marginLeft: '10px',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              />
            )}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div style={{ 
        background: 'white', 
        margin: '20px', 
        borderRadius: '15px',
        minHeight: 'calc(100vh - 100px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {renderPage()}
      </div>
      
      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px',
        color: 'rgba(255,255,255,0.8)',
        fontSize: '14px'
      }}>
        ProCalendar v1.0 - {user ? `Welcome back, ${user.name}! 👋` : 'Connect your Google account to get started 🚀'}
      </div>
    </div>
  );
}

export default App;