// Firebase configuration and app instance
export { firebaseApp, auth, db, functions, storage } from './config';

// Authentication services
export {
  signInWithGoogle,
  handleGoogleSignIn,
  signUpWithEmail,
  signInWithEmail,
  resetPassword,
  signOut,
  signInAnonymously,
  getCurrentUser,
  onAuthStateChange,
  isAuthenticated,
} from './auth';
export type { User } from './auth';

// Firestore services
export {
  COLLECTIONS,
  getDocRef,
  getCollectionRef,
  getDocument,
  getDocuments,
  setDocument,
  updateDocument,
  deleteDocument,
  subscribeToDocument,
  subscribeToCollection,
  createBatch,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from './firestore';

// Cloud Functions
export {
  FUNCTION_NAMES,
  // Trip
  createTrip,
  generateTripDay,
  editTripDay,
  generateTripPlan, // deprecated
  editTripPlan, // deprecated
  seedKrakowTrip, // dev
  // Social
  publishTrip,
  voteOnPlan,
  // Payments
  createCheckoutSession,
  // Live Session
  createLiveSession,
  updateLiveLocation,
  markLiveStepAutoplayed,
  endLiveSession,
  getLiveSession,
} from './functions';
export type {
  // Trip types
  CreateTripRequest,
  CreateTripResponse,
  GenerateTripDayRequest,
  GenerateTripDayResponse,
  EditTripDayRequest,
  EditTripDayResponse,
  GenerateTripPlanRequest,
  GenerateTripPlanResponse,
  EditTripPlanRequest,
  EditTripPlanResponse,
  // Social types
  PublishTripRequest,
  PublishTripResponse,
  VoteOnPlanRequest,
  VoteOnPlanResponse,
  // Payment types
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  // Live Session types
  CreateLiveSessionRequest,
  CreateLiveSessionResponse,
  UpdateLiveLocationRequest,
  UpdateLiveLocationResponse,
  MarkLiveStepAutoplayedRequest,
  MarkLiveStepAutoplayedResponse,
  EndLiveSessionRequest,
  EndLiveSessionResponse,
  GetLiveSessionRequest,
  GetLiveSessionResponse,
} from './functions';

