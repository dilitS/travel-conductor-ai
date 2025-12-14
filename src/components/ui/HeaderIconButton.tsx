/**
 * HeaderIconButton Component
 * Reusable semi-transparent icon button for headers
 */

import React, { ReactNode } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '@/theme';

interface HeaderIconButtonProps {
  onPress?: () => void;
  children: ReactNode;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

export function HeaderIconButton({ onPress, children, accessibilityLabel, style }: HeaderIconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

