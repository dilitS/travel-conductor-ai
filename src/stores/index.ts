/**
 * Stores barrel export
 */

// Auth store
export { useAuthStore } from './authStore';

// Trip store
export {
  useTripStore,
  getActiveTrip,
  getUpcomingTrips,
  getPastTrips,
} from './tripStore';

// Places store
export {
  usePlacesStore,
  getPlacesArray,
  getPlacesByCity,
  getPlacesByCategory,
} from './placesStore';

// Offers store
export {
  useOffersStore,
  groupOffersByType,
  getHotelOffers,
  getTicketOffers,
  getTourOffers,
  sortOffersByPrice,
} from './offersStore';

// Guide store (voice guide)
export {
  useGuideStore,
  getCurrentPlaceId,
  getDistanceToStep,
  isNearCurrentStep,
} from './guideStore';

// Creator store
export { useCreatorStore } from './creatorStore';

