import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Trip, TripStatus } from '@/types/trip';
import { colors, layout, spacing, typography, shadows } from '@/theme';

interface TripCardProps {
  trip: Trip;
  onPress: (id: string) => void;
}

// Default placeholder image for trips
const DEFAULT_TRIP_IMAGE = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';

export function TripCard({ trip, onPress }: TripCardProps) {
  // Parse ISO date strings
  const startDate = parseISO(trip.start_date);
  const endDate = parseISO(trip.end_date);
  
  const dateRange = `${format(startDate, 'd MMM', { locale: pl })} - ${format(endDate, 'd MMM yyyy', { locale: pl })}`;

  const getStatusLabel = (status: TripStatus): string => {
    switch (status) {
      case 'in_progress':
        return 'W toku';
      case 'done':
        return 'Zakończona';
      case 'planning':
        return 'Planowanie';
      case 'confirmed':
        return 'Potwierdzona';
      default:
        return 'Nadchodząca';
    }
  };

  const statusLabel = getStatusLabel(trip.status);

  return (
    <Pressable
      onPress={() => onPress(trip.id)}
      style={({ pressed }) => [
        styles.container,
        pressed && { opacity: 0.95, transform: [{ scale: 0.98 }] },
      ]}
    >
      <Image
        source={{ uri: DEFAULT_TRIP_IMAGE }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(10, 14, 23, 0.9)']}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{statusLabel}</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.destination}>{trip.destination}</Text>
          <Text style={styles.dates}>{dateRange}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.background.secondary,
    marginBottom: spacing[4],
    ...shadows.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing[4],
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-end',
  },
  footer: {
    gap: spacing[1],
  },
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: layout.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    ...typography.styles.caption,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  destination: {
    ...typography.styles.h3,
    color: '#FFFFFF',
  },
  dates: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
  },
});

