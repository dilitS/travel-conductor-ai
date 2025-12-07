/**
 * Cache Helper - In-memory cache with TTL for Zustand stores
 * Session-based cache (not persistent like backend Firestore cache)
 */

/**
 * Cached data interface with timestamp and TTL
 */
export interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Cache TTL constants (in milliseconds)
 */
export const CACHE_TTL = {
  TRIPS: 5 * 60 * 1000,      // 5 minutes for trips
  PLACES: 5 * 60 * 1000,     // 5 minutes for places
  OFFERS: 10 * 60 * 1000,    // 10 minutes for offers
} as const;

/**
 * Check if cached data is still valid based on TTL
 * @param cached - Cached data with timestamp
 * @returns true if cache is valid, false if expired or null
 */
export function isCacheValid<T>(cached: CachedData<T> | null): boolean {
  if (!cached) {
    return false;
  }

  const now = Date.now();
  const age = now - cached.timestamp;

  return age < cached.ttl;
}

/**
 * Create a new cache entry with current timestamp
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds
 * @returns Cached data with timestamp and TTL
 */
export function createCache<T>(data: T, ttl: number): CachedData<T> {
  return {
    data,
    timestamp: Date.now(),
    ttl,
  };
}

/**
 * Get remaining TTL for cached data in milliseconds
 * @param cached - Cached data with timestamp
 * @returns Remaining TTL in ms, or 0 if expired/null
 */
export function getRemainingTTL<T>(cached: CachedData<T> | null): number {
  if (!cached) {
    return 0;
  }

  const now = Date.now();
  const age = now - cached.timestamp;
  const remaining = cached.ttl - age;

  return remaining > 0 ? remaining : 0;
}

