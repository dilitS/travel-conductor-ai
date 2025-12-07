import { useAuthStore } from '@/stores/authStore';
import { useTripStore } from '@/stores/tripStore';

export interface PremiumStatus {
  isPremium: boolean;
  canCreateTrip: boolean;
  canUseVoiceGuide: boolean;
  canUseAiEdit: boolean;
  canCopyPlan: boolean;
  tripLimit: number;
  currentTrips: number;
  reason?: 'limit_reached' | 'premium_only';
}

export function usePremium(): PremiumStatus {
  const { user } = useAuthStore();
  const { trips } = useTripStore();

  const isPremium = user?.subscription?.status === 'active' || user?.subscription?.status === 'trialing';
  
  // Free tier limits
  const FREE_TRIP_LIMIT = 1;

  const currentTrips = trips.length;
  const canCreateTrip = isPremium || (currentTrips < FREE_TRIP_LIMIT);
  
  // Premium-only features
  const canUseVoiceGuide = isPremium;
  const canUseAiEdit = isPremium;
  const canCopyPlan = isPremium;

  return {
    isPremium,
    canCreateTrip,
    canUseVoiceGuide,
    canUseAiEdit,
    canCopyPlan,
    tripLimit: isPremium ? Infinity : FREE_TRIP_LIMIT,
    currentTrips,
    reason: !canCreateTrip ? 'limit_reached' : (!isPremium ? 'premium_only' : undefined),
  };
}

