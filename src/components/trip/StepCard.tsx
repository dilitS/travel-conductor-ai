/**
 * StepCard Component - Wrapper for different step types
 * Renders VisitStep, TransferStep, or generic step based on type
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Utensils, Bed, Coffee, MapPin } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { Step, isVisitStep, isTransferStep, isMealStep } from '@/types/step';
import { Place } from '@/types/place';
import { VisitStep } from './VisitStep';
import { TransferStep } from './TransferStep';

interface StepCardProps {
  step: Step;
  place?: Place;
  fromPlace?: Place;
  toPlace?: Place;
  isLast?: boolean;
  onPress?: () => void;
}

export function StepCard({ 
  step, 
  place,
  fromPlace,
  toPlace,
  isLast = false,
  onPress,
}: StepCardProps) {
  return (
    <View style={styles.container}>
      {/* Time Column */}
      <View style={styles.timeContainer}>
        {step.planned_start && (
          <Text style={styles.time}>{step.planned_start}</Text>
        )}
      </View>

      {/* Timeline Column */}
      <View style={styles.timelineContainer}>
        <View style={[
          styles.dot,
          step.type === 'transfer' && styles.dotTransfer,
        ]}>
          {renderStepIcon(step)}
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Content Column */}
      <View style={styles.contentContainer}>
        {renderStepContent(step, place, fromPlace, toPlace, onPress)}
      </View>
    </View>
  );
}

/**
 * Render icon based on step type
 */
function renderStepIcon(step: Step) {
  const iconProps = { size: 14, color: colors.background.primary };
  
  switch (step.type) {
    case 'visit':
      return <MapPin {...iconProps} />;
    case 'transfer':
      return null; // Transfer has icon in its component
    case 'meal':
      return <Utensils {...iconProps} />;
    case 'accommodation':
      return <Bed {...iconProps} />;
    case 'relax':
      return <Coffee {...iconProps} />;
    default:
      return <MapPin {...iconProps} />;
  }
}

/**
 * Render content based on step type
 */
function renderStepContent(
  step: Step,
  place?: Place,
  fromPlace?: Place,
  toPlace?: Place,
  onPress?: () => void,
) {
  if (isVisitStep(step)) {
    return <VisitStep step={step} place={place} onPress={onPress} />;
  }

  if (isTransferStep(step)) {
    return <TransferStep step={step} fromPlace={fromPlace} toPlace={toPlace} />;
  }

  if (isMealStep(step)) {
    return (
      <View style={styles.genericCard}>
        <View style={styles.genericHeader}>
          <Utensils size={16} color={colors.green.primary} />
          <Text style={styles.genericTitle}>Posiłek</Text>
        </View>
        {step.notes && (
          <Text style={styles.genericNotes}>{step.notes}</Text>
        )}
      </View>
    );
  }

  if (step.type === 'accommodation') {
    return (
      <View style={styles.genericCard}>
        <View style={styles.genericHeader}>
          <Bed size={16} color={colors.green.primary} />
          <Text style={styles.genericTitle}>Nocleg</Text>
        </View>
        {place && (
          <Text style={styles.genericSubtitle}>{place.name}</Text>
        )}
        {step.notes && (
          <Text style={styles.genericNotes}>{step.notes}</Text>
        )}
      </View>
    );
  }

  if (step.type === 'relax') {
    return (
      <View style={styles.genericCard}>
        <View style={styles.genericHeader}>
          <Coffee size={16} color={colors.green.primary} />
          <Text style={styles.genericTitle}>Odpoczynek</Text>
        </View>
        {step.notes && (
          <Text style={styles.genericNotes}>{step.notes}</Text>
        )}
      </View>
    );
  }

  // Fallback - should not reach here but TypeScript needs it
  return (
    <View style={styles.genericCard}>
      <Text style={styles.genericTitle}>{(step as Step).type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPadding,
  },
  timeContainer: {
    width: 50,
    alignItems: 'flex-end',
    paddingTop: spacing[1],
    paddingRight: spacing[2],
  },
  time: {
    ...typography.styles.body,
    fontWeight: '600',
    color: colors.text.primary,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 24,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.green.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dotTransfer: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.green.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.background.tertiary,
    marginVertical: spacing[1],
  },
  contentContainer: {
    flex: 1,
    paddingLeft: spacing[3],
    paddingBottom: spacing[4],
  },
  // Generic card styles
  genericCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.md,
    padding: spacing[3],
  },
  genericHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  genericTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  genericSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  genericNotes: {
    ...typography.styles.bodySmall,
    color: colors.text.tertiary,
    marginTop: spacing[2],
    fontStyle: 'italic',
  },
});

