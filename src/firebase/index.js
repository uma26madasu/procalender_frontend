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

// First try environment variables with VITE_ prefix
let firebaseApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
let firebaseAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
let firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
let firebaseStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
let firebaseMessagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
let firebaseAppId = import.meta.env.VITE_FIREBASE_APP_ID;
let firebaseMeasurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

// If not found, try with REACT_APP_ prefix (for backwards compatibility)
if (!firebaseApiKey) firebaseApiKey = import.meta.env.REACT_APP_FIREBASE_API_KEY;
if (!firebaseAuthDomain) firebaseAuthDomain = import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
if (!firebaseProjectId) firebaseProjectId = import.meta.env.REACT_APP_FIREBASE_PROJECT_ID;
if (!firebaseStorageBucket) firebaseStorageBucket = import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
if (!firebaseMessagingSenderId) firebaseMessagingSenderId = import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
if (!firebaseAppId) firebaseAppId = import.meta.env.REACT_APP_FIREBASE_APP_ID;
if (!firebaseMeasurementId) firebaseMeasurementId = import.meta.env.REACT_APP_FIREBASE_MEASUREMENT_ID;

// Use hardcoded values if needed for testing
if (!firebaseApiKey) {
  console.warn('Firebase config not found in environment variables, using firebase credentials from .env file')
  firebaseApiKey = 'AIzaSyCYsr6oZ3j-R7nJe6xWaRO6Q5xi0Rk3IV8';
  firebaseAuthDomain = 'procalenderfrontend.firebaseapp.com';
  firebaseProjectId = 'procalenderfrontend';
  firebaseStorageBucket = 'procalenderfrontend.firebasestorage.app';
  firebaseMessagingSenderId = '302768668350';
  firebaseAppId = '1:302768668350:web:b92f80489662289e28e8ef';
  firebaseMeasurementId = 'G-QJWKGJN76S';
}

console.log('Firebase initialization starting with config:', {
  apiKeyExists: !!firebaseApiKey,
  authDomainExists: !!firebaseAuthDomain,
  projectIdExists: !!firebaseProjectId
});

// Firebase configuration
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId
};

let auth = null;
let db = null;
let googleProvider = null;

try {
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