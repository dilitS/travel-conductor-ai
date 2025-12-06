import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme';

interface CustomMarkerProps {
  number: number;
  selected?: boolean;
}

export function CustomMarker({ number, selected = false }: CustomMarkerProps) {
  return (
    <View style={[styles.container, selected && styles.selectedContainer]}>
      <Text style={styles.text}>{number}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.green.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedContainer: {
    transform: [{ scale: 1.2 }],
    backgroundColor: colors.green.dark, // Or different shade
  },
  text: {
    ...typography.styles.bodySmall,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

