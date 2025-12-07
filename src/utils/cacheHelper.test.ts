/**
 * Unit tests for cacheHelper.ts
 * Tests cache TTL validation and creation functions
 */

import {
  CachedData,
  CACHE_TTL,
  isCacheValid,
  createCache,
  getRemainingTTL,
} from './cacheHelper';

describe('CACHE_TTL constants', () => {
  it('should have TRIPS TTL of 5 minutes', () => {
    expect(CACHE_TTL.TRIPS).toBe(5 * 60 * 1000);
  });

  it('should have PLACES TTL of 5 minutes', () => {
    expect(CACHE_TTL.PLACES).toBe(5 * 60 * 1000);
  });

  it('should have OFFERS TTL of 10 minutes', () => {
    expect(CACHE_TTL.OFFERS).toBe(10 * 60 * 1000);
  });
});

describe('isCacheValid', () => {
  it('should return false for null cache', () => {
    expect(isCacheValid(null)).toBe(false);
  });

  it('should return true for fresh cache', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now(),
      ttl: 300000, // 5 minutes
    };
    expect(isCacheValid(cache)).toBe(true);
  });

  it('should return false for expired cache', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now() - 400000, // 6+ minutes ago
      ttl: 300000, // 5 minutes TTL
    };
    expect(isCacheValid(cache)).toBe(false);
  });

  it('should return true for cache just before expiration', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now() - 299000, // 4:59 minutes ago
      ttl: 300000, // 5 minutes TTL
    };
    expect(isCacheValid(cache)).toBe(true);
  });

  it('should return false for cache just after expiration', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now() - 301000, // 5:01 minutes ago
      ttl: 300000, // 5 minutes TTL
    };
    expect(isCacheValid(cache)).toBe(false);
  });

  it('should handle zero TTL (always expired)', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now(),
      ttl: 0,
    };
    expect(isCacheValid(cache)).toBe(false);
  });

  it('should handle very long TTL', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now() - 86400000, // 1 day ago
      ttl: 604800000, // 7 days TTL
    };
    expect(isCacheValid(cache)).toBe(true);
  });
});

describe('createCache', () => {
  it('should create cache with correct data', () => {
    const data = { id: 1, name: 'test' };
    const cache = createCache(data, 300000);
    
    expect(cache.data).toEqual(data);
  });

  it('should create cache with correct TTL', () => {
    const cache = createCache('test', 600000);
    
    expect(cache.ttl).toBe(600000);
  });

  it('should create cache with current timestamp', () => {
    const before = Date.now();
    const cache = createCache('test', 300000);
    const after = Date.now();
    
    expect(cache.timestamp).toBeGreaterThanOrEqual(before);
    expect(cache.timestamp).toBeLessThanOrEqual(after);
  });

  it('should create cache with array data', () => {
    const data = [1, 2, 3];
    const cache = createCache(data, 300000);
    
    expect(cache.data).toEqual([1, 2, 3]);
  });

  it('should create cache with null data', () => {
    const cache = createCache(null, 300000);
    
    expect(cache.data).toBeNull();
  });

  it('should work with CACHE_TTL constants', () => {
    const cache = createCache('test', CACHE_TTL.TRIPS);
    
    expect(cache.ttl).toBe(CACHE_TTL.TRIPS);
  });
});

describe('getRemainingTTL', () => {
  it('should return 0 for null cache', () => {
    expect(getRemainingTTL(null)).toBe(0);
  });

  it('should return full TTL for fresh cache', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now(),
      ttl: 300000,
    };
    
    const remaining = getRemainingTTL(cache);
    expect(remaining).toBeGreaterThan(299000);
    expect(remaining).toBeLessThanOrEqual(300000);
  });

  it('should return 0 for expired cache', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now() - 400000,
      ttl: 300000,
    };
    
    expect(getRemainingTTL(cache)).toBe(0);
  });

  it('should return correct remaining time for partially expired cache', () => {
    const cache: CachedData<string> = {
      data: 'test',
      timestamp: Date.now() - 150000, // 2.5 minutes ago
      ttl: 300000, // 5 minutes TTL
    };
    
    const remaining = getRemainingTTL(cache);
    expect(remaining).toBeGreaterThan(140000);
    expect(remaining).toBeLessThan(160000);
  });
});

describe('Cache integration', () => {
  it('should create valid cache that passes validation', () => {
    const cache = createCache({ value: 42 }, CACHE_TTL.TRIPS);
    
    expect(isCacheValid(cache)).toBe(true);
  });

  it('should have positive remaining TTL for fresh cache', () => {
    const cache = createCache('test', CACHE_TTL.PLACES);
    
    expect(getRemainingTTL(cache)).toBeGreaterThan(0);
  });
});

