import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

console.log('Application starting...');
console.log('Environment check:', {
  viteApiUrl: import.meta.env.VITE_API_URL ? 'present' : 'missing',
  viteFirebaseKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'present' : 'missing',
  reactAppApiUrl: import.meta.env.REACT_APP_API_URL ? 'present' : 'missing',
  reactAppFirebaseKey: import.meta.env.REACT_APP_FIREBASE_API_KEY ? 'present' : 'missing',
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  document.getElementById('root').innerHTML = `
    <div style="max-width: 500px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="color: #d00; margin-top: 0;">Application Error</h1>
      <p>The application encountered an unexpected error:</p>
      <pre style="background: #f5f5f5; padding: 10px; overflow: auto; border-radius: 4px;">${event.error?.message || 'Unknown error'}</pre>
      <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 20px;">Refresh Page</button>
      <a href="/debug" style="display: inline-block; margin-left: 10px; color: #3b82f6;">View Debug Info</a>
    </div>
  `;
});

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Fatal application error:', error);
  document.getElementById('root').innerHTML = `
    <div style="max-width: 500px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h1 style="color: #d00; margin-top: 0;">Application Failed to Start</h1>
      <p>The application couldn't be initialized:</p>
      <pre style="background: #f5f5f5; padding: 10px; overflow: auto; border-radius: 4px;">${error.message}</pre>
      <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 20px;">Refresh Page</button>
      <a href="/debug" style="display: inline-block; margin-left: 10px; color: #3b82f6;">View Debug Info</a>
    </div>
  `;
}