/**
 * Guide Store - Zustand store for voice guide session management
 * Coordinates location, audio, and guide state
 */

import { create } from 'zustand';
import { LiveSession, GeoLocation, CurrentStepResponse } from '@/types/liveSession';
import {
  createLiveSession,
  updateLiveLocation,
  markLiveStepAutoplayed,
  endLiveSession,
  getLiveSession,
} from '@/services/firebase';

/**
 * Guide state interface
 */
interface GuideState {
  // Session state
  session: LiveSession | null;
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;

  // Audio state
  isAudioPlaying: boolean;
  currentAudioStepId: string | null;

  // Location & step state
  currentStep: CurrentStepResponse | null;
  lastLocation: GeoLocation | null;

  // Weather state (for rain plan)
  isRaining: boolean;
  useRainPlan: boolean;

  // Actions - Session
  startSession: (tripId: string) => Promise<string | null>;
  startDemoSession: (tripId: string) => void;
  endSession: () => Promise<void>;
  restoreSession: (tripId: string) => Promise<void>;

  // Actions - Location
  updateLocation: (lat: number, lon: number) => Promise<void>;
  setLastLocation: (location: GeoLocation) => void;

  // Actions - Step
  setCurrentStep: (step: CurrentStepResponse | null) => void;
  markStepAutoplayed: (stepId: string) => Promise<void>;

  // Actions - Audio
  setAudioPlaying: (playing: boolean, stepId?: string) => void;

  // Actions - Weather
  setIsRaining: (raining: boolean) => void;
  setUseRainPlan: (use: boolean) => void;

  // Actions - Reset
  resetGuide: () => void;

  // Computed
  shouldTriggerAudio: () => boolean;
}

/**
 * Initial state
 */
const initialState = {
  session: null,
  isActive: false,
  isLoading: false,
  error: null,
  isDemoMode: false,
  isAudioPlaying: false,
  currentAudioStepId: null,
  currentStep: null,
  lastLocation: null,
  isRaining: false,
  useRainPlan: false,
};

/**
 * Guide store
 */
export const useGuideStore = create<GuideState>((set, get) => ({
  ...initialState,

  // ============================================
  // Session Actions
  // ============================================

  /**
   * Start a new guide session
   */
  startSession: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await createLiveSession({ trip_id: tripId });
      
      // Create session object
      const session: LiveSession = {
        id: response.session_id,
        trip_id: tripId,
        user_id: '', // Will be filled by backend
        last_location: null,
        autoplayed_steps: [],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      set({
        session,
        isActive: true,
        isLoading: false,
      });

      return response.session_id;
    } catch (error: unknown) {
      console.error('Start session error:', error);
      const message = error instanceof Error ? error.message : 'Failed to start session';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  /**
   * Start a demo session (no API calls)
   */
  startDemoSession: (tripId: string) => {
    const mockSession: LiveSession = {
      id: `demo-${Date.now()}`,
      trip_id: tripId,
      user_id: 'demo-user',
      last_location: null,
      autoplayed_steps: [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    set({
      session: mockSession,
      isActive: true,
      isDemoMode: true,
      isLoading: false,
      error: null,
    });
  },

  /**
   * End the current session (local only in demo mode)
   */
  endSession: async () => {
    const { session, isDemoMode } = get();
    if (!session) return;

    set({ isLoading: true });
    try {
      // In demo mode, skip API call
      if (!isDemoMode) {
        await endLiveSession({ session_id: session.id });
      }

      set({
        ...initialState,
        isLoading: false,
      });
    } catch (error: unknown) {
      console.error('End session error:', error);
      const message = error instanceof Error ? error.message : 'Failed to end session';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Restore an existing active session
   */
  restoreSession: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getLiveSession({ trip_id: tripId });
      
      if (response.session) {
        const session: LiveSession = {
          id: response.session.id,
          trip_id: response.session.trip_id,
          user_id: response.session.user_id,
          last_location: response.session.last_location || null,
          autoplayed_steps: response.session.autoplayed_steps,
          status: response.session.status,
          created_at: response.session.created_at,
          updated_at: response.session.updated_at,
        };

        set({
          session,
          isActive: session.status === 'active',
          lastLocation: session.last_location,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error: unknown) {
      console.error('Restore session error:', error);
      set({ isLoading: false });
    }
  },

  // ============================================
  // Location Actions
  // ============================================

  /**
   * Update location (calls Cloud Function, or local in demo mode)
   */
  updateLocation: async (lat: number, lon: number) => {
    const { session, isDemoMode } = get();
    if (!session) return;

    const location: GeoLocation = {
      lat,
      lon,
      timestamp: new Date().toISOString(),
    };

    // In demo mode, just update local state
    if (isDemoMode) {
      set({ lastLocation: location });
      return;
    }

    // Normal mode: call Cloud Function
    try {
      await updateLiveLocation({
        session_id: session.id,
        lat,
        lon,
      });

      set({ lastLocation: location });
    } catch (error: unknown) {
      console.error('Update location error:', error);
    }
  },

  /**
   * Set last location locally (without CF call)
   */
  setLastLocation: (location: GeoLocation) => {
    set({ lastLocation: location });
  },

  // ============================================
  // Step Actions
  // ============================================

  /**
   * Set current step info
   */
  setCurrentStep: (step: CurrentStepResponse | null) => {
    set({ currentStep: step });
  },

  /**
   * Mark step as autoplayed (local only in demo mode)
   */
  markStepAutoplayed: async (stepId: string) => {
    const { session, isDemoMode } = get();
    if (!session) return;

    // Update local session state
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            autoplayed_steps: [...state.session.autoplayed_steps, stepId],
          }
        : null,
    }));

    // In demo mode, skip API call
    if (isDemoMode) {
      return;
    }

    // Normal mode: call Cloud Function
    try {
      await markLiveStepAutoplayed({
        session_id: session.id,
        step_id: stepId,
      });
    } catch (error: unknown) {
      console.error('Mark step autoplayed error:', error);
    }
  },

  // ============================================
  // Audio Actions
  // ============================================

  /**
   * Set audio playing state
   */
  setAudioPlaying: (playing: boolean, stepId?: string) => {
    set({
      isAudioPlaying: playing,
      currentAudioStepId: playing ? (stepId || null) : null,
    });
  },

  // ============================================
  // Weather Actions
  // ============================================

  /**
   * Set raining status
   */
  setIsRaining: (raining: boolean) => {
    set({ isRaining: raining });
  },

  /**
   * Set whether to use rain plan
   */
  setUseRainPlan: (use: boolean) => {
    set({ useRainPlan: use });
  },

  // ============================================
  // Reset
  // ============================================

  /**
   * Reset all guide state
   */
  resetGuide: () => {
    set({
      ...initialState,
      isDemoMode: false,
    });
  },

  // ============================================
  // Computed
  // ============================================

  /**
   * Check if audio should trigger
   */
  shouldTriggerAudio: () => {
    const { currentStep, isAudioPlaying, session } = get();
    
    if (!currentStep || !session) return false;
    if (isAudioPlaying) return false;
    if (!currentStep.step.trigger_audio_now) return false;
    if (currentStep.step.autoplay_already_triggered) return false;
    
    // Additional check: not already in local autoplayed_steps
    if (session.autoplayed_steps.includes(currentStep.step.step_id)) return false;
    
    return true;
  },
}));

// ============================================
// Derived Selectors (outside store)
// ============================================

/**
 * Get current place ID from step
 */
export function getCurrentPlaceId(step: CurrentStepResponse | null): string | undefined {
  return step?.step?.place_id;
}

/**
 * Get distance to current step in meters
 */
export function getDistanceToStep(step: CurrentStepResponse | null): number | undefined {
  return step?.step?.distance_m_to_step;
}

/**
 * Check if user is near current step
 */
export function isNearCurrentStep(step: CurrentStepResponse | null, thresholdMeters = 100): boolean {
  const distance = step?.step?.distance_m_to_step;
  return distance !== undefined && distance <= thresholdMeters;
}

