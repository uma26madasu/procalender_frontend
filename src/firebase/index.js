// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  connectAuthEmulator
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Log the current domain for debugging
console.log('Firebase initialization - Current domain:', window.location.hostname);

// Firebase configuration - hardcoded for reliability
const firebaseConfig = {
  apiKey: "AIzaSyCYsr6oZ3j-R7nJe6xWaRO6Q5xi0Rk3IV8",
  authDomain: "procalenderfrontend.firebaseapp.com", // This is critical for auth
  projectId: "procalenderfrontend",
  storageBucket: "procalenderfrontend.firebasestorage.app",
  messagingSenderId: "302768668350",
  appId: "1:302768668350:web:b92f80489662289e28e8ef",
  measurementId: "G-QJWKGJN76S"
};

// Log the config we're using
console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? 'Present (hidden)' : 'Missing'
});

let auth = null;
let db = null;
let googleProvider = null;

try {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  // Add additional scopes if needed
  // googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  
  console.log('Firebase services initialized successfully');
  
  // Check if we're in development mode (localhost)
  if (window.location.hostname === 'localhost') {
    console.log('Development mode detected, connecting to auth emulator');
    // Consider using emulators for local development
    // connectAuthEmulator(auth, "http://localhost:9099");
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  console.error('Full error:', error);
}

// Specific Google sign-in function with detailed error handling
const signInWithGoogle = async () => {
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
    console.error('Google sign-in error code:', error.code);
    console.error('Google sign-in error message:', error.message);
    
    // Provide more details for unauthorized domain errors
    if (error.code === 'auth/unauthorized-domain') {
      console.error('Domain not authorized in Firebase. Current domain:', window.location.hostname);
      console.error('Please add this domain to Firebase console > Authentication > Settings > Authorized domains');
    }
    
    throw error;
  }
};

export {
  auth,
  db,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  signInWithGoogle
};