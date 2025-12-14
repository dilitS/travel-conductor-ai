/**
 * DayCarousel Component - Horizontal day selector
 * Enhanced with auto-scroll and improved UX
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { colors, spacing, typography, layout } from '@/theme';
import { TripDay } from '@/types/tripDay';
import { hapticSelection } from '@/utils/haptics';

interface DayCarouselProps {
  days: TripDay[];
  activeDayIndex: number;
  onDayPress: (dayIndex: number) => void;
}

// Constants for scroll calculation
const ITEM_WIDTH = 100;
const ITEM_GAP = spacing[2];

export function DayCarousel({ days, activeDayIndex, onDayPress }: DayCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Calculate scroll position using useMemo to avoid re-calculations
  const scrollPosition = useMemo(() => {
    const activeIndex = days.findIndex(d => d.day_index === activeDayIndex);
    if (activeIndex < 0) return 0;
    return activeIndex * (ITEM_WIDTH + ITEM_GAP);
  }, [activeDayIndex, days]);

  // Auto-scroll to active day when activeDayIndex changes
  useEffect(() => {
    if (scrollViewRef.current && days.length > 0) {
      scrollViewRef.current.scrollTo({ 
        x: scrollPosition, 
        animated: true 
      });
    }
  }, [scrollPosition, days.length]);

  if (!days || days.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((day) => {
          const isActive = day.day_index === activeDayIndex;
          const date = parseISO(day.date);
          const hasRainPlan = day.plan_json?.rain_plan?.enabled ?? false;
          
          return (
            <TouchableOpacity
              key={day.id}
              style={[styles.dayItem, isActive && styles.activeItem]}
              onPress={() => {
                if (!isActive) hapticSelection();
                onDayPress(day.day_index);
              }}
              activeOpacity={0.7}
            >
              {/* Rain indicator dot */}
              {hasRainPlan && (
                <View style={styles.rainDot} />
              )}
              
              <Text style={[styles.dayLabel, isActive && styles.activeText]}>
                DZIEŃ
              </Text>
              
              <Text style={[styles.dayNumber, isActive && styles.activeText]}>
                {day.day_index}
              </Text>
              
              <Text style={[styles.dateLabel, isActive && styles.activeText]}>
                {format(date, 'd MMM', { locale: pl })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[3],
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing[2],
  },
  dayItem: {
    paddingVertical: spacing[3], // Increased from spacing[2]
    paddingHorizontal: spacing[5], // Increased from spacing[4]
    borderRadius: 14,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // Increased from 80
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  activeItem: {
    backgroundColor: colors.accent.pale,
    borderColor: colors.accent.primary,
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dayLabel: {
    ...typography.styles.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.tertiary,
    marginBottom: 0,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  dayNumber: {
    ...typography.styles.h1,
    fontSize: 32,
    lineHeight: 36,
    color: colors.text.primary,
    marginBottom: 2,
  },
  dateLabel: {
    ...typography.styles.bodySmall,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  activeText: {
    color: '#FFFFFF',
  },
  rainDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60A5FA', // Blue for rain
  },
});
