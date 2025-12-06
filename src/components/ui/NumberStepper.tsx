/**
 * NumberStepper - Stepper component for numeric values with +/- buttons
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus, LucideIcon } from 'lucide-react-native';
import { colors, spacing, typography, layout, shadows } from '@/theme';

interface NumberStepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  icon?: LucideIcon;
  subtitle?: string;
}

export function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
  icon: Icon,
  subtitle,
}: NumberStepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  function handleDecrement() {
    if (canDecrement) {
      onChange(value - 1);
    }
  }

  function handleIncrement() {
    if (canIncrement) {
      onChange(value + 1);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {Icon && (
          <View style={styles.iconContainer}>
            <Icon size={24} color={colors.green.primary} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.stepperContainer}>
        <TouchableOpacity
          style={[styles.button, !canDecrement && styles.buttonDisabled]}
          onPress={handleDecrement}
          disabled={!canDecrement}
          activeOpacity={0.7}
        >
          <Minus size={20} color={canDecrement ? colors.text.primary : colors.text.tertiary} />
        </TouchableOpacity>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !canIncrement && styles.buttonDisabled]}
          onPress={handleIncrement}
          disabled={!canIncrement}
          activeOpacity={0.7}
        >
          <Plus size={20} color={canIncrement ? colors.text.primary : colors.text.tertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.lg,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  valueContainer: {
    minWidth: 40,
    alignItems: 'center',
  },
  value: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
});

