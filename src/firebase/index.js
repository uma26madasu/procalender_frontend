// src/firebase/index.js - Simplified version
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Debug logs
console.log('Firebase initialization starting');
console.log('Environment variables status:', {
  apiKeyExists: !!import.meta.env.VITE_FIREBASE_API_KEY,
  authDomainExists: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
});

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'missing-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'missing-auth-domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'missing-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'missing-storage-bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'missing-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'missing-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'missing-measurement-id'
};

// Log config values (with API key partially masked for security)
console.log('Firebase config check:', {
  apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substr(0, 3)}...` : 'missing',
  authDomain: firebaseConfig.authDomain || 'missing',
  projectId: firebaseConfig.projectId || 'missing'
});

let auth, db, googleProvider;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  
  // Set services to null if initialization fails
  auth = null;
  db = null;
  googleProvider = null;
}

// Export the services
export { auth, db, googleProvider };