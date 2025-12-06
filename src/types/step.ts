/**
 * Step types for trip day plan
 * Based on docs/db-project.md
 */

// Step type literals
export type StepType = 'visit' | 'transfer' | 'meal' | 'accommodation' | 'relax';

// Move mode for transfer steps
export type MoveMode = 'walk' | 'public_transport' | 'taxi' | 'car';

// Step status
export type StepStatus = 'planned' | 'in_progress' | 'completed' | 'skipped';

/**
 * Base Step interface
 */
export interface BaseStep {
  step_id: string;
  type: StepType;
  planned_start?: string; // "HH:mm" format
  planned_end?: string;   // "HH:mm" format
  notes?: string | null;
  status: StepStatus;
  cost?: string; // Optional cost info (e.g. "$500/day", "40 zł")
}

/**
 * Visit step - visiting a place
 */
export interface VisitStep extends BaseStep {
  type: 'visit';
  place_id: string;
}

/**
 * Transfer step - moving between places
 */
export interface TransferStep extends BaseStep {
  type: 'transfer';
  from_place_id: string;
  to_place_id: string;
  move_mode: MoveMode;
  est_duration_min: number;
  route_hint?: string;
}

/**
 * Meal step - eating at a restaurant/cafe
 */
export interface MealStep extends BaseStep {
  type: 'meal';
  place_id?: string;
}

/**
 * Accommodation step - hotel/hostel stay
 */
export interface AccommodationStep extends BaseStep {
  type: 'accommodation';
  place_id?: string;
}

/**
 * Relax step - rest/free time
 */
export interface RelaxStep extends BaseStep {
  type: 'relax';
  place_id?: string;
}

/**
 * Union type for all step types
 */
export type Step = VisitStep | TransferStep | MealStep | AccommodationStep | RelaxStep;

/**
 * Type guard for VisitStep
 */
export function isVisitStep(step: Step): step is VisitStep {
  return step.type === 'visit';
}

/**
 * Type guard for TransferStep
 */
export function isTransferStep(step: Step): step is TransferStep {
  return step.type === 'transfer';
}

/**
 * Type guard for MealStep
 */
export function isMealStep(step: Step): step is MealStep {
  return step.type === 'meal';
}

