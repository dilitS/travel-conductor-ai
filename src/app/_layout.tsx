import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore, useNeedsOnboarding } from '@/stores/onboardingStore';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ToastContainer } from '@/components/ui/Toast';
import { ConsentModal } from '@/components/ui/ConsentModal';
import { initErrorTracking } from '@/services/errorTracking';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Initialize error tracking (Sentry when configured)
initErrorTracking();

export default function RootLayout() {
  const { user, isInitialized, initialize, showConsentModal, acceptTerms } = useAuthStore();
  const { isHydrated, setHydrated } = useOnboardingStore();
  const needsOnboarding = useNeedsOnboarding();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  // Fallback: if hydration takes too long (e.g., on web), force it after 1s
  useEffect(() => {
    if (!isHydrated) {
      const timeout = setTimeout(() => {
        console.log('[RootLayout] Forcing hydration after timeout');
        setHydrated(true);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [isHydrated, setHydrated]);

  useEffect(() => {
    if (!isInitialized || !isHydrated) return;

    // Hide splash screen once initialized
    SplashScreen.hideAsync();

    // Check which group we're in
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    
    if (user && inAuthGroup) {
      // User is signed in but on auth screen
      if (needsOnboarding) {
        // New user needs onboarding
        router.replace('/(onboarding)/welcome');
      } else {
        // Existing user goes to main hub
        router.replace('/(main)');
      }
    } else if (user && needsOnboarding && !inOnboardingGroup) {
      // User is signed in, needs onboarding, but not in onboarding flow
      router.replace('/(onboarding)/welcome');
    } else if (!user && !inAuthGroup) {
      // User is not signed in but not on auth screen -> redirect to login
      router.replace('/(auth)/login');
    }
  }, [user, isInitialized, isHydrated, needsOnboarding, segments]);

  if (!isInitialized) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar style="light" />
        <ToastContainer />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: colors.background.primary },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(main)" options={{ headerShown: false }} />
          <Stack.Screen name="creator" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="trip/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="shared/[planId]" options={{ headerShown: false }} />
          <Stack.Screen name="subscription/plans" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="legal/privacy" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="legal/terms" options={{ presentation: 'modal', headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <ConsentModal visible={showConsentModal} onAccept={acceptTerms} />
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
});
