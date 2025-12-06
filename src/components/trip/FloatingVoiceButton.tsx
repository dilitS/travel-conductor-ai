/**
 * FloatingVoiceButton Component
 * Prominent floating action button for the AI Voice Guide
 * Designed to be the "Conductor's Baton" of the UI
 */

import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  withSequence,
  withSpring
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, AudioWaveform } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';

interface FloatingVoiceButtonProps {
  onPress: () => void;
  isActive?: boolean;
}

export function FloatingVoiceButton({ onPress, isActive = false }: FloatingVoiceButtonProps) {
  const pulse = useSharedValue(1);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    // Pulse animation to attract attention
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1, // Infinite
      true // Reverse
    );
  }, []);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pressScale.value }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: isActive ? pulse.value : 1 }],
      opacity: isActive ? 0.8 : 0,
    };
  });

  const handlePressIn = () => {
    pressScale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
  };

  return (
    <View style={styles.wrapper}>
      {/* Pulse effect background */}
      <Animated.View style={[styles.pulseRing, pulseStyle]} />
      
      <Animated.View style={[styles.container, animatedContainerStyle]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.pressable}
        >
          <LinearGradient
            colors={['#10B981', '#059669']} // Bright Emerald Gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.content}>
                {isActive ? (
                <AudioWaveform size={28} color="#FFFFFF" />
                ) : (
                <Mic size={28} color="#FFFFFF" />
                )}
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: spacing[6],
    right: spacing[6],
    zIndex: 1000,
  },
  container: {
    shadowColor: colors.green.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  pressable: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    backgroundColor: colors.green.primary,
    zIndex: -1,
  },
});

