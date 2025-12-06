import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, isInitialized, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    // Check if we are in the auth group
    const inAuthGroup = segments[0] === '(auth)';
    
    if (user && inAuthGroup) {
      // User is signed in but on auth screen -> redirect to drawer
      router.replace('/(drawer)'); 
    } else if (!user && !inAuthGroup) {
      // User is not signed in but not on auth screen -> redirect to login
      router.replace('/(auth)/login');
    } else {
      // Correct state, hide splash screen
      SplashScreen.hideAsync();
    }
  }, [user, isInitialized, segments]);

  if (!isInitialized) {
    return <View style={styles.loadingContainer} />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="creator" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="trip/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="shared/[planId]" options={{ headerShown: false }} />
        <Stack.Screen name="subscription/plans" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </GestureHandlerRootView>
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
