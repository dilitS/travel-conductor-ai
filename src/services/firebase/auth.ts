import {
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
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
  
  // Native: Will be implemented with expo-auth-session in Phase 1.2
  // For now, throw an error indicating native auth is not yet implemented
  throw new Error('Native Google Sign-In not yet implemented. Use web for testing.');
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

export { auth, User };

