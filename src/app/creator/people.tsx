import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Baby } from 'lucide-react-native';
import { CreatorLayout } from '@/components/creator';
import { NumberStepper, GradientButton } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { useCreatorStore } from '@/stores/creatorStore';

export default function CreatorPeopleStep() {
  const router = useRouter();
  const { setPeople, nextStep, draft, setStep } = useCreatorStore();
  
  // Local state synced with draft
  const [adults, setAdults] = useState(draft.people?.adults ?? 1);
  const [children, setChildren] = useState(draft.people?.children ?? 0);

  useEffect(() => {
    setStep(3);
  }, []);

  const handleNext = () => {
    setPeople(adults, children);
    nextStep();
    router.push('/creator/budget');
  };

  const totalPeople = adults + children;

  return (
    <CreatorLayout title="Podróżni">
      <View style={styles.container}>
        <Text style={styles.heading}>Kto jedzie?</Text>
        <Text style={styles.subheading}>Podaj liczbę podróżujących osób</Text>
        
        <View style={styles.steppersContainer}>
          <NumberStepper
            label="Dorośli"
            subtitle="13+ lat"
            value={adults}
            min={1}
            max={10}
            onChange={setAdults}
            icon={Users}
          />
          
          <NumberStepper
            label="Dzieci"
            subtitle="0-12 lat"
            value={children}
            min={0}
            max={10}
            onChange={setChildren}
            icon={Baby}
          />
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Razem: {totalPeople} {totalPeople === 1 ? 'osoba' : totalPeople < 5 ? 'osoby' : 'osób'}
          </Text>
        </View>

        <View style={styles.footer}>
          <GradientButton
            label="Dalej"
            onPress={handleNext}
            disabled={adults < 1}
            fullWidth
          />
        </View>
      </View>
    </CreatorLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: spacing[4],
  },
  heading: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subheading: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[6],
  },
  steppersContainer: {
    gap: spacing[3],
  },
  summary: {
    marginTop: spacing[6],
    padding: spacing[4],
    backgroundColor: colors.background.tertiary,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  footer: {
    position: 'absolute',
    bottom: spacing[4],
    left: 0,
    right: 0,
  },
});

