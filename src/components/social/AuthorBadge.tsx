import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

interface AuthorBadgeProps {
  name: string;
  avatarUrl?: string;
  subtitle?: string;
}

export function AuthorBadge({ name, avatarUrl, subtitle }: AuthorBadgeProps) {
  return (
    <View style={styles.container}>
      <Avatar url={avatarUrl} name={name} size={40} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
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
    // borderRadius is handled by container if needed, usually this is part of a header
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
});

