import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { TripDay } from '@/types';
import { Place } from '@/types';
import { colors, spacing, typography, layout } from '@/theme';
import { MapPin, Quote } from 'lucide-react-native';

interface StoryDayProps {
  day: TripDay;
  placesMap: Map<string, Place>;
}

const { width } = Dimensions.get('window');

export function StoryDay({ day, placesMap }: StoryDayProps) {
  // Extract places for this day
  const dayPlaces = day.plan_json.steps
    .filter(s => s.type === 'visit' && s.place_id)
    .map(s => {
        // Handle place_id potentially being a string ID that maps to a Place object
        // In shared plan dummy data, place_id is 'p1' which maps to Place object
        return placesMap.get(s.place_id!) || placesMap.get((s as any).id); 
    })
    .filter(Boolean) as Place[];

  const mainPlace = dayPlaces[0];
  const otherPlaces = dayPlaces.slice(1);

  return (
    <View style={styles.container}>
      {/* Day Header Line */}
      <View style={styles.timelineContainer}>
        <View style={styles.timelineLine} />
        <View style={styles.dayBadge}>
          <Text style={styles.dayNumber}>{day.day_index}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.dayTitle}>{day.theme || `Dzień ${day.day_index}`}</Text>
        
        {/* Narrative Text */}
        <Text style={styles.narrative}>
          {day.ui_summary_text || "Dzień pełen wrażeń i odkrywania nowych miejsc."}
        </Text>

        {/* Main Highlight Image */}
        {mainPlace && mainPlace.thumbnail_url && (
          <View style={styles.mainImageContainer}>
            <Image
              source={{ uri: mainPlace.thumbnail_url }}
              style={styles.mainImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.imageCaption}>
              <MapPin size={12} color="#FFF" />
              <Text style={styles.imageCaptionText}>{mainPlace.name}</Text>
            </View>
          </View>
        )}

        {/* Author Quote/Tip */}
        <View style={styles.quoteBlock}>
          <Quote size={24} color={colors.green.primary} style={styles.quoteIcon} />
          <Text style={styles.quoteText}>
            "To był niesamowity dzień! {mainPlace?.name || 'To miejsce'} robi ogromne wrażenie na żywo."
          </Text>
        </View>

        {/* Other Places List */}
        {otherPlaces.length > 0 && (
          <View style={styles.highlightsList}>
            <Text style={styles.highlightsTitle}>Odwiedzone miejsca:</Text>
            {otherPlaces.map((place, idx) => (
              <View key={idx} style={styles.highlightItem}>
                <View style={styles.bullet} />
                <Text style={styles.highlightName}>{place.name}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing[8],
    paddingHorizontal: layout.screenPadding,
  },
  timelineContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: spacing[4],
  },
  timelineLine: {
    position: 'absolute',
    top: 40,
    bottom: -spacing[8], // Extend to next item
    width: 2,
    backgroundColor: colors.border.default,
  },
  dayBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.green.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  dayNumber: {
    ...typography.styles.h4,
    color: '#FFFFFF',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingTop: spacing[1],
  },
  dayTitle: {
    ...typography.styles.h3, // Serif style
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  narrative: {
    ...typography.styles.body,
    fontSize: 16,
    lineHeight: 26,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  mainImageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing[4],
    height: 200,
    width: '100%',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageCaption: {
    position: 'absolute',
    bottom: spacing[2],
    left: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  imageCaptionText: {
    ...typography.styles.caption,
    color: '#FFF',
  },
  quoteBlock: {
    backgroundColor: colors.background.tertiary, // Subtle background
    padding: spacing[4],
    borderRadius: 16,
    marginBottom: spacing[4],
    borderLeftWidth: 4,
    borderLeftColor: colors.green.primary,
  },
  quoteIcon: {
    marginBottom: spacing[2],
    opacity: 0.5,
  },
  quoteText: {
    ...typography.styles.body,
    fontStyle: 'italic',
    color: colors.text.primary,
  },
  highlightsList: {
    marginTop: spacing[2],
  },
  highlightsTitle: {
    ...typography.styles.caption,
    fontWeight: '700',
    color: colors.text.tertiary,
    marginBottom: spacing[2],
    textTransform: 'uppercase',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.text.tertiary,
    marginRight: spacing[2],
  },
  highlightName: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
  },
});

