/**
 * VisitStep Component - Displays a visit step in the plan
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MapPin, Clock } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { VisitStep as VisitStepType } from '@/types/step';
import { Place } from '@/types/place';

interface VisitStepProps {
  step: VisitStepType;
  place?: Place;
  onPress?: () => void;
}

export function VisitStep({ step, place, onPress }: VisitStepProps) {
  const timeDisplay = step.planned_start 
    ? `${step.planned_start}${step.planned_end ? ` - ${step.planned_end}` : ''}`
    : null;

  const categoryDisplay = place?.categories?.[0] || null;

  return (
    <Pressable 
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Thumbnail */}
      {place?.thumbnail_url && (
        <Image
          source={{ uri: place.thumbnail_url }}
          style={styles.image}
          contentFit="cover"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
          transition={200}
        />
      )}
      
      <View style={styles.content}>
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {place?.name || step.place_id}
            </Text>
            {place?.city && (
              <View style={styles.locationRow}>
                <MapPin size={12} color={colors.text.tertiary} />
                <Text style={styles.location}>{place.city}</Text>
              </View>
            )}
          </View>
          
          {/* Category Chip */}
          {categoryDisplay && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>{categoryDisplay}</Text>
            </View>
          )}
        </View>

        {/* Time & Duration */}
        {timeDisplay && (
          <View style={styles.timeRow}>
            <Clock size={14} color={colors.text.secondary} />
            <Text style={styles.timeText}>{timeDisplay}</Text>
            {place?.typical_visit_duration_min && (
              <Text style={styles.durationText}>
                ~{place.typical_visit_duration_min} min
              </Text>
            )}
          </View>
        )}

        {/* Notes */}
        {step.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {step.notes}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: spacing[3],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing[2],
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
    gap: 4,
  },
  location: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  chip: {
    backgroundColor: colors.green.primary + '20',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: layout.radius.sm,
  },
  chipText: {
    ...typography.styles.caption,
    color: colors.green.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
    gap: spacing[1],
  },
  timeText: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
  },
  durationText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginLeft: spacing[2],
  },
  notes: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing[2],
    fontStyle: 'italic',
  },
});

