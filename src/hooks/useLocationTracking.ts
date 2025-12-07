import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { updateLiveLocation } from '../services/firebase/functions';

const LOCATION_UPDATE_INTERVAL_MS = 5000; // 5 seconds throttling
const LOCATION_DISTANCE_FILTER_M = 10; // Only update if moved 10 meters (for OS location service)

interface LocationTrackingState {
  isTracking: boolean;
  errorMsg: string | null;
  lastLocation: Location.LocationObject | null;
  permissionStatus: Location.PermissionStatus | 'undetermined';
}

export function useLocationTracking(sessionId: string | null) {
  const [state, setState] = useState<LocationTrackingState>({
    isTracking: false,
    errorMsg: null,
    lastLocation: null,
    permissionStatus: Location.PermissionStatus.UNDETERMINED,
  });

  // Ref to track last update time for manual throttling if needed
  const lastUpdateRef = useRef<number>(0);
  // Ref to store subscription to clean up
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;

    // Check permissions on mount
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (mounted) {
          setState(prev => ({ ...prev, permissionStatus: status }));
        }
      } catch (error) {
        console.error('Error checking location permissions:', error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Start/stop tracking based on sessionId
  useEffect(() => {
    if (!sessionId) {
      stopTracking();
      return;
    }

    startTracking();

    return () => {
      stopTracking();
    };
  }, [sessionId]);

  const startTracking = async () => {
    try {
      // 1. Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      setState(prev => ({ ...prev, permissionStatus: status }));

      if (status !== Location.PermissionStatus.GRANTED) {
        setState(prev => ({ ...prev, errorMsg: 'Brak uprawnień do lokalizacji', isTracking: false }));
        return;
      }

      // 2. Start watching position
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: LOCATION_DISTANCE_FILTER_M, // OS level filtering
          timeInterval: LOCATION_UPDATE_INTERVAL_MS, // OS level throttling hint
        },
        async (location) => {
          setState(prev => ({ ...prev, lastLocation: location, isTracking: true, errorMsg: null }));

          // Manual throttling check
          const now = Date.now();
          if (now - lastUpdateRef.current >= LOCATION_UPDATE_INTERVAL_MS && sessionId) {
            lastUpdateRef.current = now;
            
            try {
              await updateLiveLocation({
                session_id: sessionId,
                lat: location.coords.latitude,
                lon: location.coords.longitude,
              });
            } catch (error) {
              console.error('Failed to update live location:', error);
              // Don't update state error to avoid UI flicker, just log
            }
          }
        }
      );

      locationSubscriptionRef.current = subscription;
      setState(prev => ({ ...prev, isTracking: true }));

    } catch (error) {
      console.error('Error starting location tracking:', error);
      setState(prev => ({ 
        ...prev, 
        errorMsg: 'Błąd uruchamiania śledzenia lokalizacji', 
        isTracking: false 
      }));
    }
  };

  const stopTracking = () => {
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
    }
    setState(prev => ({ ...prev, isTracking: false }));
  };

  return state;
}

