/**
 * Place types for trip locations
 * Based on docs/db-project.md
 */

/**
 * Place notes with guide information
 */
export interface PlaceNotes {
  short_intro: string;
  history?: string;
  fun_facts: string[];
  what_to_look_at: string[];
  practical_tips: string[];
  guide_note_audio: string; // Text to be read by TTS/Gemini Live
}

/**
 * Place document - location with guide notes
 */
export interface Place {
  id: string; // Format: {tripId}_{placeId}
  trip_id: string;
  place_id: string; // Unique within trip (e.g., ROM_COLOSSEUM)
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  categories: string[];
  typical_visit_duration_min: number;
  trigger_radius_meters: number; // AI estimates: small ~20-30m, normal ~40-60m, large ~80-120m
  thumbnail_url?: string;
  photo_refs?: string[]; // Google Places photo references
  notes_json: PlaceNotes;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Place for creating (without id and timestamps)
 */
export interface PlaceCreate {
  trip_id: string;
  place_id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  categories: string[];
  typical_visit_duration_min: number;
  trigger_radius_meters: number;
  thumbnail_url?: string;
  photo_refs?: string[];
  notes_json: PlaceNotes;
}

/**
 * Coordinates type
 */
export interface Coordinates {
  lat: number;
  lon: number;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in meters
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lon - coord1.lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if within trigger radius
 */
export function isWithinTriggerRadius(
  userLocation: Coordinates,
  place: Place
): boolean {
  const distance = calculateDistance(userLocation, { lat: place.lat, lon: place.lon });
  return distance <= place.trigger_radius_meters;
}

