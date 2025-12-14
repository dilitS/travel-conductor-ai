/**
 * Places Store - Zustand store for trip places
 * Uses Map for O(1) lookup by place_id
 */

import { create } from 'zustand';
import { Place } from '@/types/place';
import { getDocuments, COLLECTIONS, where } from '@/services/firebase';
import { CachedData, isCacheValid, createCache, CACHE_TTL } from '@/utils/cacheHelper';

/**
 * Places state interface
 */
interface PlacesState {
  // Places map (key: place_id)
  places: Map<string, Place>;
  cachedPlaces: Map<string, CachedData<Map<string, Place>>> | null; // Cache per tripId
  isLoading: boolean;
  error: string | null;
  currentTripId: string | null;

  // Actions
  fetchPlacesForTrip: (tripId: string) => Promise<void>;
  getPlaceById: (placeId: string) => Place | undefined;
  getPlacesByIds: (placeIds: string[]) => Place[];
  clearPlaces: () => void;
  setPlace: (place: Place) => void;
  invalidatePlacesCache: (tripId?: string) => void; // Invalidate cache
}

/**
 * Places store
 */
export const usePlacesStore = create<PlacesState>((set, get) => ({
  // Initial state
  places: new Map(),
  cachedPlaces: null,
  isLoading: false,
  error: null,
  currentTripId: null,

  /**
   * Fetch all places for a trip (with cache)
   * Falls back to demo data for Krakow trip
   */
  fetchPlacesForTrip: async (tripId: string) => {
    // Check cache first
    const cachedPlaces = get().cachedPlaces;
    const cached = cachedPlaces?.get(tripId);
    if (cached && isCacheValid(cached)) {
      console.log('[PlacesStore] Using cached places for trip', tripId, ', age:', Date.now() - cached.timestamp, 'ms');
      set({ places: cached.data, currentTripId: tripId, isLoading: false });
      return;
    }

    console.log('[PlacesStore] Cache miss or expired, fetching fresh places for trip', tripId);
    set({ isLoading: true, error: null, currentTripId: tripId });
    
    try {
      const constraints = [where('trip_id', '==', tripId)];
      const placesArray = await getDocuments<Place>(COLLECTIONS.PLACES, constraints);
      
      // Convert to Map for O(1) lookup
      const placesMap = new Map<string, Place>();
      placesArray.forEach(place => {
        placesMap.set(place.place_id, place);
      });

      // Update cache
      const cache = createCache(placesMap, CACHE_TTL.PLACES);
      const newCachedPlaces = new Map(get().cachedPlaces || new Map());
      newCachedPlaces.set(tripId, cache);

      set({ places: placesMap, cachedPlaces: newCachedPlaces, isLoading: false });
    } catch (error: unknown) {
      console.error('Fetch places error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Get place by place_id
   */
  getPlaceById: (placeId: string) => {
    return get().places.get(placeId);
  },

  /**
   * Get multiple places by IDs
   */
  getPlacesByIds: (placeIds: string[]) => {
    const places = get().places;
    return placeIds
      .map(id => places.get(id))
      .filter((p): p is Place => p !== undefined);
  },

  /**
   * Clear all places (when changing trips)
   */
  clearPlaces: () => {
    set({
      places: new Map(),
      error: null,
      currentTripId: null,
    });
  },

  /**
   * Set/update a single place
   */
  setPlace: (place: Place) => {
    set((state) => {
      const newPlaces = new Map(state.places);
      newPlaces.set(place.place_id, place);
      // Invalidate cache for current trip
      const newCachedPlaces = state.cachedPlaces ? new Map(state.cachedPlaces) : null;
      if (newCachedPlaces && state.currentTripId) {
        newCachedPlaces.delete(state.currentTripId);
      }
      return { places: newPlaces, cachedPlaces: newCachedPlaces };
    });
  },

  /**
   * Invalidate places cache manually
   */
  invalidatePlacesCache: (tripId?: string) => {
    set((state) => {
      if (!tripId) {
        // Clear all cache
        return { cachedPlaces: null };
      }
      // Clear cache for specific trip
      const newCachedPlaces = state.cachedPlaces ? new Map(state.cachedPlaces) : null;
      if (newCachedPlaces) {
        newCachedPlaces.delete(tripId);
      }
      return { cachedPlaces: newCachedPlaces };
    });
  },
}));

// ============================================
// Derived Selectors (outside store)
// ============================================

/**
 * Get places as array
 */
export function getPlacesArray(places: Map<string, Place>): Place[] {
  return Array.from(places.values());
}

/**
 * Get places for a specific city
 */
export function getPlacesByCity(places: Map<string, Place>, city: string): Place[] {
  return Array.from(places.values()).filter(p => 
    p.city.toLowerCase() === city.toLowerCase()
  );
}

/**
 * Get places by category
 */
export function getPlacesByCategory(places: Map<string, Place>, category: string): Place[] {
  return Array.from(places.values()).filter(p => 
    p.categories.includes(category)
  );
}

