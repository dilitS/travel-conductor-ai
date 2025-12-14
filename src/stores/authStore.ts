import { create } from 'zustand';
import { User } from 'firebase/auth';
import {
  signInWithGoogle as firebaseSignInGoogle,
  handleGoogleSignIn as firebaseHandleGoogleSignIn,
  signUpWithEmail as firebaseSignUpWithEmail,
  signInWithEmail as firebaseSignInWithEmail,
  resetPassword as firebaseResetPassword,
  signOut as firebaseSignOut,
  signInAnonymously as firebaseSignInAnonymously,
  onAuthStateChange,
  getDocument,
  setDocument,
  COLLECTIONS,
} from '@/services/firebase';
import { UserProfile, UserSubscription, isPremiumUser } from '@/types/user';

interface AuthStore {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  showConsentModal: boolean;

  signInWithGoogle: () => Promise<void>;
  handleGoogleSignIn: (idToken: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => () => void; // Returns unsubscribe function
  isPremium: () => boolean;
  acceptTerms: () => Promise<void>;
  checkConsentRequired: () => boolean;
  clearError: () => void;
}

// Default free subscription
const DEFAULT_SUBSCRIPTION: UserSubscription = {
  status: 'free',
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true, // Start loading immediately for auth check
  error: null,
  isInitialized: false,
  showConsentModal: false,

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const credential = await firebaseSignInGoogle();
      const firebaseUser = credential.user;
      
      // Sync user to Firestore
      await syncUserToFirestore(firebaseUser);
      
      // Note: The onAuthStateChange listener will actually update the state
      // So we don't strictly need to set user here, but it feels faster UI-wise
      // We rely on the listener for the source of truth though
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      console.error('Google Sign-In Error:', error);
    }
  },

  handleGoogleSignIn: async (idToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const credential = await firebaseHandleGoogleSignIn(idToken);
      const firebaseUser = credential.user;
      await syncUserToFirestore(firebaseUser);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
      console.error('Google Sign-In Error:', error);
    }
  },

  signUpWithEmail: async (email: string, password: string, displayName?: string) => {
    set({ isLoading: true, error: null });
    try {
      const credential = await firebaseSignUpWithEmail(email, password, displayName);
      const firebaseUser = credential.user;
      await syncUserToFirestore(firebaseUser);
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      console.error('Email Sign-Up Error:', error);
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const credential = await firebaseSignInWithEmail(email, password);
      const firebaseUser = credential.user;
      await syncUserToFirestore(firebaseUser);
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      console.error('Email Sign-In Error:', error);
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await firebaseResetPassword(email);
      set({ isLoading: false });
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      console.error('Password Reset Error:', error);
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await firebaseSignOut();
      // State will be updated by listener
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  isPremium: () => {
    const user = get().user;
    return user ? isPremiumUser(user) : false;
  },

  checkConsentRequired: () => {
    const user = get().user;
    return user !== null && !user.has_accepted_terms;
  },

  acceptTerms: async () => {
    const user = get().user;
    if (!user) return;

    const now = new Date().toISOString();
    const updatedUser: UserProfile = {
      ...user,
      has_accepted_terms: true,
      terms_accepted_at: now,
      updated_at: now,
    };

    await setDocument(COLLECTIONS.USERS, user.uid, {
      has_accepted_terms: true,
      terms_accepted_at: now,
      updated_at: now,
    }, true);

    set({ user: updatedUser, showConsentModal: false });
  },

  initialize: () => {
    // In dev mode with bypass, use anonymous auth for real Firebase session
    if (__DEV__ && process.env.EXPO_PUBLIC_BYPASS_AUTH === 'true') {
      console.log('[AuthStore] Dev bypass mode - using anonymous auth');
      
      // First set up the listener, then sign in anonymously
      const unsubscribe = onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userProfile = await getDocument<UserProfile>(COLLECTIONS.USERS, firebaseUser.uid);
            
            if (userProfile) {
              set({ user: userProfile, isLoading: false, isInitialized: true, showConsentModal: false });
            } else {
              const newProfile = await syncUserToFirestore(firebaseUser);
              // Dev users auto-accept terms
              const devProfile = { ...newProfile, has_accepted_terms: true, terms_accepted_at: new Date().toISOString() };
              await setDocument(COLLECTIONS.USERS, firebaseUser.uid, devProfile, true);
              set({ user: devProfile, isLoading: false, isInitialized: true, showConsentModal: false });
            }
          } catch (error) {
            console.error('Error in dev auth:', error);
            const fallbackProfile = mapFirebaseUserToProfile(firebaseUser);
            fallbackProfile.has_accepted_terms = true;
            set({ user: fallbackProfile, isLoading: false, isInitialized: true, showConsentModal: false });
          }
        } else {
          set({ user: null, isLoading: false, isInitialized: true });
        }
      });

      // Sign in anonymously for dev mode
      firebaseSignInAnonymously().catch(err => {
        console.error('[AuthStore] Anonymous sign-in failed:', err);
        set({ error: 'Failed to sign in anonymously', isLoading: false, isInitialized: true });
      });

      return unsubscribe;
    }

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch enriched user profile from Firestore
          const userProfile = await getDocument<UserProfile>(COLLECTIONS.USERS, firebaseUser.uid);
          
          if (userProfile) {
            const needsConsent = !userProfile.has_accepted_terms;
            set({ user: userProfile, isLoading: false, isInitialized: true, showConsentModal: needsConsent });
          } else {
            // If doc doesn't exist yet (race condition or first load), create/sync it
            const newProfile = await syncUserToFirestore(firebaseUser);
            // New users always need to accept terms
            set({ user: newProfile, isLoading: false, isInitialized: true, showConsentModal: true });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to basic firebase user data if firestore fails
          const fallbackProfile = mapFirebaseUserToProfile(firebaseUser);
          set({ 
            user: fallbackProfile, 
            isLoading: false, 
            isInitialized: true,
            showConsentModal: !fallbackProfile.has_accepted_terms,
          });
        }
      } else {
        set({ user: null, isLoading: false, isInitialized: true });
      }
    });

    return unsubscribe;
  },
}));

// Helper to sync Firebase Auth user to Firestore UserProfile
async function syncUserToFirestore(firebaseUser: User): Promise<UserProfile> {
  const now = new Date().toISOString();
  
  // Check if user exists to set created_at only on creation
  const existingUser = await getDocument<UserProfile>(COLLECTIONS.USERS, firebaseUser.uid);
  
  const userData: UserProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    display_name: firebaseUser.displayName,
    photo_url: firebaseUser.photoURL,
    subscription: existingUser?.subscription || DEFAULT_SUBSCRIPTION,
    published_plans_count: existingUser?.published_plans_count || 0,
    total_votes_received: existingUser?.total_votes_received || 0,
    created_at: existingUser?.created_at || now,
    updated_at: now,
  };

  await setDocument(COLLECTIONS.USERS, firebaseUser.uid, userData, true);
  
  return userData;
}

function mapFirebaseUserToProfile(firebaseUser: User): UserProfile {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    display_name: firebaseUser.displayName,
    photo_url: firebaseUser.photoURL,
    subscription: DEFAULT_SUBSCRIPTION,
    published_plans_count: 0,
    total_votes_received: 0,
    has_accepted_terms: false, // New users need to accept terms
    created_at: new Date().toISOString(),
  };
}

// Firebase Auth error messages in Polish
function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'Wystąpił nieznany błąd';
  
  const errorCode = (error as { code?: string }).code;
  
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Ten adres email jest już zarejestrowany';
    case 'auth/invalid-email':
      return 'Nieprawidłowy adres email';
    case 'auth/operation-not-allowed':
      return 'Logowanie email/hasło jest wyłączone';
    case 'auth/weak-password':
      return 'Hasło jest za słabe (min. 6 znaków)';
    case 'auth/user-disabled':
      return 'To konto zostało zablokowane';
    case 'auth/user-not-found':
      return 'Nie znaleziono użytkownika z tym adresem email';
    case 'auth/wrong-password':
      return 'Nieprawidłowe hasło';
    case 'auth/invalid-credential':
      return 'Nieprawidłowy email lub hasło';
    case 'auth/too-many-requests':
      return 'Zbyt wiele prób logowania. Spróbuj ponownie za chwilę';
    case 'auth/network-request-failed':
      return 'Błąd połączenia. Sprawdź internet';
    default:
      return error.message || 'Wystąpił błąd podczas logowania';
  }
}

