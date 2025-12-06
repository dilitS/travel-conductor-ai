import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const store = useAuthStore();

  // Initialize auth listener once on mount (in root layout ideally)
  // but we expose the store logic here
  
  return {
    user: store.user,
    isLoading: store.isLoading,
    error: store.error,
    isAuthenticated: !!store.user,
    isInitialized: store.isInitialized,
    signInWithGoogle: store.signInWithGoogle,
    signOut: store.signOut,
  };
}

export function useProtectedRoute() {
  // Will be implemented in Phase 1.3
}

