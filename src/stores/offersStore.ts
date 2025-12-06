/**
 * Offers Store - Zustand store for trip offers
 * Supports filtering by step_id and day_index
 */

import { create } from 'zustand';
import { Offer } from '@/types/offer';
import { getDocuments, COLLECTIONS, where } from '@/services/firebase';

/**
 * Offers state interface
 */
interface OffersState {
  // Offers array
  offers: Offer[];
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
}

/**
 * Offers store
 */
export const useOffersStore = create<OffersState>((set, get) => ({
  // Initial state
  offers: [],
  isLoading: false,
  error: null,
  currentTripId: null,

  /**
   * Fetch all offers for a trip
   */
  fetchOffersForTrip: async (tripId: string) => {
    set({ isLoading: true, error: null, currentTripId: tripId });
    try {
      const constraints = [where('trip_id', '==', tripId)];
      const offers = await getDocuments<Offer>(COLLECTIONS.OFFERS, constraints);
      set({ offers, isLoading: false });
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
    set((state) => ({
      offers: [...state.offers, offer],
    }));
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

