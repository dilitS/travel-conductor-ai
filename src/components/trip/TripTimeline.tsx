/**
 * TripTimeline Component - Displays steps as stacking cards
 * Updated with ActivityStackCard for better visual hierarchy
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ActivityStackCard } from './ActivityStackCard';
import { PlaceDetailsSheet } from './PlaceDetailsSheet';
import { Step, isTransferStep } from '@/types/step';
import { Place } from '@/types/place';
import { colors, spacing, typography } from '@/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface TripTimelineProps {
  steps: Step[];
  places: Map<string, Place>;
  onStepPress?: (step: Step) => void;
  onStartGuide?: (place: Place) => void;
}

export function TripTimeline({ steps, places, onStepPress, onStartGuide }: TripTimelineProps) {
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  if (!steps || steps.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Brak zaplanowanych kroków na ten dzień.</Text>
      </View>
    );
  }

  const handleExpand = (stepId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedStepId(prev => prev === stepId ? null : stepId);
  };

  const handlePress = (step: Step) => {
    // Get place for this step
    const placeId = (step as { place_id?: string }).place_id;
    if (placeId) {
      const place = places.get(placeId);
      if (place) {
        setSelectedPlace(place);
        setIsDetailsOpen(true);
      }
    }
    onStepPress?.(step);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setTimeout(() => setSelectedPlace(null), 300);
  };

  const handleStartGuide = (place: Place) => {
    handleCloseDetails();
    onStartGuide?.(place);
  };

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        // Get place for visit/meal/accommodation steps
        const placeId = (step as { place_id?: string }).place_id;
        const place = placeId ? places.get(placeId) : undefined;

        // Get from/to places for transfer steps
        let fromPlace: Place | undefined;
        let toPlace: Place | undefined;
        
        if (isTransferStep(step)) {
          fromPlace = places.get(step.from_place_id);
          toPlace = places.get(step.to_place_id);
        }

        // Check if previous card is expanded
        const isPreviousExpanded = index > 0 && expandedStepId === steps[index - 1].step_id;

        return (
          <ActivityStackCard
            key={step.step_id}
            step={step}
            place={place}
            fromPlace={fromPlace}
            toPlace={toPlace}
            index={index}
            isFirst={index === 0}
            isExpanded={expandedStepId === step.step_id}
            isPreviousExpanded={isPreviousExpanded}
            onPress={() => handlePress(step)}
            onExpand={() => handleExpand(step.step_id)}
          />
        );
      })}

      <View style={styles.stackSpacer} />

      {/* Place Details Sheet */}
      <PlaceDetailsSheet
        place={selectedPlace}
        isVisible={isDetailsOpen}
        onClose={handleCloseDetails}
        onStartGuide={handleStartGuide}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[6],
    paddingBottom: spacing[12],
  },
  stackSpacer: {
    height: spacing[6],
  },
  emptyContainer: {
    padding: spacing[8],
    alignItems: 'center',
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
