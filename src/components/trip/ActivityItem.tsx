import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Utensils, Car, Bed, Footprints, Coffee } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { Step, StepType, isVisitStep, isMealStep, isTransferStep } from '@/types';
import { Place } from '@/types/place';

interface ActivityItemProps {
  step: Step;
  place?: Place;
  isLast?: boolean;
}

const getIcon = (type: StepType) => {
  switch (type) {
    case 'meal': return Utensils;
    case 'transfer': return Footprints;
    case 'accommodation': return Bed;
    case 'relax': return Coffee;
    case 'visit': 
    default: return MapPin;
  }
};

export function ActivityItem({ step, place, isLast = false }: ActivityItemProps) {
  const Icon = getIcon(step.type);

  // Get display name based on step type
  const getDisplayName = () => {
    if (isVisitStep(step) && place) return place.name;
    if (isMealStep(step)) return place?.name || 'Posiłek';
    if (isTransferStep(step)) return `${step.from_place_id} → ${step.to_place_id}`;
    return step.notes || 'Aktywność';
  };

  // Get duration in minutes
  const getDuration = () => {
    if (isVisitStep(step) && place) return place.typical_visit_duration_min;
    if (isTransferStep(step)) return step.est_duration_min;
    return null;
  };

  return (
    <View style={styles.container}>
      {/* Time Column */}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{step.planned_start}</Text>
        {getDuration() && (
          <Text style={styles.duration}>{getDuration()} min</Text>
        )}
      </View>

      {/* Timeline Column */}
      <View style={styles.timelineContainer}>
        <View style={styles.dotContainer}>
          <Icon size={16} color={colors.background.primary} />
        </View>
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Content Column */}
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          {place?.thumbnail_url && (
            <Image
              source={{ uri: place.thumbnail_url }}
              style={styles.image}
              contentFit="cover"
            />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.title}>{getDisplayName()}</Text>
            {step.notes && (
              <Text style={styles.description} numberOfLines={2}>
                {step.notes}
              </Text>
            )}
            {place && place.categories.length > 0 && (
              <Text style={styles.category}>{place.categories[0]}</Text>
            )}
          </View>
        </View>
      </View>
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
  duration: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  timelineContainer: {
    alignItems: 'center',
    width: 24,
  },
  dotContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.green.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
    paddingBottom: spacing[6],
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  textContainer: {
    padding: spacing[3],
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  description: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  category: {
    ...typography.styles.caption,
    color: colors.green.primary,
    fontWeight: '600',
    marginTop: spacing[1],
  },
  price: {
    ...typography.styles.caption,
    color: colors.green.primary,
    fontWeight: '600',
  },
});

