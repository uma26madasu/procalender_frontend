import { auth } from "./config";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// Auth functions remain the same...

// Updated useAuth hook with null checks
export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user, // Adds easy authentication check
    uid: user?.uid,         // Safely access uid
    email: user?.email      // Safely access email
  };
};

export { auth };