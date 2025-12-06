/**
 * TransferStep Component - Displays a transfer step between places
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  Footprints, 
  Train, 
  Car, 
  CarTaxiFront,
  ArrowRight,
  Clock,
} from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { TransferStep as TransferStepType, MoveMode } from '@/types/step';
import { Place } from '@/types/place';

interface TransferStepProps {
  step: TransferStepType;
  fromPlace?: Place;
  toPlace?: Place;
}

/**
 * Get icon for move mode
 */
function getMoveIcon(mode: MoveMode) {
  switch (mode) {
    case 'walk':
      return Footprints;
    case 'public_transport':
      return Train;
    case 'taxi':
      return CarTaxiFront;
    case 'car':
      return Car;
    default:
      return Footprints;
  }
}

/**
 * Get label for move mode
 */
function getMoveLabel(mode: MoveMode): string {
  switch (mode) {
    case 'walk':
      return 'Spacer';
    case 'public_transport':
      return 'Transport publiczny';
    case 'taxi':
      return 'Taxi';
    case 'car':
      return 'Samochód';
    default:
      return mode;
  }
}

export function TransferStep({ step, fromPlace, toPlace }: TransferStepProps) {
  const MoveIcon = getMoveIcon(step.move_mode);
  const modeLabel = getMoveLabel(step.move_mode);

  const fromName = fromPlace?.name || step.from_place_id;
  const toName = toPlace?.name || step.to_place_id;

  return (
    <View style={styles.container}>
      {/* Mode Icon */}
      <View style={styles.iconContainer}>
        <MoveIcon size={20} color={colors.text.secondary} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Route */}
        <View style={styles.routeRow}>
          <Text style={styles.placeName} numberOfLines={1}>
            {fromName}
          </Text>
          <ArrowRight size={14} color={colors.text.tertiary} />
          <Text style={styles.placeName} numberOfLines={1}>
            {toName}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.detailsRow}>
          <Text style={styles.modeLabel}>{modeLabel}</Text>
          <View style={styles.separator} />
          <Clock size={12} color={colors.text.tertiary} />
          <Text style={styles.duration}>{step.est_duration_min} min</Text>
        </View>

        {/* Route Hint */}
        {step.route_hint && (
          <Text style={styles.routeHint} numberOfLines={2}>
            {step.route_hint}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.tertiary,
    borderRadius: layout.radius.sm,
    padding: spacing[3],
    borderLeftWidth: 3,
    borderLeftColor: colors.green.primary + '60',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  content: {
    flex: 1,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    flexWrap: 'wrap',
  },
  placeName: {
    ...typography.styles.bodySmall,
    color: colors.text.primary,
    fontWeight: '500',
    maxWidth: 120,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
    gap: spacing[1],
  },
  modeLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.tertiary,
    marginHorizontal: spacing[1],
  },
  duration: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginLeft: 2,
  },
  routeHint: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: spacing[2],
    fontStyle: 'italic',
  },
});

