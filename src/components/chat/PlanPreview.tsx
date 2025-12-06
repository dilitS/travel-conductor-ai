import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui';
import { colors, spacing, typography, layout } from '@/theme';

interface PlanPreviewProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PlanPreview({ title, description, onConfirm, onCancel }: PlanPreviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      <View style={styles.actions}>
        <Button
          label="Anuluj"
          variant="ghost"
          size="sm"
          onPress={onCancel}
          style={{ flex: 1 }}
        />
        <Button
          label="Zatwierdź"
          size="sm"
          onPress={onConfirm}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[2],
    backgroundColor: colors.background.primary,
    borderRadius: layout.radius.md,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  description: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
});

