import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Avatar } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

interface AuthorBadgeProps {
  name: string;
  avatarUrl?: string;
  subtitle?: string;
  variant?: 'default' | 'overlay';
  style?: ViewStyle;
}

export function AuthorBadge({ name, avatarUrl, subtitle, variant = 'default', style }: AuthorBadgeProps) {
  const isOverlay = variant === 'overlay';

  return (
    <View style={[
      styles.container, 
      isOverlay && styles.containerOverlay,
      style
    ]}>
      <Avatar url={avatarUrl} name={name} size={isOverlay ? 36 : 40} />
      <View style={styles.info}>
        <Text style={[styles.name, isOverlay && styles.textOverlay]}>{name}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, isOverlay && styles.subtextOverlay]}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    backgroundColor: colors.background.secondary,
  },
  containerOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  info: {
    marginLeft: spacing[3],
  },
  name: {
    ...typography.styles.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  textOverlay: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  subtextOverlay: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});
