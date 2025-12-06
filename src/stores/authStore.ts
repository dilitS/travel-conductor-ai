import { create } from 'zustand';
import { User } from 'firebase/auth';
import {
  signInWithGoogle as firebaseSignInGoogle,
  signOut as firebaseSignOut,
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

  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => () => void; // Returns unsubscribe function
  isPremium: () => boolean;
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

  isPremium: () => {
    const user = get().user;
    return user ? isPremiumUser(user) : false;
  },

  initialize: () => {
    // MOCK AUTH FOR UI DEVELOPMENT
    // Remove this block when ready for real auth testing
    if (true) {
        const mockUser: UserProfile = {
          uid: 'test-user',
          email: 'dev@example.com',
          display_name: 'Dev User',
          photo_url: null,
          subscription: { status: 'active' },
          published_plans_count: 0,
          total_votes_received: 0,
          created_at: new Date().toISOString(),
        };
        set({ 
            user: mockUser,
            isLoading: false, 
            isInitialized: true 
        });
        return () => {};
    }

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch enriched user profile from Firestore
          const userProfile = await getDocument<UserProfile>(COLLECTIONS.USERS, firebaseUser.uid);
          
          if (userProfile) {
            set({ user: userProfile, isLoading: false, isInitialized: true });
          } else {
            // If doc doesn't exist yet (race condition or first load), create/sync it
            const newProfile = await syncUserToFirestore(firebaseUser);
            set({ user: newProfile, isLoading: false, isInitialized: true });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to basic firebase user data if firestore fails
          set({ 
            user: mapFirebaseUserToProfile(firebaseUser), 
            isLoading: false, 
            isInitialized: true 
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
    created_at: new Date().toISOString(),
  };
}

