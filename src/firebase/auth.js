import { 
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "./firebase"; // Adjust path if needed

// Sign up with email/password
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user; // Return user data
  } catch (error) {
    throw new Error(error.message); // Throw error for UI handling
  }
};

// Sign in with email/password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign out - Updated to redirect to public dashboard
export const logOut = async () => {
  try {
    await signOut(auth);
    // Clear any local storage
    localStorage.clear();
    
    // Redirect to public dashboard (root path)
    window.location.href = '/';
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
};

// Optional: Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};