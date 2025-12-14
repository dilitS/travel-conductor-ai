/**
 * Trip Details Screen
 * Full integration with new 6-collection data model
 * Features: Stacking activity cards, 3 tabs (Plan/Info/Map), Voice guide button
 * Redesigned for Professional UI with Floating Voice Button
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, ActivityIndicator, Modal, Pressable, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { ChevronLeft, MoreHorizontal, X, Maximize2, Minimize2, Scan } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { hapticImpactLight, hapticSelection } from '@/utils/haptics';
import { 
  TripHero, 
  DayCarousel, 
  TripTimeline, 
  TripInfoTab, 
  RainPlanToggle, 
  OfferList, 
  FloatingVoiceButton, 
  FocusView, 
  TripMapBackground 
} from '@/components/trip';
import { Button, HeaderIconButton } from '@/components/ui';
import { useTripStore, usePlacesStore, useOffersStore } from '@/stores';
import { Step } from '@/types/step';
import { Place } from '@/types/place';

// Region type for map
interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// Demo trip ID for automatic demo mode
const KRAKOW_TRIP_ID = 'krakow_demo_trip';

// Default map region (Poland center)
const DEFAULT_REGION: Region = {
  latitude: 50.0647,
  longitude: 19.9450,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeDayIndex, setActiveDayIndex] = useState<number>(1);
  const [useRainPlan, setUseRainPlan] = useState<boolean>(false);
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false);
  const [isMapFullScreen, setIsMapFullScreen] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);

  // Stores
  const { 
    currentTrip, 
    tripDays, 
    isLoading: tripLoading, 
    fetchTrip, 
    fetchTripDays,
    clearCurrentTrip,
  } = useTripStore();
  
  const { 
    places, 
    isLoading: placesLoading, 
    fetchPlacesForTrip,
    clearPlaces,
  } = usePlacesStore();

  const {
    offers,
    isLoading: offersLoading,
    fetchOffersForTrip,
    getOffersForDay,
    clearOffers,
  } = useOffersStore();

  // Load data on mount
  useEffect(() => {
    if (id) {
      loadTripData(id);
    }
    
    return () => {
      clearCurrentTrip();
      clearPlaces();
      clearOffers();
    };
  }, [id]);

  // Reset rain plan toggle when day changes
  useEffect(() => {
    setUseRainPlan(false);
  }, [activeDayIndex]);

  async function loadTripData(tripId: string) {
    await fetchTrip(tripId);
    await Promise.all([
      fetchTripDays(tripId),
      fetchPlacesForTrip(tripId),
      fetchOffersForTrip(tripId),
    ]);
  }

  // Get active day data
  const activeDay = tripDays.find(d => d.day_index === activeDayIndex);
  
  // Determine which steps to show
  const hasRainPlan = activeDay?.plan_json?.rain_plan?.enabled ?? false;
  const activeSteps: Step[] = useRainPlan && hasRainPlan
    ? activeDay?.plan_json?.rain_plan?.steps || []
    : activeDay?.plan_json?.steps || [];

  // Get offers for current day
  const dayOffers = getOffersForDay(activeDayIndex);

  // Calculate map region from places
  const mapRegion = useMemo<Region>(() => {
    const dayPlaces = activeSteps
      .filter(s => s.type === 'visit' && 'place_id' in s && s.place_id)
      .map(s => places.get((s as { place_id: string }).place_id))
      .filter(Boolean);
    
    if (dayPlaces.length > 0 && dayPlaces[0]) {
      return {
        latitude: dayPlaces[0].lat,
        longitude: dayPlaces[0].lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }
    return DEFAULT_REGION;
  }, [activeSteps, places]);

  // Loading state
  const isLoading = tripLoading || placesLoading || offersLoading;

  // Safe navigation back handler
  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(main)');
    }
  }

  if (isLoading && !currentTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green.primary} />
          <Text style={styles.loadingText}>Ładowanie podróży...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Nie znaleziono podróży</Text>
          <Button 
            label="Wróć" 
            onPress={handleBack} 
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    );
  }

  function handleStepPress(step: Step) {
    if (step.type === 'visit' && step.place_id) {
      console.log('Navigate to place:', step.place_id);
    }
  }

  function handleStartGuide(place?: Place) {
    // Auto-enable demo mode for demo trip
    const demoParam = id === KRAKOW_TRIP_ID ? '?demo=true' : '';
    
    // Navigate to voice guide, optionally with place context
    if (place) {
      const separator = demoParam ? '&' : '?';
      router.push(`/trip/${id}/voice-guide${demoParam}${separator}placeId=${place.place_id}`);
    } else {
      router.push(`/trip/${id}/voice-guide${demoParam}`);
    }
  }

  function handleRainPlanToggle() {
    hapticImpactLight();
    setUseRainPlan(!useRainPlan);
  }

  function handleOpenMap() {
    hapticSelection();
    setIsMapVisible(true);
    setIsMapFullScreen(false);
  }

  function handleCloseMap() {
    setIsMapVisible(false);
    setIsMapFullScreen(false);
  }

  function handleToggleMapSize() {
    setIsMapFullScreen((prev) => !prev);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <HeaderIconButton onPress={handleBack} accessibilityLabel="Wróć">
            <ChevronLeft size={24} color={colors.text.secondary} />
          </HeaderIconButton>
          
          <View style={styles.headerSpacer} />
          
          <HeaderIconButton 
            onPress={() => {
              hapticSelection();
              setIsFocusMode(!isFocusMode);
            }} 
            accessibilityLabel="Tryb skupienia"
            style={{ marginRight: spacing[2] }}
          >
            <Scan size={24} color={isFocusMode ? colors.green.primary : colors.text.secondary} />
          </HeaderIconButton>

          <HeaderIconButton accessibilityLabel="Więcej">
            <MoreHorizontal size={24} color={colors.text.secondary} />
          </HeaderIconButton>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Map Background */}
          <TripMapBackground 
            activeSteps={activeSteps} 
            places={places}
            currentTrip={currentTrip}
            activeDayIndex={activeDayIndex}
          />

          {isFocusMode ? (
            <FocusView
              activeStep={activeSteps[0] || null}
              nextStep={activeSteps[1] || null}
              onNavigate={(step) => console.log('Navigating to', step)}
              onComplete={(step) => console.log('Completed', step)}
            />
          ) : (
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!isMapVisible}
            >
              <TripHero trip={currentTrip} onMapPress={handleOpenMap} />
              
              {/* Day Selector (Strip) */}
              {tripDays.length > 0 && (
                <DayCarousel 
                  days={tripDays} 
                  activeDayIndex={activeDayIndex} 
                  onDayPress={setActiveDayIndex} 
                />
              )}
              
              {activeDay && (
                <>
                  {/* Day Theme */}
                  {activeDay.theme && (
                    <View style={styles.themeContainer}>
                      <Text style={styles.themeTitle}>
                        {useRainPlan ? '☔ Plan na deszcz' : activeDay.theme}
                      </Text>
                      {activeDay.ui_summary_text && !useRainPlan && (
                        <Text style={styles.themeSummary}>{activeDay.ui_summary_text}</Text>
                      )}
                    </View>
                  )}

                  {/* Rain Plan Toggle */}
                  <View style={styles.toggleContainer}>
                    <RainPlanToggle
                      isEnabled={hasRainPlan}
                      isActive={useRainPlan}
                      onToggle={handleRainPlanToggle}
                      description={activeDay.plan_json?.rain_plan?.description}
                    />
                  </View>

                  {/* Steps Timeline with Stacking Cards */}
                  <TripTimeline 
                    steps={activeSteps} 
                    places={places}
                    onStepPress={handleStepPress}
                    onStartGuide={handleStartGuide}
                  />

                  {/* Offers for Day */}
                  {dayOffers.length > 0 && (
                    <OfferList 
                      offers={dayOffers}
                      title={`Oferty na dzień ${activeDayIndex}`}
                    />
                  )}
                </>
              )}

              {/* Empty state for no days */}
              {tripDays.length === 0 && (
                <View style={styles.emptyDaysContainer}>
                  <Text style={styles.emptyDaysText}>
                    Brak zaplanowanych dni. Wygeneruj plan z AI!
                  </Text>
                </View>
              )}

              <View style={styles.infoSectionWrapper}>
                <TripInfoTab trip={currentTrip} variant="inline" />
              </View>
              
              {/* Footer actions removed - replaced by FloatingVoiceButton */}
              <View style={styles.bottomSpacer} />
            </ScrollView>
          )}
        </View>

        {/* Map modal */}
        <Modal
          visible={isMapVisible}
          animationType="fade"
          transparent
          presentationStyle="overFullScreen"
          onRequestClose={handleCloseMap}
        >
          <Pressable style={styles.mapModalOverlay} onPress={handleCloseMap}>
            <View style={[styles.mapModalCard, isMapFullScreen && styles.mapModalCardFull]}>
              <View style={styles.mapModalHeader}>
                <Text style={styles.mapModalTitle}>Mapa</Text>
                <View style={styles.mapHeaderActions}>
                  <HeaderIconButton onPress={handleToggleMapSize} accessibilityLabel="Zmień rozmiar">
                    {isMapFullScreen ? (
                      <Minimize2 size={18} color={colors.text.secondary} />
                    ) : (
                      <Maximize2 size={18} color={colors.text.secondary} />
                    )}
                  </HeaderIconButton>
                  <HeaderIconButton onPress={handleCloseMap} accessibilityLabel="Zamknij mapę">
                    <X size={20} color={colors.text.secondary} />
                  </HeaderIconButton>
                </View>
              </View>
              <View style={[styles.mapPlaceholder, isMapFullScreen && styles.mapPlaceholderFull]}>
                <Text style={styles.mapPlaceholderText}>
                  Mapa zostanie dodana w następnym etapie
                </Text>
              </View>
            </View>
          </Pressable>
        </Modal>

        <FloatingVoiceButton onPress={() => handleStartGuide()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    height: layout.headerHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating button
  },
  infoSectionWrapper: {
    marginTop: spacing[4],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    padding: spacing[6],
  },
  errorText: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  themeContainer: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  themeTitle: {
    ...typography.styles.h2, // Increased size
    fontSize: 24,
    color: colors.text.primary,
  },
  themeSummary: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginTop: spacing[1],
    lineHeight: 22,
  },
  toggleContainer: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[2],
  },
  emptyDaysContainer: {
    padding: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDaysText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    backgroundColor: colors.background.tertiary,
    borderRadius: layout.radius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    minHeight: 240,
  },
  mapPlaceholderFull: {
    flex: 1,
    width: '100%',
  },
  mapPlaceholderText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  mapModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
    ...StyleSheet.absoluteFillObject,
  },
  mapModalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.xl,
    padding: spacing[5],
    gap: spacing[4],
    borderWidth: 1,
    borderColor: colors.border.default,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  mapModalCardFull: {
    maxWidth: '100%',
    height: '85%',
  },
  mapModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapModalTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  mapHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});

