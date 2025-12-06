/**
 * Types barrel export
 * Re-exports all types for convenient imports
 */

// Trip types
export type {
  TransportMode,
  BudgetLevel,
  TripStatus,
  TripPeople,
  Trip,
  TripCreate,
  TripUpdate,
  TripSummary,
} from './trip';

export {
  getTripDurationDays,
  isTripActive,
  isTripUpcoming,
} from './trip';

// Step types
export type {
  StepType,
  MoveMode,
  StepStatus,
  BaseStep,
  VisitStep,
  TransferStep,
  MealStep,
  AccommodationStep,
  RelaxStep,
  Step,
} from './step';

export {
  isVisitStep,
  isTransferStep,
  isMealStep,
} from './step';

// TripDay types
export type {
  RainPlan,
  PlanJson,
  TripDay,
  TripDayCreate,
  TripDaySummary,
} from './tripDay';

// Place types
export type {
  PlaceNotes,
  Place,
  PlaceCreate,
  Coordinates,
} from './place';

export {
  calculateDistance,
  isWithinTriggerRadius,
} from './place';

// Offer types
export type {
  OfferType,
  OfferProvider,
  LinkedTo,
  PriceSnapshot,
  Offer,
  OfferCreate,
} from './offer';

export {
  formatPrice,
} from './offer';

// LiveSession types
export type {
  SessionStatus,
  GeoLocation,
  LiveSession,
  LiveSessionCreate,
  CurrentStepResponse,
} from './liveSession';

export {
  shouldTriggerAudio,
  isSessionActive,
} from './liveSession';

// User types
export type {
  SubscriptionStatus,
  UserSubscription,
  UserProfile,
  AuthState,
  SharedPlan,
  SharedPlanCreate,
  Vote,
} from './user';

export {
  isPremiumUser,
  isSubscriptionExpiringSoon,
} from './user';
