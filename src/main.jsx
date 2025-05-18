import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

console.log('Application starting...');
console.log('Environment check:', {
  viteApiUrl: import.meta.env.VITE_API_URL ? 'present' : 'missing',
  viteFirebaseKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'present' : 'missing'
});

// Check browser compatibility
const checkBrowserCompatibility = () => {
  if (!window.localStorage) {
    console.error('localStorage is not supported');
    return false;
  }
  
  if (!window.fetch) {
    console.error('fetch API is not supported');
    return false;
  }
  
  return true;
};

// Check domain for Firebase Auth
const checkFirebaseDomain = () => {
  const currentDomain = window.location.hostname;
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'procalenderfrontend.firebaseapp.com',
    'procalender-frontend.vercel.app',
    'procalender-frontend-git-main-uma26madasus-projects.vercel.app'
  ];
  
  const isDomainAllowed = allowedDomains.includes(currentDomain);
  console.log(`Current domain: ${currentDomain}, Allowed for Firebase: ${isDomainAllowed}`);
  return isDomainAllowed;
};

// Render the app with error handling
try {
  if (!checkBrowserCompatibility()) {
    throw new Error('Your browser does not support required features');
  }
  
  const isFirebaseDomainValid = checkFirebaseDomain();
  if (!isFirebaseDomainValid) {
    console.warn(`Current domain may not be authorized in Firebase. Please check Firebase Authentication settings.`);
  }
  
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
      <p>Current domain: ${window.location.hostname}</p>
      <button onclick="window.location.reload()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 20px;">Refresh Page</button>
      <a href="/debug" style="display: inline-block; margin-left: 10px; color: #3b82f6;">View Debug Info</a>
    </div>
  `;
}