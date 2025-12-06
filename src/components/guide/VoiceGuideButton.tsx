/**
 * VoiceGuideButton - Button to activate voice guide
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { GradientButton } from '@/components/ui';

interface VoiceGuideButtonProps {
  tripId: string;
  disabled?: boolean;
}

export function VoiceGuideButton({ tripId, disabled = false }: VoiceGuideButtonProps) {
  const router = useRouter();

  function handlePress() {
    router.push(`/trip/${tripId}/voice-guide`);
  }

  return (
    <GradientButton
      label="Uruchom przewodnika"
      icon={Mic}
      onPress={handlePress}
      disabled={disabled}
      fullWidth
    />
  );
}

const styles = StyleSheet.create({});

