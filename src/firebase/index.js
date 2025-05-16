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
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { firebaseConfig, isValidConfig } from "./config";

// Logging setup for debugging
const logPrefix = "[Firebase]";
const logger = {
  info: (msg) => console.info(`${logPrefix} ${msg}`),
  warn: (msg) => console.warn(`${logPrefix} ${msg}`),
  error: (msg, err) => console.error(`${logPrefix} ${msg}`, err)
};

// Create a function to initialize Firebase that can be called safely
const initializeFirebase = () => {
  // Check if we have valid configuration
  if (!isValidConfig) {
    logger.error("Invalid Firebase configuration. Authentication will not work.");
    return { auth: null, db: null, googleProvider: null };
  }

  logger.info(`Initializing Firebase for domain: ${window.location.hostname}`);
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    logger.info("Firebase app initialized successfully");

    // Initialize Auth
    const auth = getAuth(app);
    
    // Initialize Firestore
    const db = getFirestore(app);
    
    // Setup Google Auth Provider
    const googleProvider = new GoogleAuthProvider();
    
    // In development, use emulators if available
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === "true") {
      try {
        connectAuthEmulator(auth, "http://localhost:9099");
        connectFirestoreEmulator(db, "localhost", 8080);
        logger.info("Connected to Firebase emulators");
      } catch (err) {
        logger.warn("Failed to connect to Firebase emulators", err);
      }
    }
    
    logger.info("Firebase services initialized successfully");
    return { auth, db, googleProvider, app };
  } catch (error) {
    logger.error("Firebase initialization error", error);
    return { auth: null, db: null, googleProvider: null, app: null };
  }
};

// Initialize the Firebase services
const { auth, db, googleProvider, app } = initializeFirebase();

// Implement Google Sign-In with robust error handling
const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    logger.error('Firebase auth or Google provider not initialized');
    throw new Error({
      code: 'auth/service-unavailable',
      message: 'Authentication service is not available. Please try again later.'
    });
  }

  try {
    logger.info('Attempting Google sign-in');
    // Add select_account to force the account selection prompt
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    logger.info('Google sign-in successful');
    return result.user;
  } catch (error) {
    logger.error('Google sign-in error', error);
    
    // Enhanced error handling with specific error messages
    if (error.code === 'auth/unauthorized-domain') {
      logger.error(`Domain not authorized in Firebase: ${window.location.hostname}`);
      throw new Error({
        code: error.code,
        message: `This domain (${window.location.hostname}) is not authorized for Firebase authentication. Please contact the administrator.`
      });
    }
    
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error({
        code: error.code,
        message: 'Sign-in was cancelled. Please try again.'
      });
    }
    
    // Throw a more user-friendly error for other cases
    throw error;
  }
};

// Export all the Firebase services and utilities
export {
  auth,
  db,
  googleProvider,
  app,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  signInWithGoogle
};