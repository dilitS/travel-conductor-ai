/**
 * Trip Store - Zustand store for trip management
 * Updated for new 6-collection data model
 */

import { create } from 'zustand';
import { Trip } from '@/types/trip';
import { TripDay } from '@/types/tripDay';
import { getDocument, getDocuments, COLLECTIONS, where, orderBy, query } from '@/services/firebase';
import { CachedData, isCacheValid, createCache, CACHE_TTL } from '@/utils/cacheHelper';

/**
 * Trip state interface
 */
interface TripState {
  // Trip list
  trips: Trip[];
  cachedTrips: CachedData<Trip[]> | null; // Cache for trips list
  isLoading: boolean;
  error: string | null;
  
  // Current trip (detail view)
  currentTrip: Trip | null;
  tripDays: TripDay[];
  isLoadingDays: boolean;

  // Actions - Trip list
  fetchTrips: (userId: string) => Promise<void>;
  addTrip: (trip: Trip) => void;
  updateTripInList: (trip: Trip) => void;
  removeTripFromList: (tripId: string) => void;
  invalidateTripsCache: () => void; // Invalidate cache

  // Actions - Current trip
  fetchTrip: (tripId: string) => Promise<Trip | null>;
  fetchTripDays: (tripId: string) => Promise<TripDay[]>;
  setCurrentTrip: (trip: Trip | null) => void;
  clearCurrentTrip: () => void;
  updateCurrentTrip: (updates: Partial<Trip>) => void;

  // Actions - Trip days
  setTripDays: (days: TripDay[]) => void;
  updateTripDay: (day: TripDay) => void;

  // Selectors
  getTripById: (tripId: string) => Trip | undefined;
  getDayByIndex: (dayIndex: number) => TripDay | undefined;
  getCurrentDayPlan: (dayIndex: number) => TripDay | undefined;
}

/**
 * Trip store
 */
export const useTripStore = create<TripState>((set, get) => ({
  // Initial state
  trips: [],
  cachedTrips: null,
  isLoading: false,
  error: null,
  currentTrip: null,
  tripDays: [],
  isLoadingDays: false,

  // ============================================
  // Trip List Actions
  // ============================================

  /**
   * Fetch all trips for a user (with cache)
   */
  fetchTrips: async (userId: string) => {
    // Check cache first
    const cached = get().cachedTrips;
    if (isCacheValid(cached)) {
      console.log('[TripStore] Using cached trips, age:', Date.now() - cached.timestamp, 'ms');
      set({ trips: cached.data, isLoading: false });
      return;
    }

    console.log('[TripStore] Cache miss or expired, fetching fresh trips');
    set({ isLoading: true, error: null });
    try {
      const constraints = [
        where('user_id', '==', userId),
        orderBy('start_date', 'desc')
      ];
      
      const trips = await getDocuments<Trip>(COLLECTIONS.TRIPS, constraints);
      const cache = createCache(trips, CACHE_TTL.TRIPS);
      set({ trips, cachedTrips: cache, isLoading: false });
    } catch (error: unknown) {
      console.error('Fetch trips error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Add a trip to the list (after creation)
   */
  addTrip: (trip) => set((state) => ({ 
    trips: [trip, ...state.trips],
    cachedTrips: null // Invalidate cache
  })),

  /**
   * Update a trip in the list
   */
  updateTripInList: (trip) => set((state) => ({
    trips: state.trips.map(t => t.id === trip.id ? trip : t),
    cachedTrips: null // Invalidate cache
  })),

  /**
   * Remove a trip from the list
   */
  removeTripFromList: (tripId) => set((state) => ({
    trips: state.trips.filter(t => t.id !== tripId),
    cachedTrips: null // Invalidate cache
  })),

  /**
   * Invalidate trips cache manually
   */
  invalidateTripsCache: () => set({ cachedTrips: null }),

  // ============================================
  // Current Trip Actions
  // ============================================

  /**
   * Fetch a single trip by ID
   */
  fetchTrip: async (tripId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const trip = await getDocument<Trip>(COLLECTIONS.TRIPS, tripId);
      if (trip) {
        set({ currentTrip: trip, isLoading: false });
      } else {
        set({ error: 'Trip not found', isLoading: false });
      }
      return trip;
    } catch (error: unknown) {
      console.error('Fetch trip error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  /**
   * Fetch all days for a trip
   */
  fetchTripDays: async (tripId: string) => {
    set({ isLoadingDays: true });
    
    try {
      const constraints = [
        where('trip_id', '==', tripId),
        orderBy('day_index', 'asc')
      ];
      
      const days = await getDocuments<TripDay>(COLLECTIONS.TRIP_DAYS, constraints);
      set({ tripDays: days, isLoadingDays: false });
      return days;
    } catch (error: unknown) {
      console.error('Fetch trip days error:', error);
      set({ isLoadingDays: false });
      return [];
    }
  },

  /**
   * Set current trip directly
   */
  setCurrentTrip: (trip) => set({ currentTrip: trip }),

  /**
   * Clear current trip and days
   */
  clearCurrentTrip: () => set({ 
    currentTrip: null, 
    tripDays: [],
    error: null 
  }),

  /**
   * Update current trip with partial data
   */
  updateCurrentTrip: (updates) => set((state) => ({
    currentTrip: state.currentTrip 
      ? { ...state.currentTrip, ...updates }
      : null
  })),

  // ============================================
  // Trip Days Actions
  // ============================================

  /**
   * Set trip days directly
   */
  setTripDays: (days) => set({ tripDays: days }),

  /**
   * Update a single trip day
   */
  updateTripDay: (day) => set((state) => ({
    tripDays: state.tripDays.map(d => 
      d.day_index === day.day_index ? day : d
    )
  })),

  // ============================================
  // Selectors
  // ============================================

  /**
   * Get trip by ID from list
   */
  getTripById: (tripId: string) => {
    return get().trips.find(t => t.id === tripId);
  },

  /**
   * Get day by index from current trip days
   */
  getDayByIndex: (dayIndex: number) => {
    return get().tripDays.find(d => d.day_index === dayIndex);
  },

  /**
   * Alias for getDayByIndex for clarity
   */
  getCurrentDayPlan: (dayIndex: number) => {
    return get().tripDays.find(d => d.day_index === dayIndex);
  },
}));

// ============================================
// Derived Selectors (outside store)
// ============================================

/**
 * Get active trip (in_progress status)
 */
export function getActiveTrip(trips: Trip[]): Trip | undefined {
  return trips.find(t => t.status === 'in_progress');
}

/**
 * Get upcoming trips
 */
export function getUpcomingTrips(trips: Trip[]): Trip[] {
  const today = new Date().toISOString().split('T')[0];
  return trips.filter(t => t.start_date > today && t.status !== 'done');
}

/**
 * Get past trips
 */
export function getPastTrips(trips: Trip[]): Trip[] {
  const today = new Date().toISOString().split('T')[0];
  return trips.filter(t => t.end_date < today || t.status === 'done');
}
