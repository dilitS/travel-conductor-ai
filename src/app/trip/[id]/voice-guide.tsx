/**
 * Voice Guide Screen - Live guide with location tracking
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Volume2, VolumeX, MapPin, Navigation, Pause, Play, Loader2 } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { useGuideStore, usePlacesStore, useTripStore } from '@/stores';
import { StepCard } from '@/components/trip';
import { PTTButton } from '@/components/guide';
import { 
  startLocationTracking, 
  stopLocationTracking,
  getCurrentPosition,
} from '@/services/locationService';
import { 
  initAudioSession,
  speakGuideNote,
  stopTTS,
  isSpeaking,
} from '@/services/audioService';
import { GeoLocation } from '@/types/liveSession';

// Polling interval for getCurrentStep (simplified approach)
const POLL_INTERVAL_MS = 10000;

export default function VoiceGuideScreen() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();
  const isDemoMode = demo === 'true';
  const router = useRouter();
  
  // Use ReturnType for interval ref (compatible with both Node and browser)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Stores
  const {
    session,
    isActive,
    isAudioPlaying,
    currentStep,
    lastLocation,
    startSession,
    startDemoSession,
    endSession,
    updateLocation,
    setLastLocation,
    setCurrentStep,
    setAudioPlaying,
    markStepAutoplayed,
    shouldTriggerAudio,
  } = useGuideStore();

  const { places, fetchPlacesForTrip } = usePlacesStore();
  const { currentTrip, tripDays, fetchTrip, fetchTripDays } = useTripStore();

  // Safe navigation back handler
  function handleBack() {
    console.log('handleBack called, canGoBack:', router.canGoBack());
    if (router.canGoBack()) {
      router.back();
    } else {
      console.log('Replacing with /(drawer)');
      router.replace('/(drawer)');
    }
  }

  // Initialize on mount
  useEffect(() => {
    if (!id) return;

    async function initialize() {
      setIsInitializing(true);
      
      try {
        // Demo mode: Skip API calls and use mock data
        if (isDemoMode) {
          // Start demo session (no API call)
          startDemoSession(id);
          
          // Mock location (Kraków center)
          const mockLocation: GeoLocation = {
            lat: 50.0647,
            lon: 19.9450,
            timestamp: new Date().toISOString(),
          };
          setLastLocation(mockLocation);
          
          // Load trip data (still needed for UI)
          if (!currentTrip) await fetchTrip(id);
          if (tripDays.length === 0) await fetchTripDays(id);
          if (places.size === 0) await fetchPlacesForTrip(id);
          
          setIsInitializing(false);
          return;
        }

        // Normal mode: Initialize audio
        await initAudioSession();

        // Fetch trip data if not loaded
        if (!currentTrip) {
          await fetchTrip(id);
        }
        if (tripDays.length === 0) {
          await fetchTripDays(id);
        }
        if (places.size === 0) {
          await fetchPlacesForTrip(id);
        }

        // Start session
        const sessionId = await startSession(id);
        if (!sessionId) {
          Alert.alert('Błąd', 'Nie udało się uruchomić przewodnika');
          handleBack();
          return;
        }

        // Get initial position
        const position = await getCurrentPosition();
        if (position) {
          setLastLocation(position);
          await updateLocation(position.lat, position.lon);
        }

        // Start location tracking
        const trackingStarted = await startLocationTracking(handleLocationUpdate);
        if (!trackingStarted) {
          Alert.alert('Uwaga', 'Nie można śledzić lokalizacji. Przewodnik może nie działać prawidłowo.');
        }

        // Start polling for current step
        startPolling();
      } catch (error) {
        console.error('Initialize error:', error);
        Alert.alert('Błąd', 'Wystąpił problem przy uruchamianiu przewodnika');
        handleBack();
      } finally {
        setIsInitializing(false);
      }
    }

    initialize();

    // Cleanup
    return () => {
      stopLocationTracking();
      stopTTS();
      stopPolling();
      // Cleanup session asynchronously (fire and forget)
      endSession().catch(error => console.error('Session cleanup error:', error));
    };
  }, [id]);

  // Handle location updates
  const handleLocationUpdate = useCallback(async (location: GeoLocation) => {
    if (isDemoMode) return; // Skip location updates in demo mode
    
    setLastLocation(location);
    if (session) {
      await updateLocation(location.lat, location.lon);
    }
  }, [session, isDemoMode]);

  // Polling for current step
  function startPolling() {
    if (pollIntervalRef.current) return;
    
    pollIntervalRef.current = setInterval(async () => {
      // In a real implementation, this would call getCurrentStep API
      // For now, we'll simulate by checking local state
      checkForAutoplay();
    }, POLL_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }

  // Check if audio should autoplay
  async function checkForAutoplay() {
    if (shouldTriggerAudio() && currentStep?.step.place_id) {
      const place = places.get(currentStep.step.place_id);
      if (place?.notes_json?.guide_note_audio) {
        playGuideAudio(place.notes_json.guide_note_audio, currentStep.step.step_id);
      }
    }
  }

  // Play guide audio
  function playGuideAudio(text: string, stepId: string) {
    setAudioPlaying(true, stepId);
    
    speakGuideNote(text, {
      onStart: () => setAudioPlaying(true, stepId),
      onDone: async () => {
        setAudioPlaying(false);
        await markStepAutoplayed(stepId);
      },
      onError: () => {
        setAudioPlaying(false);
      },
    });
  }

  // Stop guide
  function handleStop() {
    Alert.alert(
      'Zakończ przewodnika',
      'Czy na pewno chcesz zakończyć sesję przewodnika?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Zakończ',
          style: 'destructive',
          onPress: async () => {
            // Stop all services first
            stopLocationTracking();
            stopTTS();
            stopPolling();

            // End session (async, but don't wait for demo mode)
            if (isDemoMode) {
              // In demo mode, just reset state and navigate back
              endSession().catch(error => console.error('Demo session cleanup error:', error));
              handleBack();
            } else {
              // In normal mode, wait for session cleanup
              await endSession();
              handleBack();
            }
          },
        },
      ]
    );
  }

  // Toggle audio
  function handleToggleAudio() {
    if (isAudioPlaying) {
      stopTTS();
      setAudioPlaying(false);
    } else if (currentStep?.step.place_id) {
      const place = places.get(currentStep.step.place_id);
      if (place?.notes_json?.guide_note_audio) {
        playGuideAudio(place.notes_json.guide_note_audio, currentStep.step.step_id);
      }
    }
  }

  // Handle PTT recording complete
  async function handleRecordingComplete(uri: string) {
    console.log('Recording complete, URI:', uri);
    setIsProcessingVoice(true);
    
    try {
      // TODO: Send audio to Gemini Live for transcription and response
      // For now, just log and simulate processing
      console.log('Processing voice command...');
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Handle AI response
      // - Transcribe audio
      // - Send to Gemini Guide
      // - Play response via TTS
      
      console.log('Voice command processed (placeholder)');
    } catch (error) {
      console.error('Failed to process voice command:', error);
      Alert.alert('Błąd', 'Nie udało się przetworzyć komendy głosowej');
    } finally {
      setIsProcessingVoice(false);
    }
  }

  // Get current place
  const currentPlace = currentStep?.step.place_id 
    ? places.get(currentStep.step.place_id) 
    : undefined;

  // Loading state
  if (isInitializing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green.primary} />
          <Text style={styles.loadingText}>Uruchamianie przewodnika...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.activeIndicator} />
          <Text style={styles.headerTitle}>Przewodnik aktywny</Text>
          {isDemoMode && (
            <View style={styles.demoBadge}>
              <Text style={styles.demoBadgeText}>DEMO</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (isDemoMode) {
              // In demo mode, just go back without cleanup
              handleBack();
            } else {
              handleStop();
            }
          }}
          style={styles.stopButton}
        >
          <X size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Location Info */}
      <View style={styles.locationBar}>
        <Navigation size={16} color={colors.green.primary} />
        <Text style={styles.locationText}>
          {lastLocation 
            ? `${lastLocation.lat.toFixed(5)}, ${lastLocation.lon.toFixed(5)}`
            : 'Lokalizacja nieznana'
          }
        </Text>
        {currentStep?.step.distance_m_to_step && (
          <Text style={styles.distanceText}>
            {currentStep.step.distance_m_to_step}m do celu
          </Text>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <MapPin size={40} color={colors.text.tertiary} />
          <Text style={styles.mapPlaceholderText}>
            Mapa zostanie dodana wkrótce
          </Text>
        </View>

        {/* Current Step */}
        {currentStep && (
          <View style={styles.currentStepContainer}>
            <Text style={styles.sectionTitle}>Aktualny krok</Text>
            <StepCard
              step={currentStep.step as never} // Simplified type for now
              place={currentPlace}
              isLast
            />
          </View>
        )}

        {/* No step info */}
        {!currentStep && (
          <View style={styles.noStepContainer}>
            <Text style={styles.noStepText}>
              Zbliż się do pierwszego punktu, aby rozpocząć
            </Text>
          </View>
        )}
      </View>

      {/* Audio Controls */}
      <View style={styles.audioControls}>
        {/* PTT Button - main interaction */}
        <PTTButton 
          onRecordingComplete={handleRecordingComplete}
          disabled={!isActive}
          isProcessingVoice={isProcessingVoice}
        />

        {/* Play/Pause for TTS */}
        <View style={styles.ttsControls}>
          <TouchableOpacity 
            style={[styles.ttsButton, isAudioPlaying && styles.ttsButtonActive]}
            onPress={handleToggleAudio}
          >
            {isAudioPlaying ? (
              <Pause size={20} color={colors.background.primary} />
            ) : (
              <Play size={20} color={colors.green.primary} />
            )}
          </TouchableOpacity>
          <Text style={styles.ttsStatus}>
            {isAudioPlaying ? 'Odtwarzanie...' : 'TTS'}
          </Text>
        </View>
      </View>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  activeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.green.primary,
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  demoBadge: {
    backgroundColor: colors.green.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: spacing[2],
  },
  demoBadgeText: {
    ...typography.styles.caption,
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  stopButton: {
    padding: spacing[2],
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing[2],
    backgroundColor: colors.background.secondary,
    gap: spacing[2],
  },
  locationText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  distanceText: {
    ...typography.styles.caption,
    color: colors.green.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    margin: spacing[4],
    borderRadius: layout.radius.lg,
  },
  mapPlaceholderText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    marginTop: spacing[2],
  },
  currentStepContainer: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing[4],
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  noStepContainer: {
    padding: spacing[6],
    alignItems: 'center',
  },
  noStepText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.secondary,
  },
  ttsControls: {
    alignItems: 'center',
    gap: spacing[1],
  },
  ttsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.green.primary,
  },
  ttsButtonActive: {
    backgroundColor: colors.green.primary,
  },
  ttsStatus: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
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
});

