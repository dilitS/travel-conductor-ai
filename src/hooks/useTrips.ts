import { useEffect } from 'react';
import { useTripStore } from '@/stores/tripStore';
import { useAuth } from '@/hooks/useAuth';

export function useTrips() {
  const { user } = useAuth();
  const store = useTripStore();

  useEffect(() => {
    if (user?.uid) {
      store.fetchTrips(user.uid);
    }
  }, [user?.uid]);

  return {
    trips: store.trips,
    isLoading: store.isLoading,
    error: store.error,
    refresh: () => user?.uid && store.fetchTrips(user.uid),
  };
}

