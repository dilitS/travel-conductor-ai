import {
  signInWithPopup,
  signInWithCredential,
  signInAnonymously as firebaseSignInAnonymously,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from './config';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

/**
 * Sign in with Google
 * Uses different methods for web vs native platforms
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  if (Platform.OS === 'web') {
    // Web: Use popup
    return signInWithPopup(auth, googleProvider);
  }
  
  // Native: This function is called after promptAsync() succeeds
  // The actual sign-in happens in the component using useGoogleAuth hook
  throw new Error('Use useGoogleAuth hook and handleGoogleSignIn for native platforms');
}

/**
 * Handle Google Sign-In response from expo-auth-session
 * Call this after promptAsync() returns a successful response
 */
export async function handleGoogleSignIn(idToken: string): Promise<UserCredential> {
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  displayName?: string
): Promise<UserCredential> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update display name if provided
  if (displayName && credential.user) {
    await updateProfile(credential.user, { displayName });
  }
  
  return credential;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string, 
  password: string
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return auth.currentUser !== null;
}

/**
 * Sign in anonymously (for development/testing)
 */
export async function signInAnonymously(): Promise<UserCredential> {
  return firebaseSignInAnonymously(auth);
}

export { auth, User };

