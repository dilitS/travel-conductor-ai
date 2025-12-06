/**
 * TripHero Component - Hero section for trip details
 * Updated for professional immersive look
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { colors, spacing, typography, layout } from '@/theme';
import { Trip, TripStatus } from '@/types/trip';

interface TripHeroProps {
  trip: Trip;
  imageUrl?: string; // Optional override for image
}

/**
 * Get status badge text
 */
function getStatusText(status: TripStatus): string {
  switch (status) {
    case 'planning':
      return 'Planowanie';
    case 'confirmed':
      return 'Potwierdzona';
    case 'in_progress':
      return 'W trakcie';
    case 'done':
      return 'Zakończona';
    default:
      return status;
  }
}

/**
 * Get status badge color
 */
function getStatusColor(status: TripStatus): string {
  switch (status) {
    case 'planning':
      return colors.text.secondary;
    case 'confirmed':
      return colors.green.primary;
    case 'in_progress':
      return '#3B82F6'; // Blue
    case 'done':
      return colors.text.tertiary;
    default:
      return colors.green.primary;
  }
}

// Default image for trips without photos
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop';

export function TripHero({ trip, imageUrl }: TripHeroProps) {
  // Parse string dates
  const startDate = parseISO(trip.start_date);
  const endDate = parseISO(trip.end_date);
  
  const statusText = getStatusText(trip.status);
  const statusColor = getStatusColor(trip.status);
  
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: imageUrl || DEFAULT_IMAGE }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={500}
      />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)', colors.background.primary]}
        locations={[0, 0.4, 0.8, 1]}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: statusColor }]}>
          <Text style={styles.badgeText}>{statusText}</Text>
        </View>
        
        <Text style={styles.destination} numberOfLines={2}>
          {trip.destination}
        </Text>
        
        <Text style={styles.dates}>
          {format(startDate, 'd MMMM', { locale: pl })} - {format(endDate, 'd MMMM yyyy', { locale: pl })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 380, // Increased height for immersive feel
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%', // Taller gradient
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: layout.screenPadding,
    paddingBottom: spacing[6],
  },
  badge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: 20, // Pill shape
    alignSelf: 'flex-start',
    marginBottom: spacing[3],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    ...typography.styles.caption,
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
  },
  destination: {
    ...typography.styles.h1,
    fontSize: 36,
    lineHeight: 42,
    color: '#FFFFFF',
    marginBottom: spacing[2],
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dates: {
    ...typography.styles.body,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
  },
});
