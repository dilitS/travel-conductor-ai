/**
 * Error Tracking Service
 * 
 * Prepared for Sentry integration. To enable:
 * 1. Create Sentry account at sentry.io
 * 2. Create React Native project
 * 3. Add EXPO_PUBLIC_SENTRY_DSN to .env
 * 4. Install: npx expo install @sentry/react-native
 * 5. Run: npx @sentry/wizard -i reactNative
 * 6. Uncomment Sentry imports and calls below
 */

// TODO: Uncomment when Sentry is configured
// import * as Sentry from '@sentry/react-native';

/**
 * Sentry DSN from environment variables
 */
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

/**
 * Check if Sentry is configured
 */
export function isSentryConfigured(): boolean {
  return !!SENTRY_DSN && SENTRY_DSN.length > 0;
}

/**
 * Initialize error tracking
 * Call this in _layout.tsx on app start
 */
export function initErrorTracking(): void {
  if (!isSentryConfigured()) {
    console.log('[ErrorTracking] Sentry not configured, skipping initialization');
    return;
  }

  // TODO: Uncomment when Sentry is installed
  // Sentry.init({
  //   dsn: SENTRY_DSN,
  //   environment: __DEV__ ? 'development' : 'production',
  //   tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  //   debug: __DEV__,
  //   enableAutoSessionTracking: true,
  //   sessionTrackingIntervalMillis: 30000,
  // });

  console.log('[ErrorTracking] Sentry initialized');
}

/**
 * Set user context for error tracking
 * Call this after user login
 */
export function setUserContext(user: { uid: string; email?: string | null; displayName?: string | null }): void {
  if (!isSentryConfigured()) return;

  // TODO: Uncomment when Sentry is installed
  // Sentry.setUser({
  //   id: user.uid,
  //   email: user.email || undefined,
  //   username: user.displayName || undefined,
  // });

  console.log('[ErrorTracking] User context set:', user.uid);
}

/**
 * Clear user context on logout
 */
export function clearUserContext(): void {
  if (!isSentryConfigured()) return;

  // TODO: Uncomment when Sentry is installed
  // Sentry.setUser(null);

  console.log('[ErrorTracking] User context cleared');
}

/**
 * Capture exception with additional context
 */
export function captureException(
  error: Error,
  context?: Record<string, unknown>
): void {
  // Always log to console
  console.error('[ErrorTracking] Exception:', error.message, context);

  if (!isSentryConfigured()) return;

  // TODO: Uncomment when Sentry is installed
  // Sentry.captureException(error, {
  //   extra: context,
  // });
}

/**
 * Capture message (non-error event)
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info'
): void {
  console.log(`[ErrorTracking] ${level.toUpperCase()}: ${message}`);

  if (!isSentryConfigured()) return;

  // TODO: Uncomment when Sentry is installed
  // Sentry.captureMessage(message, level);
}

/**
 * Breadcrumb categories
 */
export type BreadcrumbCategory = 
  | 'navigation'
  | 'trip'
  | 'auth'
  | 'voice_guide'
  | 'payment'
  | 'ui';

/**
 * Add breadcrumb for debugging user flow
 */
export function addBreadcrumb(
  category: BreadcrumbCategory,
  message: string,
  data?: Record<string, unknown>,
  level: 'info' | 'warning' | 'error' = 'info'
): void {
  if (__DEV__) {
    console.log(`[Breadcrumb] ${category}: ${message}`, data);
  }

  if (!isSentryConfigured()) return;

  // TODO: Uncomment when Sentry is installed
  // Sentry.addBreadcrumb({
  //   category,
  //   message,
  //   level,
  //   data,
  //   timestamp: Date.now() / 1000,
  // });
}

/**
 * Set tag for filtering errors
 */
export function setTag(key: string, value: string): void {
  if (!isSentryConfigured()) return;

  // TODO: Uncomment when Sentry is installed
  // Sentry.setTag(key, value);
}

/**
 * Start performance transaction
 */
export function startTransaction(name: string, op: string): { finish: () => void } {
  if (!isSentryConfigured()) {
    return { finish: () => {} };
  }

  // TODO: Uncomment when Sentry is installed
  // const transaction = Sentry.startTransaction({ name, op });
  // return {
  //   finish: () => transaction.finish(),
  // };

  return { finish: () => {} };
}

// ============================================
// Pre-built breadcrumb helpers
// ============================================

export const breadcrumbs = {
  // Navigation
  screenView: (screenName: string) => 
    addBreadcrumb('navigation', `Viewed ${screenName}`),
  
  // Trip actions
  tripCreated: (tripId: string, destination: string) =>
    addBreadcrumb('trip', 'Trip created', { tripId, destination }),
  
  tripDayGenerated: (tripId: string, dayIndex: number) =>
    addBreadcrumb('trip', 'Day generated', { tripId, dayIndex }),
  
  tripEdited: (tripId: string, dayIndex: number) =>
    addBreadcrumb('trip', 'Day edited', { tripId, dayIndex }),
  
  // Auth actions
  userLoggedIn: (userId: string) =>
    addBreadcrumb('auth', 'User logged in', { userId }),
  
  userLoggedOut: () =>
    addBreadcrumb('auth', 'User logged out'),
  
  // Voice guide
  voiceGuideStarted: (tripId: string) =>
    addBreadcrumb('voice_guide', 'Voice guide started', { tripId }),
  
  voiceGuideEnded: (tripId: string) =>
    addBreadcrumb('voice_guide', 'Voice guide ended', { tripId }),
  
  locationUpdated: (lat: number, lon: number) =>
    addBreadcrumb('voice_guide', 'Location updated', { lat, lon }),
  
  // Payment
  checkoutStarted: (priceId: string) =>
    addBreadcrumb('payment', 'Checkout started', { priceId }),
  
  subscriptionUpdated: (status: string) =>
    addBreadcrumb('payment', 'Subscription updated', { status }),
  
  // UI interactions
  buttonPressed: (buttonName: string) =>
    addBreadcrumb('ui', `Button pressed: ${buttonName}`),
};

