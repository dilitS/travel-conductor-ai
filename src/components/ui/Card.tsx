import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, layout, shadows, spacing } from '@/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: keyof typeof spacing;
}

export function Card({
  variant = 'default',
  padding = 4,
  style,
  children,
  ...props
}: CardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.background.secondary,
          ...shadows.card,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border.default,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.background.secondary,
        };
    }
  };

  return (
    <View
      style={[
        styles.container,
        getVariantStyle(),
        { padding: spacing[padding] },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: layout.radius.lg,
    overflow: 'hidden', // Ensures content respects border radius
  },
});

