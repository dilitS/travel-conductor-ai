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
              <View style={styles.iconBox}>
                {isActive ? (
                  <AudioWaveform size={24} color="#FFFFFF" />
                ) : (
                  <Mic size={24} color="#FFFFFF" />
                )}
              </View>
              
              <View style={styles.textBox}>
                <Text style={styles.label}>
                  {isActive ? 'Przewodnik aktywny' : 'AI Przewodnik'}
                </Text>
                <Text style={styles.subLabel}>
                  {isActive ? 'Dotknij, by pauzować' : 'Rozpocznij zwiedzanie'}
                </Text>
              </View>
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
    alignSelf: 'center',
    zIndex: 1000,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    shadowColor: colors.green.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderRadius: 32,
  },
  pressable: {
    borderRadius: 32,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 32,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[3],
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textBox: {
    flex: 1,
  },
  label: {
    ...typography.styles.body,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 20,
  },
  subLabel: {
    ...typography.styles.caption,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    backgroundColor: colors.green.primary,
    zIndex: -1,
  },
});

