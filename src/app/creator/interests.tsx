import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CreatorLayout } from '@/components/creator';
import { GradientButton, Chip } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { useCreatorStore } from '@/stores/creatorStore';

const INTERESTS = [
  'Zwiedzanie', 'Sztuka', 'Jedzenie', 'Natura', 
  'Sport', 'Historia', 'Zakupy', 'Relaks', 
  'Muzyka', 'Architektura', 'Fotografia', 'Życie nocne'
];

export default function CreatorStep4() {
  const router = useRouter();
  const { toggleInterest, nextStep, draft, setStep } = useCreatorStore();

  React.useEffect(() => {
    setStep(5);
  }, []);

  const handleNext = () => {
    if (draft.interests.length > 0) {
      nextStep();
      router.push('/creator/notes');
    }
  };

  return (
    <CreatorLayout title="Zainteresowania">
      <View style={styles.container}>
        <Text style={styles.heading}>Co Cię interesuje?</Text>
        <Text style={styles.subheading}>Wybierz co najmniej jedno</Text>
        
        <View style={styles.chipsContainer}>
          {INTERESTS.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              selected={draft.interests.includes(interest)}
              onPress={() => toggleInterest(interest)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <GradientButton
            label="Dalej"
            onPress={handleNext}
            disabled={draft.interests.length === 0}
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    paddingBottom: 100, // Space for fixed footer
  },
  footer: {
    position: 'absolute',
    bottom: spacing[4],
    left: 0,
    right: 0,
  },
});
