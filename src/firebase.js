import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // Add other Firebase config keys from your Firebase Console
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();