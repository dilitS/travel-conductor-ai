/**
 * Performance Service - Measure and track operation performance
 * 
 * This service provides a simple way to measure operation durations
 * and can be extended to integrate with Firebase Performance or other
 * monitoring services in the future.
 * 
 * Note: @react-native-firebase/perf requires native modules and
 * Expo Dev Client. This implementation works in standard Expo.
 */

/**
 * Trace result with timing and status information
 */
export interface TraceResult<T> {
  result: T;
  duration: number; // in milliseconds
  success: boolean;
  traceName: string;
  attributes: Record<string, string>;
  startTime: number;
  endTime: number;
}

/**
 * Trace attributes for Cloud Functions
 */
export interface TraceAttributes {
  trip_id?: string;
  day_index?: string;
  session_id?: string;
  function_name?: string;
  [key: string]: string | undefined;
}

/**
 * Performance trace names
 */
export const TRACE_NAMES = {
  GENERATE_TRIP_DAY: 'generate_trip_day',
  EDIT_TRIP_DAY: 'ai_edit_request',
  VOICE_GUIDE_SESSION: 'voice_guide_session',
  CREATE_LIVE_SESSION: 'create_live_session',
  FETCH_TRIPS: 'fetch_trips',
  FETCH_PLACES: 'fetch_places',
  CLOUD_FUNCTION: 'cloud_function_call',
} as const;

/**
 * Storage for completed traces (for debugging/analytics)
 */
const traceHistory: TraceResult<unknown>[] = [];
const MAX_TRACE_HISTORY = 100;

/**
 * Execute an async operation with performance tracing
 * 
 * @param traceName - Name of the trace (use TRACE_NAMES constants)
 * @param fn - Async function to execute
 * @param attributes - Optional attributes to attach to the trace
 * @returns The result of the function
 * 
 * @example
 * const result = await withTrace(
 *   TRACE_NAMES.GENERATE_TRIP_DAY,
 *   () => callFunction('generateTripDay', { trip_id: 'abc' }),
 *   { trip_id: 'abc', day_index: '1' }
 * );
 */
export async function withTrace<T>(
  traceName: string,
  fn: () => Promise<T>,
  attributes: TraceAttributes = {}
): Promise<T> {
  const startTime = Date.now();
  let success = true;
  let result: T;

  // Clean undefined attributes
  const cleanAttributes: Record<string, string> = {};
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined) {
      cleanAttributes[key] = value;
    }
  });

  try {
    result = await fn();
    return result;
  } catch (error) {
    success = false;
    // Add error type to attributes
    cleanAttributes.error_type = error instanceof Error ? error.name : 'Unknown';
    cleanAttributes.error_message = error instanceof Error ? error.message.slice(0, 100) : 'Unknown error';
    throw error;
  } finally {
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Log trace in development
    if (__DEV__) {
      console.log(
        `[Performance] ${traceName}: ${duration}ms`,
        success ? '✅' : '❌',
        cleanAttributes
      );
    }

    // Store trace result
    const traceResult: TraceResult<unknown> = {
      result: success ? result! : null,
      duration,
      success,
      traceName,
      attributes: cleanAttributes,
      startTime,
      endTime,
    };

    // Add to history (circular buffer)
    traceHistory.push(traceResult);
    if (traceHistory.length > MAX_TRACE_HISTORY) {
      traceHistory.shift();
    }

    // TODO: When Firebase Performance is available, send trace
    // await sendToFirebasePerformance(traceResult);
  }
}

/**
 * Get recent trace history (for debugging)
 */
export function getTraceHistory(): TraceResult<unknown>[] {
  return [...traceHistory];
}

/**
 * Clear trace history
 */
export function clearTraceHistory(): void {
  traceHistory.length = 0;
}

/**
 * Get average duration for a trace name
 */
export function getAverageDuration(traceName: string): number | null {
  const traces = traceHistory.filter(t => t.traceName === traceName);
  if (traces.length === 0) return null;
  
  const total = traces.reduce((sum, t) => sum + t.duration, 0);
  return total / traces.length;
}

/**
 * Get success rate for a trace name (0-1)
 */
export function getSuccessRate(traceName: string): number | null {
  const traces = traceHistory.filter(t => t.traceName === traceName);
  if (traces.length === 0) return null;
  
  const successful = traces.filter(t => t.success).length;
  return successful / traces.length;
}

/**
 * Get performance summary for all traces
 */
export function getPerformanceSummary(): Record<string, {
  count: number;
  avgDuration: number;
  successRate: number;
  minDuration: number;
  maxDuration: number;
}> {
  const summary: Record<string, {
    count: number;
    avgDuration: number;
    successRate: number;
    minDuration: number;
    maxDuration: number;
  }> = {};

  // Group by trace name
  const grouped = new Map<string, TraceResult<unknown>[]>();
  traceHistory.forEach(trace => {
    const existing = grouped.get(trace.traceName) || [];
    grouped.set(trace.traceName, [...existing, trace]);
  });

  // Calculate stats for each group
  grouped.forEach((traces, name) => {
    const durations = traces.map(t => t.duration);
    const successful = traces.filter(t => t.success).length;

    summary[name] = {
      count: traces.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      successRate: successful / traces.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
    };
  });

  return summary;
}

/**
 * Log performance summary to console (for debugging)
 */
export function logPerformanceSummary(): void {
  const summary = getPerformanceSummary();
  
  console.log('\n📊 Performance Summary:');
  console.log('========================');
  
  Object.entries(summary).forEach(([name, stats]) => {
    console.log(`\n${name}:`);
    console.log(`  Count: ${stats.count}`);
    console.log(`  Avg Duration: ${stats.avgDuration.toFixed(2)}ms`);
    console.log(`  Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);
    console.log(`  Min/Max: ${stats.minDuration}ms / ${stats.maxDuration}ms`);
  });
  
  console.log('\n========================\n');
}

