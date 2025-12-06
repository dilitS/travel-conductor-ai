/**
 * Trip types for the travel conductor app
 * Based on docs/db-project.md
 */

// Transport mode options
export type TransportMode = 'samolot' | 'pociąg' | 'autobus' | 'własny';

// Budget level options
export type BudgetLevel = 'oszczędny' | 'średni' | 'luksusowy';

// Trip status
export type TripStatus = 'planning' | 'confirmed' | 'in_progress' | 'done';

/**
 * People traveling
 */
export interface TripPeople {
  adults: number;
  children: number;
}

/**
 * Main Trip document
 */
export interface Trip {
  id: string;
  user_id: string;
  destination: string;
  start_date: string; // "YYYY-MM-DD"
  end_date: string;   // "YYYY-MM-DD"
  transport_mode: TransportMode;
  budget_level: BudgetLevel;
  people: TripPeople;
  interests: string[];
  notes?: string;
  timezone: string;
  status: TripStatus;
  is_published: boolean;
  shared_plan_id?: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Trip for creating (without id and timestamps)
 */
export interface TripCreate {
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  transport_mode: TransportMode;
  budget_level: BudgetLevel;
  people: TripPeople;
  interests: string[];
  notes?: string;
  timezone: string;
}

/**
 * Trip for updating (partial)
 */
export interface TripUpdate {
  destination?: string;
  start_date?: string;
  end_date?: string;
  transport_mode?: TransportMode;
  budget_level?: BudgetLevel;
  people?: TripPeople;
  interests?: string[];
  notes?: string;
  timezone?: string;
  status?: TripStatus;
  is_published?: boolean;
  shared_plan_id?: string | null;
}

/**
 * Trip summary for list views
 */
export interface TripSummary {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: TripStatus;
  duration_days: number;
}

/**
 * Calculate trip duration in days
 */
export function getTripDurationDays(trip: Trip): number {
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Check if trip is active (in_progress)
 */
export function isTripActive(trip: Trip): boolean {
  return trip.status === 'in_progress';
}

/**
 * Check if trip is upcoming
 */
export function isTripUpcoming(trip: Trip): boolean {
  const today = new Date().toISOString().split('T')[0];
  return trip.start_date > today && trip.status !== 'done';
}
