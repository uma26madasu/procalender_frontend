import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDngn-nNfWDWGjXcDdtO6GiM5xOBQvYil8",
  authDomain: "pro-calender-uma".firebaseapp.com,
  projectId: "pro-calender-uma",
  // Add other Firebase config keys from your Firebase Console
};

const app = getApps().length ? getApps() : initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();