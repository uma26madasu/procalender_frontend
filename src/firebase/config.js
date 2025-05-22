// src/firebase/config.js
// This file centralizes all Firebase configuration in one place
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// First try to get config from environment variables
const getFirebaseConfig = () => {
  // Check if running in browser
  const isBrowser = typeof window !== 'undefined';
  
  // Try to get config from window.__ENV__ (set in public/env-config.js)
  if (isBrowser && window.__ENV__) {
    return {
      apiKey: window.__ENV__.VITE_FIREBASE_API_KEY,
      authDomain: window.__ENV__.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: window.__ENV__.VITE_FIREBASE_PROJECT_ID,
      storageBucket: window.__ENV__.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: window.__ENV__.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: window.__ENV__.VITE_FIREBASE_APP_ID,
      measurementId: window.__ENV__.VITE_FIREBASE_MEASUREMENT_ID
    };
  }
  
  // Then try to get from import.meta.env (Vite environment variables)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };
  }
  
  // Fallback to hardcoded config as last resort
  // Note: In production, this should ideally never be reached
  console.warn('Using fallback Firebase configuration. This is not recommended for production.');
  throw new Error('Firebase configuration not found in environment variables');
};

// Validate Firebase config to ensure all required fields are present
const validateFirebaseConfig = (config) => {
  const requiredFields = [
    'apiKey', 'authDomain', 'projectId', 
    'storageBucket', 'messagingSenderId', 'appId'
  ];
  
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  return true;
};

// Get and validate the config
const firebaseConfig = getFirebaseConfig();
const isValidConfig = validateFirebaseConfig(firebaseConfig);

// Initialize Firebase only if config is valid
let app;
let auth;

if (isValidConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization error', error);
    isValidConfig = false;
  }
}

export { firebaseConfig, isValidConfig, auth };