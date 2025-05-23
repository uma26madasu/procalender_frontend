import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCYsr6oZ3j-R7nJe6xWaRO6Q5xi0Rk3IV8",
  authDomain: "procalenderfrontend.firebaseapp.com",
  projectId: "procalenderfrontend",
  storageBucket: "procalenderfrontend.firebasestorage.app",
  messagingSenderId: "302768668350",
  appId: "1:302768668350:web:b92f80489662289e28e8ef",
  measurementId: "G-QJWKGJN76S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

// Development mode check
if (import.meta.env.DEV) {
  console.log('Firebase initialized in development mode');
  console.log('Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
  });
}