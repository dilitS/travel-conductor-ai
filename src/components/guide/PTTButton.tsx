/**
 * PTTButton - Push-to-Talk button for voice guide
 * User holds the button to record, releases to send to AI
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Mic, MicOff } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import {
  startRecording,
  stopRecording,
  requestMicrophonePermission,
  hasMicrophonePermission,
} from '@/services/recordingService';

interface PTTButtonProps {
  onRecordingComplete: (uri: string) => void;
  onRecordingStart?: () => void;
  onRecordingCancel?: () => void;
  disabled?: boolean;
}

export function PTTButton({
  onRecordingComplete,
  onRecordingStart,
  onRecordingCancel,
  disabled = false,
}: PTTButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // Check permission on mount
  useEffect(() => {
    async function checkPermission() {
      const granted = await hasMicrophonePermission();
      setHasPermission(granted);
    }
    checkPermission();
  }, []);

  // Pulsing animation when recording
  useEffect(() => {
    if (isRecording) {
      // Start pulsing animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repeat
        false
      );
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      // Stop animation
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = withTiming(1, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [isRecording]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(async () => {
    if (disabled) return;

    // Request permission if not granted
    if (!hasPermission) {
      const granted = await requestMicrophonePermission();
      setHasPermission(granted);
      if (!granted) {
        console.warn('Microphone permission denied');
        return;
      }
    }

    // Start recording
    const started = await startRecording();
    if (started) {
      setIsRecording(true);
      onRecordingStart?.();
    }
  }, [disabled, hasPermission, onRecordingStart]);

  const handlePressOut = useCallback(async () => {
    if (!isRecording) return;

    // Stop recording and get URI
    const uri = await stopRecording();
    setIsRecording(false);

    if (uri) {
      onRecordingComplete(uri);
    } else {
      onRecordingCancel?.();
    }
  }, [isRecording, onRecordingComplete, onRecordingCancel]);

  const buttonDisabled = disabled || hasPermission === false;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.buttonWrapper, animatedButtonStyle]}>
        <Pressable
          style={[
            styles.button,
            isRecording && styles.buttonRecording,
            buttonDisabled && styles.buttonDisabled,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={buttonDisabled}
        >
          {hasPermission === false ? (
            <MicOff size={36} color={colors.text.tertiary} />
          ) : (
            <Mic
              size={36}
              color={isRecording ? colors.background.primary : colors.green.primary}
            />
          )}
        </Pressable>
      </Animated.View>

      <Text style={[styles.label, isRecording && styles.labelRecording]}>
        {hasPermission === false
          ? 'Brak uprawnień do mikrofonu'
          : isRecording
          ? 'Nagrywam... Zwolnij aby wysłać'
          : 'Przytrzymaj aby mówić'}
      </Text>

      {isRecording && (
        <View style={styles.recordingIndicator}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>REC</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing[3],
  },
  buttonWrapper: {
    // Wrapper for animation
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.green.primary,
  },
  buttonRecording: {
    backgroundColor: colors.green.primary,
    borderColor: colors.green.dark,
  },
  buttonDisabled: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.border.default,
    opacity: 0.5,
  },
  label: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  labelRecording: {
    color: colors.green.primary,
    fontWeight: '600',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    backgroundColor: colors.semantic.error,
    borderRadius: layout.radius.sm,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.primary,
  },
  recordingText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: 'bold',
  },
});

