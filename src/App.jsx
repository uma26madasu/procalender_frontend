import React, { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Simple page navigation
  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>🔑 Login to ProCalendar</h1>
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
                onClick={() => alert('Google login would go here!')}
              >
                🔐 Continue with Google
              </button>
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
                onClick={() => alert('GitHub login would go here!')}
              >
                🐙 Continue with GitHub
              </button>
            </div>
          </div>
        );
      
      case 'calendar':
        return (
          <div style={{ padding: '40px' }}>
            <h1>📅 Calendar View</h1>
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
                  color: i + 1 <= 31 ? '#333' : '#ccc'
                }}>
                  {i + 1 <= 31 ? i + 1 : ''}
                </div>
              ))}
            </div>
          </div>
        );
      
      default: // dashboard
        return (
          <div style={{ padding: '40px' }}>
            <h1 style={{ fontSize: '2.5em', marginBottom: '20px' }}>
              📅 ProCalendar Dashboard
            </h1>
            <p style={{ fontSize: '1.2em', marginBottom: '40px', color: '#666' }}>
              Welcome to your professional calendar management system!
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px',
              marginTop: '30px'
            }}>
              <div style={{
                padding: '30px',
                backgroundColor: '#007bff',
                color: 'white',
                borderRadius: '10px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => setCurrentPage('calendar')}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>📅 Calendar</h3>
                <p style={{ margin: 0 }}>View and manage your schedule</p>
              </div>
              
              <div style={{
                padding: '30px',
                backgroundColor: '#28a745',
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
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5em' }}>🔑 Account</h3>
                <p style={{ margin: 0 }}>Login or manage your account</p>
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
                <div>Google OAuth: {import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✅ Ready' : '❌ Missing'}</div>
                <div>Build: ✅ {new Date().toLocaleDateString()}</div>
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
          
          <div>
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
              🔑 Login
            </button>
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
        ProCalendar v1.0 - Built with React & Vite ⚡
      </div>
    </div>
  );
}

export default App;