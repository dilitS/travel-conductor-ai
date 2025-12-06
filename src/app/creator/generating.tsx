import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  FadeIn,
  FadeInUp
} from 'react-native-reanimated';
import { Check, Circle } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { LoadingSpinner, ProgressBar } from '@/components/ui';

const STEPS = [
  'Analizuję Twoje preferencje...',
  'Wyszukuję najlepsze miejsca...',
  'Sprawdzam dostępność atrakcji...',
  'Optymalizuję trasę...',
  'Finalizuję plan podróży...'
];

export default function GeneratingScreen() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0.1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => {
        if (prevStep < STEPS.length - 1) {
          return prevStep + 1;
        }
        return prevStep;
      });
      
      setProgress((prev) => Math.min(prev + 0.2, 1));
    }, 2000);

    // Mock completion navigation
    const timeout = setTimeout(() => {
      router.dismissAll(); 
    }, 10500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <LoadingSpinner size={48} color={colors.green.primary} />
          <Text style={styles.title}>Tworzę Twój plan podróży</Text>
          <Text style={styles.subtitle}>To może potrwać około 30 sekund...</Text>
        </Animated.View>

        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} height={6} />
        </View>

        <View style={styles.stepsContainer}>
          {STEPS.map((step, index) => {
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;
            // const isPending = index > activeStep;

            return (
              <Animated.View 
                key={index} 
                entering={FadeInUp.delay(index * 200)}
                style={[styles.stepItem]}
              >
                <View style={styles.iconContainer}>
                  {isCompleted ? (
                    <Check size={20} color={colors.green.primary} />
                  ) : isActive ? (
                    <LoadingSpinner size={20} color={colors.green.primary} />
                  ) : (
                    <Circle size={20} color={colors.text.tertiary} />
                  )}
                </View>
                <Text style={[
                  styles.stepText, 
                  (isCompleted || isActive) ? styles.stepTextActive : styles.stepTextPending
                ]}>
                  {step}
                </Text>
              </Animated.View>
            );
          })}
        </View>
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
  stepTextPending: {
    color: colors.text.tertiary,
  },
});
