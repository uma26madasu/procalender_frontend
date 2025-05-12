// Import Firebase core and services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";          // For user login/signup
import { getFirestore } from "firebase/firestore"; // For database (optional)
// Consider adding these if needed:
// import { getStorage } from "firebase/storage"; // For file storage
// import { getAnalytics } from "firebase/analytics"; // For analytics

// Your Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);       // Authentication
export const db = getFirestore(app);    // Firestore Database

// Initialize other services as needed (uncomment if required)
// export const storage = getStorage(app); // Firebase Storage
// export const analytics = getAnalytics(app); // Analytics

// Optional: Set persistence for auth if needed
// import { browserLocalPersistence } from "firebase/auth";
// setPersistence(auth, browserLocalPersistence);