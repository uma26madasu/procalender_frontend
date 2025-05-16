// src/firebase/config.js
// This file centralizes all Firebase configuration in one place

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
  if (import.meta && import.meta.env) {
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
  return {
    apiKey: "AIzaSyCYsr6oZ3j-R7nJe6xWaRO6Q5xi0Rk3IV8",
    authDomain: "procalenderfrontend.firebaseapp.com",
    projectId: "procalenderfrontend",
    storageBucket: "procalenderfrontend.firebasestorage.app",
    messagingSenderId: "302768668350",
    appId: "1:302768668350:web:b92f80489662289e28e8ef",
    measurementId: "G-QJWKGJN76S"
  };
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

// Export the config
const firebaseConfig = getFirebaseConfig();
const isValidConfig = validateFirebaseConfig(firebaseConfig);

// Export a flag indicating if config is valid
export { firebaseConfig, isValidConfig };