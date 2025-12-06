/**
 * TripDay types for day planning
 * Based on docs/db-project.md
 */

import { Step } from './step';

/**
 * Rain plan - alternative plan for bad weather
 */
export interface RainPlan {
  enabled: boolean;
  description?: string;
  steps: Step[];
}

/**
 * Plan JSON structure stored in tripDays
 */
export interface PlanJson {
  day_index: number;
  city: string;
  date: string; // "YYYY-MM-DD"
  theme: string;
  steps: Step[];
  rain_plan?: RainPlan;
}

/**
 * TripDay document - one day of a trip
 */
export interface TripDay {
  id: string;
  trip_id: string;
  day_index: number;
  date: string; // "YYYY-MM-DD"
  city: string;
  theme: string;
  ui_summary_text: string;
  plan_json: PlanJson;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * TripDay for creating (without id and timestamps)
 */
export interface TripDayCreate {
  trip_id: string;
  day_index: number;
  date: string;
  city: string;
  theme: string;
  ui_summary_text: string;
  plan_json: PlanJson;
}

/**
 * Summary of a day for list views
 */
export interface TripDaySummary {
  day_index: number;
  date: string;
  city: string;
  theme: string;
  has_rain_plan: boolean;
}

