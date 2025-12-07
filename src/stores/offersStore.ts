/**
 * Offers Store - Zustand store for trip offers
 * Supports filtering by step_id and day_index
 */

import { create } from 'zustand';
import { Offer } from '@/types/offer';
import { getDocuments, COLLECTIONS, where } from '@/services/firebase';
import { CachedData, isCacheValid, createCache, CACHE_TTL } from '@/utils/cacheHelper';

/**
 * Offers state interface
 */
interface OffersState {
  // Offers array
  offers: Offer[];
  cachedOffers: Map<string, CachedData<Offer[]>> | null; // Cache per tripId
  isLoading: boolean;
  error: string | null;
  currentTripId: string | null;

  // Actions
  fetchOffersForTrip: (tripId: string) => Promise<void>;
  getOffersForStep: (stepId: string) => Offer[];
  getOffersForDay: (dayIndex: number) => Offer[];
  getOffersForPlace: (placeId: string) => Offer[];
  clearOffers: () => void;
  addOffer: (offer: Offer) => void;
  invalidateOffersCache: (tripId?: string) => void; // Invalidate cache
}

/**
 * Offers store
 */
export const useOffersStore = create<OffersState>((set, get) => ({
  // Initial state
  offers: [],
  cachedOffers: null,
  isLoading: false,
  error: null,
  currentTripId: null,

  /**
   * Fetch all offers for a trip (with cache)
   */
  fetchOffersForTrip: async (tripId: string) => {
    // Check cache first
    const cachedOffers = get().cachedOffers;
    const cached = cachedOffers?.get(tripId);
    if (cached && isCacheValid(cached)) {
      console.log('[OffersStore] Using cached offers for trip', tripId, ', age:', Date.now() - cached.timestamp, 'ms');
      set({ offers: cached.data, currentTripId: tripId, isLoading: false });
      return;
    }

    console.log('[OffersStore] Cache miss or expired, fetching fresh offers for trip', tripId);
    set({ isLoading: true, error: null, currentTripId: tripId });
    try {
      const constraints = [where('trip_id', '==', tripId)];
      const offers = await getDocuments<Offer>(COLLECTIONS.OFFERS, constraints);
      
      // Update cache
      const cache = createCache(offers, CACHE_TTL.OFFERS);
      const newCachedOffers = new Map(get().cachedOffers || new Map());
      newCachedOffers.set(tripId, cache);

      set({ offers, cachedOffers: newCachedOffers, isLoading: false });
    } catch (error: unknown) {
      console.error('Fetch offers error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Get offers linked to a specific step
   */
  getOffersForStep: (stepId: string) => {
    return get().offers.filter(o => o.linked_to?.step_id === stepId);
  },

  /**
   * Get offers linked to a specific day
   */
  getOffersForDay: (dayIndex: number) => {
    return get().offers.filter(o => o.linked_to?.day_index === dayIndex);
  },

  /**
   * Get offers linked to a specific place
   */
  getOffersForPlace: (placeId: string) => {
    return get().offers.filter(o => o.linked_to?.place_id === placeId);
  },

  /**
   * Clear all offers (when changing trips)
   */
  clearOffers: () => {
    set({
      offers: [],
      error: null,
      currentTripId: null,
    });
  },

  /**
   * Add a single offer
   */
  addOffer: (offer: Offer) => {
    set((state) => {
      // Invalidate cache for current trip
      const newCachedOffers = state.cachedOffers ? new Map(state.cachedOffers) : null;
      if (newCachedOffers && state.currentTripId) {
        newCachedOffers.delete(state.currentTripId);
      }
      return {
        offers: [...state.offers, offer],
        cachedOffers: newCachedOffers,
      };
    });
  },

  /**
   * Invalidate offers cache manually
   */
  invalidateOffersCache: (tripId?: string) => {
    set((state) => {
      if (!tripId) {
        // Clear all cache
        return { cachedOffers: null };
      }
      // Clear cache for specific trip
      const newCachedOffers = state.cachedOffers ? new Map(state.cachedOffers) : null;
      if (newCachedOffers) {
        newCachedOffers.delete(tripId);
      }
      return { cachedOffers: newCachedOffers };
    });
  },
}));

// ============================================
// Derived Selectors (outside store)
// ============================================

/**
 * Group offers by type
 */
export function groupOffersByType(offers: Offer[]): Map<string, Offer[]> {
  const grouped = new Map<string, Offer[]>();
  
  offers.forEach(offer => {
    const existing = grouped.get(offer.type) || [];
    grouped.set(offer.type, [...existing, offer]);
  });
  
  return grouped;
}

/**
 * Get hotel offers
 */
export function getHotelOffers(offers: Offer[]): Offer[] {
  return offers.filter(o => o.type === 'hotel');
}

/**
 * Get ticket offers
 */
export function getTicketOffers(offers: Offer[]): Offer[] {
  return offers.filter(o => o.type === 'ticket');
}

/**
 * Get tour offers
 */
export function getTourOffers(offers: Offer[]): Offer[] {
  return offers.filter(o => o.type === 'tour');
}

/**
 * Get offers sorted by price (ascending)
 */
export function sortOffersByPrice(offers: Offer[]): Offer[] {
  return [...offers].sort((a, b) => a.price_snapshot.amount - b.price_snapshot.amount);
}

