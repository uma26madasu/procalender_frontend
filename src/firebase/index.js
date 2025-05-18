// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  // other imports...
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYsr6oZ3j-R7nJe6xWaRO6Q5xi0Rk3IV8",
  // other config...
};

let app;
let auth = null;
let db = null;
let googleProvider = null;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized');

  // Initialize services
  auth = getAuth(app);
  // Initialize other services...
  
  console.log('Firebase services initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error.message);
}

// Export everything, but with safer defaults
export {
  app,
  auth,
  db,
  // other exports...
};