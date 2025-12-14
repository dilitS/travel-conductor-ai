import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ArrowRight, Mic } from 'lucide-react-native';
import { Trip, TripStatus } from '@/types/trip';
import { colors, layout, spacing, typography, shadows } from '@/theme';
import { Button } from '@/components/ui';

interface NearestTripCardProps {
  trip: Trip;
  onContinue: () => void;
  onVoiceGuide: () => void;
}

// Default placeholder image for trips
const DEFAULT_TRIP_IMAGE = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400&auto=format&fit=crop';

export function NearestTripCard({ trip, onContinue, onVoiceGuide }: NearestTripCardProps) {
  const startDate = parseISO(trip.start_date);
  const endDate = parseISO(trip.end_date);
  const dateRange = `${format(startDate, 'd MMM', { locale: pl })} - ${format(endDate, 'd MMM yyyy', { locale: pl })}`;

  const getStatusBadge = (status: TripStatus) => {
    let bgColor: string = colors.status.upcoming;
    let label = 'Nadchodząca';

    switch (status) {
      case 'in_progress':
        bgColor = colors.status.inProgress;
        label = 'W toku';
        break;
      case 'done':
        bgColor = colors.status.completed;
        label = 'Zakończona';
        break;
      case 'planning':
        bgColor = colors.text.tertiary;
        label = 'Planowanie';
        break;
      case 'confirmed':
        bgColor = colors.status.upcoming;
        label = 'Potwierdzona';
        break;
    }

    return (
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    );
  };

  return (
    <Pressable
      onPress={onContinue}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: trip.thumbnail_url || DEFAULT_TRIP_IMAGE }}
          style={styles.thumbnail}
          contentFit="cover"
          transition={200}
        />
        
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.destination} numberOfLines={1}>
              {trip.destination}
            </Text>
            {getStatusBadge(trip.status)}
          </View>
          
          <Text style={styles.dates}>{dateRange}</Text>
          
          <View style={styles.actions}>
            <Button
              label="Kontynuuj"
              variant="outline"
              size="sm"
              icon={ArrowRight}
              onPress={onContinue}
              style={styles.actionButton}
            />
            <Button
              label="Voice Guide"
              variant="outline"
              size="sm"
              icon={Mic}
              onPress={onVoiceGuide}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
    marginBottom: spacing[4],
    ...shadows.card,
  },
  content: {
    flexDirection: 'row',
    padding: spacing[3],
  },
  thumbnail: {
    width: 120,
    height: 100,
    borderRadius: layout.radius.md,
  },
  info: {
    flex: 1,
    marginLeft: spacing[3],
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[1],
  },
  destination: {
    ...typography.styles.h4,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing[2],
  },
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[0.5],
    borderRadius: layout.radius.full,
  },
  badgeText: {
    ...typography.styles.caption,
    fontWeight: '600',
    color: '#FFFFFF',
    fontSize: 10,
  },
  dates: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  actionButton: {
    flex: 1,
    borderColor: colors.green.primary,
  },
});




