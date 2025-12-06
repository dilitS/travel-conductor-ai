import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, layout } from '@/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
}

export function Chip({ label, selected = false, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.tertiary,
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderRadius: layout.radius.full,
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  selectedContainer: {
    backgroundColor: colors.green.soft,
    borderColor: colors.green.primary,
  },
  text: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  selectedText: {
    color: colors.green.primary,
  },
});

