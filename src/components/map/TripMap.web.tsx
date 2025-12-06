import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';
import { Step } from '@/types';
import { Place } from '@/types/place';

interface TripMapProps {
  steps: Step[];
  places: Map<string, Place>;
}

export function TripMap({ steps, places }: TripMapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map View (Google Maps)</Text>
      <Text style={styles.subtext}>
        {steps.length} locations to display.
        Native maps are not fully supported in this web preview.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  text: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtext: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
});

