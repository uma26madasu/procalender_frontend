import { auth } from "./config";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// Initialize Google provider once
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    localStorage.clear();
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Auth state hook
export const useAuth = () => {
  const [user, loading, error] = useAuthState(auth);
  return { user, loading, error };
};

// Export auth instance for direct use when needed
export { auth };