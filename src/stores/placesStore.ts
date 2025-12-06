/**
 * Places Store - Zustand store for trip places
 * Uses Map for O(1) lookup by place_id
 */

import { create } from 'zustand';
import { Place } from '@/types/place';
import { getDocuments, COLLECTIONS, where } from '@/services/firebase';
import { KRAKOW_TRIP_ID, KRAKOW_PLACES } from '@/data/krakowDemoData';

/**
 * Places state interface
 */
interface PlacesState {
  // Places map (key: place_id)
  places: Map<string, Place>;
  isLoading: boolean;
  error: string | null;
  currentTripId: string | null;

  // Actions
  fetchPlacesForTrip: (tripId: string) => Promise<void>;
  getPlaceById: (placeId: string) => Place | undefined;
  getPlacesByIds: (placeIds: string[]) => Place[];
  clearPlaces: () => void;
  setPlace: (place: Place) => void;
}

/**
 * Places store
 */
export const usePlacesStore = create<PlacesState>((set, get) => ({
  // Initial state
  places: new Map(),
  isLoading: false,
  error: null,
  currentTripId: null,

  /**
   * Fetch all places for a trip
   * Falls back to demo data for Krakow trip
   */
  fetchPlacesForTrip: async (tripId: string) => {
    set({ isLoading: true, error: null, currentTripId: tripId });
    
    // Return demo Krakow places if requested
    if (tripId === KRAKOW_TRIP_ID) {
      const placesMap = new Map<string, Place>();
      KRAKOW_PLACES.forEach(place => {
        placesMap.set(place.place_id, place);
      });
      set({ places: placesMap, isLoading: false });
      return;
    }
    
    try {
      const constraints = [where('trip_id', '==', tripId)];
      const placesArray = await getDocuments<Place>(COLLECTIONS.PLACES, constraints);
      
      // Convert to Map for O(1) lookup
      const placesMap = new Map<string, Place>();
      placesArray.forEach(place => {
        placesMap.set(place.place_id, place);
      });

      set({ places: placesMap, isLoading: false });
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
      return { places: newPlaces };
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

