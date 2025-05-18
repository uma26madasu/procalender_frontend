// public/env-config.js
// This script injects environment variables for client-side access
// It should be kept minimal and only include what's needed by the client

window.__ENV__ = {
  // API configuration
  VITE_API_URL: 'https://slotify-backend.onrender.com',
  
  // Firebase configuration
  VITE_FIREBASE_API_KEY: 'AIzaSyCYsr6oZ3j-R7nJe6xWaRO6Q5xi0Rk3IV8',
  VITE_FIREBASE_AUTH_DOMAIN: 'procalenderfrontend.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'procalenderfrontend',
  VITE_FIREBASE_STORAGE_BUCKET: 'procalenderfrontend.firebasestorage.app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '302768668350',
  VITE_FIREBASE_APP_ID: '1:302768668350:web:b92f80489662289e28e8ef',
  VITE_FIREBASE_MEASUREMENT_ID: 'G-QJWKGJN76S',
  
  // Feature flags
  VITE_USE_FIREBASE_EMULATORS: 'false',
  VITE_ENABLE_ANALYTICS: 'true',
  
  // Version info (useful for debugging)
  VITE_APP_VERSION: '1.0.0',
  VITE_APP_BUILD_DATE: new Date().toISOString()
};