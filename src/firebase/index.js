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
  
  console.log('Firebase services initialized successfully');
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