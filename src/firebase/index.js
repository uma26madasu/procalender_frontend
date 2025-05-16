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

console.log('Firebase initialization - Current domain:', window.location.hostname);

let app;
let auth;
let db;
let googleProvider;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');

  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error.message);
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
      console.error('Domain not authorized in Firebase. Current domain:', window.location.hostname);
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