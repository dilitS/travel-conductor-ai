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
import { colors, spacing, typography, layout } from '@/theme';
import { LucideIcon } from 'lucide-react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  textStyle?: TextStyle;
}

export function Button({
  variant = 'primary',
  size = 'md',
  label,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  // Get variant styles
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.green.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: colors.background.tertiary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border.default,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'destructive':
        return {
          backgroundColor: colors.semantic.error,
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  // Get text color based on variant
  const getTextColor = (): string => {
    if (isDisabled) return colors.text.tertiary;
    if (textStyle?.color) return textStyle.color as string;
    
    switch (variant) {
      case 'primary':
      case 'destructive':
        return '#FFFFFF';
      case 'secondary':
        return colors.text.primary;
      case 'outline':
      case 'ghost':
        return colors.text.secondary;
      default:
        return colors.text.primary;
    }
  };

  // Get size styles
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          height: 32,
          paddingHorizontal: spacing[3],
        };
      case 'md':
        return {
          height: 48,
          paddingHorizontal: spacing[6],
        };
      case 'lg':
        return {
          height: 56,
          paddingHorizontal: spacing[8],
        };
      default:
        return {};
    }
  };

  const getTextSize = (): TextStyle => {
    switch (size) {
      case 'sm':
        return typography.styles.label;
      case 'md':
        return typography.styles.button;
      case 'lg':
        return { ...typography.styles.button, fontSize: 18 };
      default:
        return typography.styles.button;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        getVariantStyle(),
        getSizeStyle(),
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon
              size={size === 'sm' ? 16 : 20}
              color={getTextColor()}
              style={{ marginRight: spacing[2] }}
            />
          )}
          <Text
            style={[
              getTextSize(),
              { color: getTextColor(), textAlign: 'center' },
              textStyle,
            ]}
          >
            {label}
          </Text>
          {Icon && iconPosition === 'right' && (
            <Icon
              size={size === 'sm' ? 16 : 20}
              color={getTextColor()}
              style={{ marginLeft: spacing[2] }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.radius.md,
  },
  disabled: {
    opacity: 0.5,
  },
});
