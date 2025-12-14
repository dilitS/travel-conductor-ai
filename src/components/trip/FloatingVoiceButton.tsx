/**
 * FloatingVoiceButton Component
 * Prominent floating action button for the AI Voice Guide
 * Designed to be the "Conductor's Baton" of the UI - Extended FAB style
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, AudioWaveform } from 'lucide-react-native';
import { colors, spacing, layout, typography } from '@/theme';
import { hapticImpactMedium } from '@/utils/haptics';

interface FloatingVoiceButtonProps {
  onPress: () => void;
  isActive?: boolean;
}

export function FloatingVoiceButton({ onPress, isActive = false }: FloatingVoiceButtonProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulse]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2], // Reduced scale for pill shape
  });

  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0],
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.pulseRing,
          {
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(34,197,94,0.3)', 'rgba(34,197,94,0.05)']}
          style={styles.pulseGradient}
        />
      </Animated.View>

      <Pressable
        onPress={() => {
          hapticImpactMedium();
          onPress();
        }}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isActive && styles.buttonActive,
        ]}
        android_ripple={{ color: colors.green.soft }}
      >
        {isActive ? (
          <AudioWaveform size={24} color="#FFFFFF" />
        ) : (
          <Mic size={24} color="#FFFFFF" />
        )}
        <Text style={styles.label}>
          {isActive ? 'Przewodnik aktywny' : 'Przewodnik AI'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: spacing[8],
    right: layout.screenPadding,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.green.primary,
    shadowColor: colors.green.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    gap: spacing[2],
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.95,
  },
  buttonActive: {
    backgroundColor: colors.green.dark,
  },
  label: {
    ...typography.styles.body,
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28,
    zIndex: -1,
    padding: -10, // Negative padding trick doesn't work well, better to match size and scale
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transform: [{ scale: 1.2 }], // Initial larger scale
  },
  pulseGradient: {
    flex: 1,
    borderRadius: 28,
  },
});
