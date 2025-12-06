/**
 * LiveSession types for voice guide
 * Based on docs/db-project.md
 */

// Session status
export type SessionStatus = 'active' | 'ended';

/**
 * Geographic location with timestamp
 */
export interface GeoLocation {
  lat: number;
  lon: number;
  timestamp: string; // ISO timestamp
}

/**
 * LiveSession document - voice guide session
 */
export interface LiveSession {
  id: string;
  trip_id: string;
  user_id: string;
  last_location: GeoLocation | null;
  autoplayed_steps: string[]; // step_ids that have been auto-played
  status: SessionStatus;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * LiveSession for creating
 */
export interface LiveSessionCreate {
  trip_id: string;
  user_id: string;
}

/**
 * Current step response from get_current_step tool
 */
export interface CurrentStepResponse {
  day_index: number;
  step: {
    step_id: string;
    type: 'visit' | 'transfer';
    place_id?: string;
    planned_start?: string;
    planned_end?: string;
    distance_m_to_step?: number;
    trigger_audio_now?: boolean;
    autoplay_already_triggered?: boolean;
  };
  next_steps: Array<{
    step_id: string;
    type: string;
    place_id?: string;
  }>;
}

/**
 * Check if step should trigger audio
 */
export function shouldTriggerAudio(
  session: LiveSession,
  stepId: string,
  distanceMeters: number,
  triggerRadiusMeters: number
): boolean {
  const isWithinRadius = distanceMeters <= triggerRadiusMeters;
  const notAlreadyPlayed = !session.autoplayed_steps.includes(stepId);
  
  return isWithinRadius && notAlreadyPlayed;
}

/**
 * Check if session is active
 */
export function isSessionActive(session: LiveSession): boolean {
  return session.status === 'active';
}

