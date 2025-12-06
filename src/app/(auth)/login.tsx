import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MapPin, Mail } from 'lucide-react-native';
import { GradientButton } from '@/components/ui';
import { colors, gradients, spacing, typography, layout } from '@/theme';

import { useAuthStore } from '@/stores/authStore';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.05, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleLogin = async () => {
    // MOCK LOGIN for UI testing
    useAuthStore.setState({ 
      user: { 
        uid: 'test-user', 
        email: 'test@example.com', 
        display_name: 'Test User', 
        photo_url: null,
        subscription: { status: 'free' },
        published_plans_count: 0,
        total_votes_received: 0,
        created_at: new Date().toISOString(),
      } 
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.background.colors}
        start={gradients.background.start}
        end={gradients.background.end}
        style={styles.background}
      />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logoCircle, logoStyle]}>
            <LinearGradient
              colors={gradients.primary.colors}
              start={gradients.primary.start}
              end={gradients.primary.end}
              style={styles.logoGradient}
            >
              <MapPin size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.title}>TravelAI Guide</Text>
          <Text style={styles.subtitle}>Twój inteligentny przewodnik podróży</Text>
        </View>

        <View style={styles.footer}>
          <GradientButton
            label="Zaloguj się przez Google"
            icon={Mail} // Using Mail as placeholder for Google icon if not available
            onPress={handleLogin}
            fullWidth
            style={styles.button}
          />

          <Text style={styles.legalText}>
            Kontynuując, akceptujesz{' '}
            <Text style={styles.link}>Regulamin</Text> i{' '}
            <Text style={styles.link}>Politykę Prywatności</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: layout.screenPadding,
    paddingTop: 120,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing[6],
    shadowColor: colors.green.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    ...typography.styles.h1,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: spacing[4],
  },
  button: {
    marginBottom: spacing[2],
  },
  legalText: {
    ...typography.styles.caption,
    textAlign: 'center',
    color: colors.text.tertiary,
    paddingHorizontal: spacing[4],
  },
  link: {
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});

