// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Get Firebase config from environment variables or window object
const getFirebaseConfig = () => {
  // First try window.__ENV__ (set in public/env-config.js)
  if (typeof window !== 'undefined' && window.__ENV__) {
    console.log("Using Firebase config from window.__ENV__");
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
  
  // Then try import.meta.env (Vite environment variables)
  if (import.meta && import.meta.env) {
    console.log("Using Firebase config from import.meta.env");
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
  
  // Fallback to hardcoded config
  console.log("Using hardcoded Firebase config");
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

// Initialize Firebase with error handling
let app;
let auth = null;
let db = null;
let googleProvider = null;

try {
  const firebaseConfig = getFirebaseConfig();
  
  // Log configuration for debugging (except API key)
  console.log('Firebase config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '[PRESENT]' : '[MISSING]'
  });
  
  // Check for minimal required config
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    throw new Error('Missing required Firebase configuration properties');
  }
  
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  // Log current domain for debugging
  console.log('Current domain:', window.location.hostname);
  console.log('Firebase Auth domain:', firebaseConfig.authDomain);
  
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  // Don't set auth, db, or googleProvider if initialization fails
}

// Define the Google sign-in function
const signInWithGooglePopup = async () => {
  if (!auth || !googleProvider) {
    console.error('Firebase auth or Google provider not initialized');
    throw new Error('Authentication service not available');
  }

  try {
    console.log('Attempting Google sign-in');
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google sign-in successful');
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error.code, error.message);
    
    // Check for unauthorized domain error
    if (error.code === 'auth/unauthorized-domain') {
      const currentDomain = window.location.hostname;
      console.error('Domain not authorized in Firebase. Current domain:', currentDomain);
      error.message = `Domain "${currentDomain}" is not authorized in Firebase. Please add it to your Firebase console.`;
    }
    
    throw error;
  }
};

export {
  app,
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  signInWithGooglePopup
};