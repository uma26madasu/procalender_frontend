import React, { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('🔄 Loading...');

  useEffect(() => {
    // Simple initialization test
    try {
      setStatus('✅ ProCalendar Loaded Successfully!');
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    }
  }, []);

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <h1 style={{ fontSize: '3em', margin: '0' }}>📅 ProCalendar</h1>
      <p style={{ fontSize: '1.5em', margin: '20px 0' }}>{status}</p>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        marginTop: '30px'
      }}>
        <h3>🎯 Environment Check:</h3>
        <p>API URL: {import.meta.env.VITE_API_URL ? '✅' : '❌'}</p>
        <p>Firebase Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅' : '❌'}</p>
        <p>Firebase Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅' : '❌'}</p>
        <p>Google Client ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✅' : '❌'}</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '0 10px'
          }}
        >
          🔄 Refresh
        </button>
        
        <button 
          onClick={() => window.open('https://github.com/uma26madasu/procalender_frontend', '_blank')}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            margin: '0 10px'
          }}
        >
          📁 View Code
        </button>
      </div>
    </div>
  );
}

export default App;