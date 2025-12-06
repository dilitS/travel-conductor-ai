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
          const stepsCount = day.plan_json?.steps?.length || 0;
          
          return (
            <TouchableOpacity
              key={day.id}
              style={[styles.dayItem, isActive && styles.activeItem]}
              onPress={() => onDayPress(day.day_index)}
              activeOpacity={0.7}
            >
              {/* Rain indicator dot */}
              {hasRainPlan && (
                <View style={styles.rainDot} />
              )}
              
              <Text style={[styles.dayLabel, isActive && styles.activeText]}>
                DZIEŃ {day.day_index}
              </Text>
              
              <Text style={[styles.dateLabel, isActive && styles.activeText]}>
                {format(date, 'd MMM', { locale: pl })}
              </Text>

              {/* Steps count badge */}
              {stepsCount > 0 && (
                <Animated.View 
                  entering={FadeIn.duration(300)}
                  style={[
                    styles.stepsBadge,
                    isActive && styles.stepsBadgeActive
                  ]}
                >
                  <Text style={[
                    styles.stepsCount,
                    isActive && styles.stepsCountActive
                  ]}>
                    {stepsCount}
                  </Text>
                </Animated.View>
              )}
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
    borderRadius: 30, // Fully rounded pill
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100, // Increased from 80
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
  },
  activeItem: {
    backgroundColor: colors.green.primary,
    borderColor: colors.green.primary,
    shadowColor: colors.green.primary,
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
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateLabel: {
    ...typography.styles.body,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
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
  stepsBadge: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  stepsCount: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.tertiary,
  },
  stepsCountActive: {
    color: '#FFFFFF',
  },
});
