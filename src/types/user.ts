/**
 * User types for authentication and profiles
 * Based on docs/db-project.md
 */

// Subscription status
export type SubscriptionStatus = 'free' | 'active' | 'canceled' | 'past_due';

/**
 * User subscription details
 */
export interface UserSubscription {
  status: SubscriptionStatus;
  stripe_customer_id?: string;
  plan_id?: string;
  current_period_end?: string; // ISO timestamp
}

/**
 * User profile document
 */
export interface UserProfile {
  uid: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  subscription: UserSubscription;
  published_plans_count: number;
  total_votes_received: number;
  has_accepted_terms?: boolean; // GDPR/RODO consent
  terms_accepted_at?: string; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at?: string; // ISO timestamp
}

/**
 * Auth state for Zustand store
 */
export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * SharedPlan document - published plan in community feed
 */
export interface SharedPlan {
  id: string;
  original_trip_id: string;
  author_id: string;
  author_display_name: string;
  author_photo_url?: string;
  description?: string;
  destination: string;
  duration_days: number;
  vote_count: number;
  published_at: string; // ISO timestamp
}

/**
 * SharedPlan for creating
 */
export interface SharedPlanCreate {
  original_trip_id: string;
  author_id: string;
  author_display_name: string;
  author_photo_url?: string;
  description?: string;
  destination: string;
  duration_days: number;
}

/**
 * Vote document in sharedPlans/{planId}/votes/{userId}
 */
export interface Vote {
  voted_at: string; // ISO timestamp
}

/**
 * Check if user has premium subscription
 */
export function isPremiumUser(user: UserProfile): boolean {
  return user.subscription.status === 'active';
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isSubscriptionExpiringSoon(user: UserProfile): boolean {
  if (!user.subscription.current_period_end) return false;
  
  const endDate = new Date(user.subscription.current_period_end);
  const now = new Date();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  
  return endDate.getTime() - now.getTime() < sevenDaysMs;
}
