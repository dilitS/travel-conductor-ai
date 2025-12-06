/**
 * Location Service - GPS tracking for voice guide
 * Uses expo-location for location tracking
 */

import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { GeoLocation } from '@/types/liveSession';

/**
 * Tracking configuration
 */
const TRACKING_CONFIG = {
  accuracy: Location.Accuracy.High,
  distanceInterval: 10, // meters
  timeInterval: 5000, // 5 seconds
};

/**
 * Throttle interval for updates (prevent too frequent updates)
 */
const UPDATE_THROTTLE_MS = 5000;

/**
 * Location subscription reference
 */
let locationSubscription: Location.LocationSubscription | null = null;
let lastUpdateTime = 0;

/**
 * Request location permissions
 * @returns True if permissions granted
 */
export async function requestLocationPermissions(): Promise<boolean> {
  try {
    // Request foreground permissions
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      console.warn('Foreground location permission denied');
      return false;
    }

    // On iOS, we might want background permissions later
    // For MVP, foreground is enough
    if (Platform.OS === 'ios') {
      // Background permissions can be requested later if needed
      // const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    }

    return true;
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
}

/**
 * Check if location permissions are granted
 */
export async function hasLocationPermissions(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permissions:', error);
    return false;
  }
}

/**
 * Get current position once
 */
export async function getCurrentPosition(): Promise<GeoLocation | null> {
  try {
    const hasPermission = await hasLocationPermissions();
    if (!hasPermission) {
      const granted = await requestLocationPermissions();
      if (!granted) return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      timestamp: new Date(location.timestamp).toISOString(),
    };
  } catch (error) {
    console.error('Error getting current position:', error);
    return null;
  }
}

/**
 * Start location tracking
 * @param onUpdate Callback for location updates
 */
export async function startLocationTracking(
  onUpdate: (location: GeoLocation) => void
): Promise<boolean> {
  try {
    // Check/request permissions
    const hasPermission = await hasLocationPermissions();
    if (!hasPermission) {
      const granted = await requestLocationPermissions();
      if (!granted) {
        console.warn('Location permissions not granted');
        return false;
      }
    }

    // Stop existing subscription if any
    if (locationSubscription) {
      locationSubscription.remove();
    }

    // Start watching position
    locationSubscription = await Location.watchPositionAsync(
      TRACKING_CONFIG,
      (location: Location.LocationObject) => {
        // Throttle updates
        const now = Date.now();
        if (now - lastUpdateTime < UPDATE_THROTTLE_MS) {
          return;
        }
        lastUpdateTime = now;

        const geoLocation: GeoLocation = {
          lat: location.coords.latitude,
          lon: location.coords.longitude,
          timestamp: new Date(location.timestamp).toISOString(),
        };

        onUpdate(geoLocation);
      }
    );

    console.log('Location tracking started');
    return true;
  } catch (error) {
    console.error('Error starting location tracking:', error);
    return false;
  }
}

/**
 * Stop location tracking
 */
export function stopLocationTracking(): void {
  if (locationSubscription) {
    locationSubscription.remove();
    locationSubscription = null;
    console.log('Location tracking stopped');
  }
}

/**
 * Check if tracking is active
 */
export function isTrackingActive(): boolean {
  return locationSubscription !== null;
}

/**
 * Check if location services are enabled
 */
export async function isLocationServicesEnabled(): Promise<boolean> {
  try {
    return await Location.hasServicesEnabledAsync();
  } catch (error) {
    console.error('Error checking location services:', error);
    return false;
  }
}

/**
 * Calculate distance between two points (Haversine formula)
 * @returns Distance in meters
 */
export function calculateDistance(
  point1: { lat: number; lon: number },
  point2: { lat: number; lon: number }
): number {
  const R = 6371000; // Earth radius in meters
  const lat1 = (point1.lat * Math.PI) / 180;
  const lat2 = (point2.lat * Math.PI) / 180;
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLon = ((point2.lon - point1.lon) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

