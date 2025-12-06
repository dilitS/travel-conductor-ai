/**
 * Trip Details Screen
 * Full integration with new 6-collection data model
 * Features: Stacking activity cards, 3 tabs (Plan/Info/Map), Voice guide button
 * Redesigned for Professional UI with Floating Voice Button
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MoreHorizontal, Mic, Share, Trash2, Info } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { 
  TripHero, 
  DayCarousel, 
  TripTimeline, 
  TripInfoTab,
  RainPlanToggle,
  OfferList,
  FloatingVoiceButton
} from '@/components/trip';
import { Button } from '@/components/ui';
import { useTripStore, usePlacesStore, useOffersStore } from '@/stores';
import { Step } from '@/types/step';
import { Place } from '@/types/place';

type Tab = 'plan' | 'info' | 'map';

// Demo trip ID for automatic demo mode
const KRAKOW_TRIP_ID = 'krakow_demo_trip';

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(1);
  const [useRainPlan, setUseRainPlan] = useState<boolean>(false);

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

  // Loading state
  const isLoading = tripLoading || placesLoading || offersLoading;

  // Safe navigation back handler
  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)');
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
    setUseRainPlan(!useRainPlan);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={[styles.header, activeTab === 'plan' && styles.headerNoBorder]}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        {/* Only show title in header if not in Plan tab (because Plan has Hero) */}
        <Text style={styles.headerTitle} numberOfLines={1}>
          {activeTab !== 'plan' ? currentTrip.destination : ''}
        </Text>
        
        <TouchableOpacity style={styles.iconButton}>
          <MoreHorizontal size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'plan' && styles.activeTab]}
          onPress={() => setActiveTab('plan')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'plan' && styles.activeTabText]}>
            Plan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Info
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
            Mapa
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'plan' && (
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TripHero trip={currentTrip} />
            
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
            
            {/* Footer actions removed - replaced by FloatingVoiceButton */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}

        {activeTab === 'info' && (
          <TripInfoTab trip={currentTrip} />
        )}

        {activeTab === 'map' && (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>
              Mapa zostanie dodana w następnym etapie
            </Text>
          </View>
        )}
      </View>

      {/* Floating AI Voice Guide Button */}
      {activeTab === 'plan' && (
        <FloatingVoiceButton onPress={() => handleStartGuide()} />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  headerNoBorder: {
    borderBottomWidth: 0,
    backgroundColor: colors.background.primary,
  },
  iconButton: {
    padding: spacing[1],
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    backgroundColor: colors.background.primary,
    zIndex: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.green.primary,
  },
  tabText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for floating button
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  mapPlaceholderText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
