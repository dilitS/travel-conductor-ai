import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  FadeIn,
  FadeInUp
} from 'react-native-reanimated';
import { Check, Circle, AlertCircle } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { LoadingSpinner, ProgressBar, Button } from '@/components/ui';
import { useCreatorStore } from '@/stores/creatorStore';
import { createTrip, generateTripDay } from '@/services/firebase/functions';

interface StepStatus {
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

const INITIAL_STEPS: StepStatus[] = [
  { label: 'Tworzę podróż...', status: 'pending' },
  { label: 'Analizuję Twoje preferencje...', status: 'pending' },
  { label: 'Wyszukuję najlepsze miejsca...', status: 'pending' },
  { label: 'Optymalizuję trasę...', status: 'pending' },
  { label: 'Finalizuję plan dnia 1...', status: 'pending' },
];

export default function GeneratingScreen() {
  const router = useRouter();
  const { draft, reset } = useCreatorStore();
  const [steps, setSteps] = useState<StepStatus[]>(INITIAL_STEPS);
  const [progress, setProgress] = useState(0.05);
  const [error, setError] = useState<string | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const isGenerating = useRef(false);

  // Update step status helper
  const updateStep = (index: number, status: StepStatus['status']) => {
    setSteps(prev => prev.map((step, i) => 
      i === index ? { ...step, status } : step
    ));
  };

  // Main generation flow
  useEffect(() => {
    if (isGenerating.current) return;
    isGenerating.current = true;

    const generate = async () => {
      try {
        // Validate draft data
        if (!draft.destination || !draft.dates.startDate || !draft.dates.endDate) {
          throw new Error('Brakuje wymaganych danych podróży');
        }

        // Step 1: Create trip
        updateStep(0, 'active');
        setProgress(0.1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];
        
        const createResponse = await createTrip({
          destination: draft.destination,
          start_date: formatDate(draft.dates.startDate),
          end_date: formatDate(draft.dates.endDate),
          transport_mode: 'samolot', // Default, can be added to creator
          budget_level: draft.budget === 'budget' ? 'oszczędny' : 
                        draft.budget === 'luxury' ? 'luksusowy' : 'średni',
          people: draft.people || { adults: 2, children: 0 },
          interests: draft.interests,
          notes: draft.notes,
        });

        const newTripId = createResponse.trip_id;
        setTripId(newTripId);
        updateStep(0, 'completed');
        setProgress(0.25);

        // Step 2: Analyze preferences (simulated - part of AI call)
        updateStep(1, 'active');
        await new Promise(resolve => setTimeout(resolve, 500));
        updateStep(1, 'completed');
        setProgress(0.35);

        // Step 3: Search places (simulated - part of AI call)
        updateStep(2, 'active');
        await new Promise(resolve => setTimeout(resolve, 500));
        updateStep(2, 'completed');
        setProgress(0.5);

        // Step 4: Optimize route (simulated - part of AI call)
        updateStep(3, 'active');
        await new Promise(resolve => setTimeout(resolve, 500));
        updateStep(3, 'completed');
        setProgress(0.65);

        // Step 5: Generate day 1 with AI
        updateStep(4, 'active');
        setProgress(0.7);

        const dayResponse = await generateTripDay({
          trip_id: newTripId,
          day_index: 1,
        });

        updateStep(4, 'completed');
        setProgress(1);

        console.log('[Generating] Day 1 generated:', dayResponse.ui_summary_text);

        // Success! Navigate to trip after short delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Reset creator state
        reset();
        
        // Navigate to trip details
        router.replace(`/trip/${newTripId}`);

      } catch (err) {
        console.error('[Generating] Error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Wystąpił błąd podczas generowania planu';
        setError(errorMessage);
        
        // Mark current active step as error
        setSteps(prev => prev.map(step => 
          step.status === 'active' ? { ...step, status: 'error' } : step
        ));
      }
    };

    generate();
  }, []);

  const handleRetry = () => {
    setError(null);
    setSteps(INITIAL_STEPS);
    setProgress(0.05);
    isGenerating.current = false;
    // Re-trigger generation
    router.replace('/creator/generating');
  };

  const handleCancel = () => {
    reset();
    router.dismissAll();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          {error ? (
            <AlertCircle size={48} color={colors.semantic.error} />
          ) : (
            <LoadingSpinner size={48} color={colors.green.primary} />
          )}
          <Text style={styles.title}>
            {error ? 'Coś poszło nie tak' : 'Tworzę Twój plan podróży'}
          </Text>
          <Text style={styles.subtitle}>
            {error ? error : 'To może potrwać do 60 sekund...'}
          </Text>
        </Animated.View>

        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={progress} 
            height={6} 
            color={error ? colors.semantic.error : colors.green.primary}
          />
        </View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <Animated.View 
              key={index} 
              entering={FadeInUp.delay(index * 100)}
              style={styles.stepItem}
            >
              <View style={styles.iconContainer}>
                {step.status === 'completed' ? (
                  <Check size={20} color={colors.green.primary} />
                ) : step.status === 'active' ? (
                  <LoadingSpinner size={20} color={colors.green.primary} />
                ) : step.status === 'error' ? (
                  <AlertCircle size={20} color={colors.semantic.error} />
                ) : (
                  <Circle size={20} color={colors.text.tertiary} />
                )}
              </View>
              <Text style={[
                styles.stepText, 
                step.status === 'completed' && styles.stepTextCompleted,
                step.status === 'active' && styles.stepTextActive,
                step.status === 'error' && styles.stepTextError,
                step.status === 'pending' && styles.stepTextPending,
              ]}>
                {step.label}
              </Text>
            </Animated.View>
          ))}
        </View>

        {error && (
          <View style={styles.errorActions}>
            <Button
              label="Spróbuj ponownie"
              onPress={handleRetry}
              variant="primary"
            />
            <Button
              label="Anuluj"
              onPress={handleCancel}
              variant="outline"
              style={{ marginTop: spacing[3] }}
            />
          </View>
        )}

        {!error && draft.destination && (
          <Animated.View entering={FadeIn.delay(500)} style={styles.destinationBadge}>
            <Text style={styles.destinationText}>
              ✈️ {draft.destination}
            </Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    padding: layout.screenPadding,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginTop: spacing[4],
    textAlign: 'center',
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginTop: spacing[2],
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: spacing[8],
  },
  stepsContainer: {
    gap: spacing[4],
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
  },
  stepText: {
    ...typography.styles.body,
    fontWeight: '500',
  },
  stepTextActive: {
    color: colors.text.primary,
  },
  stepTextCompleted: {
    color: colors.green.primary,
  },
  stepTextError: {
    color: colors.semantic.error,
  },
  stepTextPending: {
    color: colors.text.tertiary,
  },
  errorActions: {
    marginTop: spacing[8],
  },
  destinationBadge: {
    marginTop: spacing[8],
    alignSelf: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: layout.radius.full,
  },
  destinationText: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
  },
});
