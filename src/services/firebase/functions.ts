import { httpsCallable, HttpsCallableResult } from 'firebase/functions';
import { functions } from './config';
import { withTrace, TRACE_NAMES } from '@/services/performanceService';

/**
 * Cloud Function names
 */
export const FUNCTION_NAMES = {
  // Trip
  CREATE_TRIP: 'createTrip',
  GENERATE_TRIP_DAY: 'generateTripDay',
  EDIT_TRIP_PLAN: 'editTripPlan',
  SEED_KRAKOW_TRIP: 'seedKrakowTrip',
  // Live Session
  CREATE_LIVE_SESSION: 'createLiveSession',
  UPDATE_LIVE_LOCATION: 'updateLiveLocation',
  MARK_LIVE_STEP_AUTOPLAYED: 'markLiveStepAutoplayed',
  END_LIVE_SESSION: 'endLiveSession',
  GET_LIVE_SESSION: 'getLiveSession',
  // Social
  PUBLISH_TRIP: 'publishTrip',
  VOTE_ON_PLAN: 'voteOnPlan',
  COPY_PLAN: 'copyPlan',
  // Payments
  CREATE_CHECKOUT_SESSION: 'createCheckoutSession',
  CREATE_PORTAL_SESSION: 'createPortalSession',
  HANDLE_STRIPE_WEBHOOK: 'handleStripeWebhook',
  // Deprecated (old name)
  GENERATE_TRIP_PLAN: 'generateEnrichedTripPlan',
} as const;

/**
 * Generic function caller with proper typing and performance tracing
 */
async function callFunction<TRequest, TResponse>(
  functionName: string,
  data: TRequest
): Promise<TResponse> {
  return withTrace(
    TRACE_NAMES.CLOUD_FUNCTION,
    async () => {
      const callable = httpsCallable<TRequest, TResponse>(functions, functionName);
      const result: HttpsCallableResult<TResponse> = await callable(data);
      return result.data;
    },
    { function_name: functionName }
  );
}

// ============================================
// Trip Creation Functions
// ============================================

export interface CreateTripRequest {
  destination: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  transport_mode?: 'samolot' | 'pociąg' | 'autobus' | 'własny';
  budget_level?: 'oszczędny' | 'średni' | 'luksusowy';
  people?: {
    adults: number;
    children: number;
  };
  interests?: string[];
  notes?: string;
}

export interface CreateTripResponse {
  trip_id: string;
}

/**
 * Create a new trip (basic data, no days yet)
 */
export async function createTrip(
  data: CreateTripRequest
): Promise<CreateTripResponse> {
  return callFunction<CreateTripRequest, CreateTripResponse>(
    FUNCTION_NAMES.CREATE_TRIP,
    data
  );
}

// ============================================
// Trip Day Generation Functions
// ============================================

export interface GenerateTripDayRequest {
  trip_id: string;
  day_index: number;
}

export interface GenerateTripDayResponse {
  day_id: string;
  ui_summary_text: string;
  plan_json: {
    day_index: number;
    city: string;
    date: string;
    theme: string;
    steps: Array<{
      step_id: string;
      type: string;
      place_id?: string;
      planned_start?: string;
      planned_end?: string;
    }>;
    rain_plan?: {
      enabled: boolean;
      description?: string;
      steps: Array<{
        step_id: string;
        type: string;
        place_id?: string;
      }>;
    };
  };
  places_count: number;
  offers_count: number;
}

/**
 * Generate a single trip day using AI
 */
export async function generateTripDay(
  data: GenerateTripDayRequest
): Promise<GenerateTripDayResponse> {
  return withTrace(
    TRACE_NAMES.GENERATE_TRIP_DAY,
    () => callFunction<GenerateTripDayRequest, GenerateTripDayResponse>(
      FUNCTION_NAMES.GENERATE_TRIP_DAY,
      data
    ),
    { trip_id: data.trip_id, day_index: data.day_index.toString() }
  );
}

// ============================================
// Trip Editing Functions (Legacy)
// ============================================

export interface GenerateTripPlanRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: 'budget' | 'moderate' | 'luxury';
  interests: string[];
  notes?: string;
}

export interface GenerateTripPlanResponse {
  tripId: string;
  success: boolean;
}

/**
 * Generate a new trip plan using AI (DEPRECATED - use createTrip + generateTripDay)
 */
export async function generateTripPlan(
  data: GenerateTripPlanRequest
): Promise<GenerateTripPlanResponse> {
  return callFunction<GenerateTripPlanRequest, GenerateTripPlanResponse>(
    FUNCTION_NAMES.GENERATE_TRIP_PLAN,
    data
  );
}

// ============================================
// Trip Day Editing Functions
// ============================================

export interface EditTripDayRequest {
  trip_id: string;
  day_index: number;
  user_message: string;
}

export interface EditTripDayResponse {
  day_id: string;
  ui_summary_text: string;
  plan_json: {
    day_index: number;
    city: string;
    date: string;
    theme: string;
    steps: Array<{
      step_id: string;
      type: string;
      place_id?: string;
      planned_start?: string;
      planned_end?: string;
    }>;
    rain_plan?: {
      enabled: boolean;
      description?: string;
      steps: Array<{
        step_id: string;
        type: string;
        place_id?: string;
      }>;
    };
  };
  places_count: number;
  offers_count: number;
  change_summary: string;
}

/**
 * Edit a trip day using AI
 */
export async function editTripDay(
  data: EditTripDayRequest
): Promise<EditTripDayResponse> {
  return withTrace(
    TRACE_NAMES.EDIT_TRIP_DAY,
    () => callFunction<EditTripDayRequest, EditTripDayResponse>(
      FUNCTION_NAMES.EDIT_TRIP_PLAN,
      data
    ),
    { trip_id: data.trip_id, day_index: data.day_index.toString() }
  );
}

// Legacy compatibility
export interface EditTripPlanRequest {
  tripId: string;
  message: string;
}

export interface EditTripPlanResponse {
  success: boolean;
  updatedPlan: unknown;
}

/**
 * @deprecated Use editTripDay instead
 */
export async function editTripPlan(
  data: EditTripPlanRequest
): Promise<EditTripPlanResponse> {
  return callFunction<EditTripPlanRequest, EditTripPlanResponse>(
    FUNCTION_NAMES.EDIT_TRIP_PLAN,
    data
  );
}

// ============================================
// Social Functions
// ============================================

export interface PublishTripRequest {
  tripId: string;
}

export interface PublishTripResponse {
  sharedPlanId: string;
  success: boolean;
}

/**
 * Publish a trip to the social feed
 */
export async function publishTrip(
  data: PublishTripRequest
): Promise<PublishTripResponse> {
  return callFunction<PublishTripRequest, PublishTripResponse>(
    FUNCTION_NAMES.PUBLISH_TRIP,
    data
  );
}

export interface VoteOnPlanRequest {
  sharedPlanId: string;
  voteType: 'up' | 'down' | 'remove';
}

export interface VoteOnPlanResponse {
  success: boolean;
  newVoteCount: number;
}

/**
 * Vote on a shared plan
 */
export async function voteOnPlan(
  data: VoteOnPlanRequest
): Promise<VoteOnPlanResponse> {
  return callFunction<VoteOnPlanRequest, VoteOnPlanResponse>(
    FUNCTION_NAMES.VOTE_ON_PLAN,
    data
  );
}

export interface CopyPlanRequest {
  shared_plan_id: string;
  new_start_date: string; // YYYY-MM-DD
}

export interface CopyPlanResponse {
  trip_id: string;
  success: boolean;
}

/**
 * Copy a shared plan to user's trips (Premium only)
 */
export async function copyPlan(
  data: CopyPlanRequest
): Promise<CopyPlanResponse> {
  return callFunction<CopyPlanRequest, CopyPlanResponse>(
    FUNCTION_NAMES.COPY_PLAN,
    data
  );
}

// ============================================
// Payment Functions
// ============================================

export interface CreateCheckoutSessionRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

/**
 * Create a Stripe checkout session
 */
export async function createCheckoutSession(
  data: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> {
  return callFunction<CreateCheckoutSessionRequest, CreateCheckoutSessionResponse>(
    FUNCTION_NAMES.CREATE_CHECKOUT_SESSION,
    data
  );
}

export interface CreatePortalSessionRequest {
  returnUrl: string;
}

export interface CreatePortalSessionResponse {
  url: string;
}

/**
 * Create a Stripe customer portal session
 */
export async function createPortalSession(
  data: CreatePortalSessionRequest
): Promise<CreatePortalSessionResponse> {
  return callFunction<CreatePortalSessionRequest, CreatePortalSessionResponse>(
    FUNCTION_NAMES.CREATE_PORTAL_SESSION,
    data
  );
}

// ============================================
// Live Session Functions (Voice Guide)
// ============================================

export interface CreateLiveSessionRequest {
  trip_id: string;
}

export interface CreateLiveSessionResponse {
  session_id: string;
}

/**
 * Create a new live session for voice guide
 */
export async function createLiveSession(
  data: CreateLiveSessionRequest
): Promise<CreateLiveSessionResponse> {
  return withTrace(
    TRACE_NAMES.CREATE_LIVE_SESSION,
    () => callFunction<CreateLiveSessionRequest, CreateLiveSessionResponse>(
      FUNCTION_NAMES.CREATE_LIVE_SESSION,
      data
    ),
    { trip_id: data.trip_id }
  );
}

export interface UpdateLiveLocationRequest {
  session_id: string;
  lat: number;
  lon: number;
}

export interface UpdateLiveLocationResponse {
  success: boolean;
}

/**
 * Update user location in live session
 */
export async function updateLiveLocation(
  data: UpdateLiveLocationRequest
): Promise<UpdateLiveLocationResponse> {
  return callFunction<UpdateLiveLocationRequest, UpdateLiveLocationResponse>(
    FUNCTION_NAMES.UPDATE_LIVE_LOCATION,
    data
  );
}

export interface MarkLiveStepAutoplayedRequest {
  session_id: string;
  step_id: string;
}

export interface MarkLiveStepAutoplayedResponse {
  success: boolean;
}

/**
 * Mark a step as autoplayed
 */
export async function markLiveStepAutoplayed(
  data: MarkLiveStepAutoplayedRequest
): Promise<MarkLiveStepAutoplayedResponse> {
  return callFunction<MarkLiveStepAutoplayedRequest, MarkLiveStepAutoplayedResponse>(
    FUNCTION_NAMES.MARK_LIVE_STEP_AUTOPLAYED,
    data
  );
}

export interface EndLiveSessionRequest {
  session_id: string;
}

export interface EndLiveSessionResponse {
  success: boolean;
}

/**
 * End a live session
 */
export async function endLiveSession(
  data: EndLiveSessionRequest
): Promise<EndLiveSessionResponse> {
  return callFunction<EndLiveSessionRequest, EndLiveSessionResponse>(
    FUNCTION_NAMES.END_LIVE_SESSION,
    data
  );
}

export interface GetLiveSessionRequest {
  trip_id: string;
}

export interface GetLiveSessionResponse {
  session: {
    id: string;
    trip_id: string;
    user_id: string;
    status: 'active' | 'ended';
    last_location?: {
      lat: number;
      lon: number;
      timestamp: string;
    };
    autoplayed_steps: string[];
    created_at: string;
    updated_at: string;
  } | null;
}

/**
 * Get active live session for a trip
 */
export async function getLiveSession(
  data: GetLiveSessionRequest
): Promise<GetLiveSessionResponse> {
  return callFunction<GetLiveSessionRequest, GetLiveSessionResponse>(
    FUNCTION_NAMES.GET_LIVE_SESSION,
    data
  );
}

// ============================================
// Development Functions
// ============================================

export interface SeedKrakowTripRequest {
  // No parameters needed
}

export interface SeedKrakowTripResponse {
  success: boolean;
  tripId: string;
}

/**
 * Seed Krakow demo trip (development only)
 */
export async function seedKrakowTrip(): Promise<SeedKrakowTripResponse> {
  return callFunction<SeedKrakowTripRequest, SeedKrakowTripResponse>(
    FUNCTION_NAMES.SEED_KRAKOW_TRIP,
    {}
  );
}

export { functions };

