import React from 'react';
import { Pressable, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, spacing, layout } from '@/theme';
import { hapticImpactMedium } from '@/utils/haptics';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: LucideIcon;
  style?: StyleProp<ViewStyle>;
  color?: string;
  iconColor?: string;
}

export function FloatingActionButton({ 
  onPress, 
  icon: Icon, 
  style, 
  color = colors.green.primary,
  iconColor = '#FFFFFF'
}: FloatingActionButtonProps) {
  return (
    <Pressable
      onPress={() => {
        hapticImpactMedium();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color, shadowColor: color },
        style,
        pressed && styles.buttonPressed,
      ]}
      android_ripple={{ color: colors.green.soft }}
    >
      <Icon size={24} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    position: 'absolute',
    bottom: spacing[8],
    right: layout.screenPadding,
    zIndex: 1000,
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});

