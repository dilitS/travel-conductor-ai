import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, layout, spacing, typography, shadows } from '@/theme';
import { CheckCircle2 } from 'lucide-react-native';

interface BudgetCardProps {
  title: string;
  description: string;
  priceLevel: string;
  selected: boolean;
  onPress: () => void;
}

export function BudgetCard({ title, description, priceLevel, selected, onPress }: BudgetCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={[styles.priceLevel, selected && styles.selectedText]}>{priceLevel}</Text>
        {selected && <CheckCircle2 size={24} color={colors.green.primary} />}
      </View>
      
      <Text style={[styles.title, selected && styles.selectedText]}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  selectedContainer: {
    borderColor: colors.green.primary,
    backgroundColor: colors.green.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  priceLevel: {
    ...typography.styles.h3,
    color: colors.text.secondary,
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  description: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
  },
  selectedText: {
    color: colors.text.primary, // Keep white for better contrast or green?
    // Usually white on dark theme is best. Green border indicates selection.
  },
});

