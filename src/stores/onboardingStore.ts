/**
 * Onboarding Store - Zustand store for onboarding state management
 * Persists onboarding completion and user interests
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Available interest categories
 */
export const INTEREST_OPTIONS = [
  'Zwiedzanie',
  'Sztuka',
  'Jedzenie',
  'Przyroda',
  'Relaks',
  'Sport',
  'Shopping',
  'Życie nocne',
  'Historia',
  'Muzyka',
] as const;

export type Interest = (typeof INTEREST_OPTIONS)[number];

/**
 * Onboarding state interface
 */
interface OnboardingState {
  // State
  hasSeenOnboarding: boolean;
  selectedInterests: Interest[];
  isHydrated: boolean;

  // Actions
  setInterests: (interests: Interest[]) => void;
  toggleInterest: (interest: Interest) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setHydrated: (hydrated: boolean) => void;
}

/**
 * Onboarding store with persistence
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      // Initial state
      hasSeenOnboarding: false,
      selectedInterests: [],
      isHydrated: false,

      /**
       * Set all interests at once
       */
      setInterests: (interests) => set({ selectedInterests: interests }),

      /**
       * Toggle a single interest
       */
      toggleInterest: (interest) => {
        const current = get().selectedInterests;
        const exists = current.includes(interest);
        
        if (exists) {
          set({ selectedInterests: current.filter((i) => i !== interest) });
        } else {
          set({ selectedInterests: [...current, interest] });
        }
      },

      /**
       * Mark onboarding as complete
       */
      completeOnboarding: () => {
        set({ hasSeenOnboarding: true });
        // Interests are already persisted via zustand persist
        console.log('[OnboardingStore] Onboarding completed with interests:', get().selectedInterests);
      },

      /**
       * Reset onboarding (for testing/debugging)
       */
      resetOnboarding: () => {
        set({
          hasSeenOnboarding: false,
          selectedInterests: [],
        });
        console.log('[OnboardingStore] Onboarding reset');
      },

      /**
       * Set hydration state
       */
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

/**
 * Hook to check if user needs onboarding
 */
export function useNeedsOnboarding(): boolean {
  const { hasSeenOnboarding, isHydrated } = useOnboardingStore();
  
  // Wait for hydration before making decisions
  if (!isHydrated) return false;
  
  return !hasSeenOnboarding;
}




