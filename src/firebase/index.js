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

// Get environment variables safely
const getEnv = (key) => {
  // For Vite during development
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key];
  }
  // For production build with global env (Vercel)
  else if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key];
  }
  // Fallback to hardcoded values
  else if (key === 'VITE_FIREBASE_API_KEY') {
    return 'AIzaSyCYsr6oZ3j-R7nJe6xWaRO6Q5xi0Rk3IV8';
  } else if (key === 'VITE_FIREBASE_AUTH_DOMAIN') {
    return 'procalenderfrontend.firebaseapp.com';
  } else if (key === 'VITE_FIREBASE_PROJECT_ID') {
    return 'procalenderfrontend';
  } else if (key === 'VITE_FIREBASE_STORAGE_BUCKET') {
    return 'procalenderfrontend.firebasestorage.app';
  } else if (key === 'VITE_FIREBASE_MESSAGING_SENDER_ID') {
    return '302768668350';
  } else if (key === 'VITE_FIREBASE_APP_ID') {
    return '1:302768668350:web:b92f80489662289e28e8ef';
  } else if (key === 'VITE_FIREBASE_MEASUREMENT_ID') {
    return 'G-QJWKGJN76S';
  }
  return undefined;
};

console.log('Firebase initialization starting');

// Firebase configuration
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
  measurementId: getEnv('VITE_FIREBASE_MEASUREMENT_ID')
};

let auth = null;
let db = null;
let googleProvider = null;

// Try to initialize Firebase
try {
  console.log('Initializing Firebase with config:', {
    apiKey: firebaseConfig.apiKey ? 'present' : 'missing',
    authDomain: firebaseConfig.authDomain ? 'present' : 'missing',
    projectId: firebaseConfig.projectId ? 'present' : 'missing'
  });
    
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
    
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error.message);
}

// Google Sign-In function
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    console.log('Attempting Google sign-in');
    const result = await signInWithPopup(auth, provider);
    console.log('Google sign-in successful');
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error.code, error.message);
    console.log('Auth domain issues?', {
      currentDomain: window.location.hostname,
      code: error.code
    });
    throw error;
  }
};

// Export services and functions
export {
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider
};