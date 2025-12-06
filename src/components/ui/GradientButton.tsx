import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing, typography, layout } from '@/theme';
import { LucideIcon } from 'lucide-react-native';

interface GradientButtonProps extends TouchableOpacityProps {
  label: string;
  loading?: boolean;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export function GradientButton({
  label,
  loading = false,
  icon: Icon,
  fullWidth = false,
  style,
  disabled,
  ...props
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.touchable,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={gradients.primary.colors}
        start={gradients.primary.start}
        end={gradients.primary.end}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            {Icon && (
              <Icon
                size={20}
                color="#FFFFFF"
                style={{ marginRight: spacing[2] }}
              />
            )}
            <Text style={styles.text}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    borderRadius: layout.radius.full, // Gradient buttons usually rounded
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[8],
    height: 56,
  },
  text: {
    ...typography.styles.button,
    color: '#FFFFFF',
    fontSize: 18,
  },
  disabled: {
    opacity: 0.7,
  },
});

