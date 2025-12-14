/**
 * TripMapBackground - Web fallback component
 * Shows a placeholder instead of map on web
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import { Step } from '@/types/step';
import { Place } from '@/types/place';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface TripMapBackgroundProps {
  region: Region;
  steps: Step[];
  places: Map<string, Place>;
}

export function TripMapBackground({ region, steps, places }: TripMapBackgroundProps) {
  return (
    <View style={styles.container}>
      <MapPin size={48} color={colors.text.tertiary} />
      <Text style={styles.text}>Mapa dostępna w aplikacji mobilnej</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  text: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
});

