/**
 * RainPlanToggle Component - Toggle between normal and rain plan
 */

import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { CloudRain, Sun } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';

interface RainPlanToggleProps {
  /** Whether rain plan exists */
  isEnabled: boolean;
  /** Whether rain plan is currently active */
  isActive: boolean;
  /** Toggle callback */
  onToggle: () => void;
  /** Optional description */
  description?: string;
}

export function RainPlanToggle({ 
  isEnabled, 
  isActive, 
  onToggle,
  description,
}: RainPlanToggleProps) {
  if (!isEnabled) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {isActive ? (
            <CloudRain size={20} color={colors.text.primary} />
          ) : (
            <Sun size={20} color={colors.green.primary} />
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.label}>
            {isActive ? 'Plan na deszcz' : 'Normalny plan'}
          </Text>
          {description && (
            <Text style={styles.description} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
      </View>

      <Switch
        value={isActive}
        onValueChange={onToggle}
        trackColor={{
          false: colors.background.tertiary,
          true: colors.green.primary + '60',
        }}
        thumbColor={isActive ? colors.green.primary : colors.text.tertiary}
        ios_backgroundColor={colors.background.tertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.md,
    padding: spacing[3],
    marginHorizontal: layout.screenPadding,
    marginVertical: spacing[2],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  textContainer: {
    flex: 1,
    marginRight: spacing[2],
  },
  label: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  description: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
});

