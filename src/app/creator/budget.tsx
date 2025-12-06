import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CreatorLayout, BudgetCard } from '@/components/creator';
import { GradientButton } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { useCreatorStore } from '@/stores/creatorStore';

const BUDGET_OPTIONS = [
  {
    id: 'budget',
    title: 'Oszczędny',
    description: 'Hostele, transport publiczny, tanie jedzenie.',
    priceLevel: '$',
  },
  {
    id: 'moderate',
    title: 'Średni',
    description: 'Hotele 3*, taksówki, restauracje.',
    priceLevel: '$$',
  },
  {
    id: 'luxury',
    title: 'Luksusowy',
    description: 'Hotele 5*, prywatny kierowca, fine dining.',
    priceLevel: '$$$',
  },
] as const;

export default function CreatorStep3() {
  const router = useRouter();
  const { setBudget, nextStep, draft, setStep } = useCreatorStore();

  React.useEffect(() => {
    setStep(4);
  }, []);

  const handleNext = () => {
    if (draft.budget) {
      nextStep();
      router.push('/creator/interests');
    }
  };

  return (
    <CreatorLayout title="Budżet">
      <View style={styles.container}>
        <Text style={styles.heading}>Jaki masz budżet?</Text>
        
        <View style={styles.options}>
          {BUDGET_OPTIONS.map((option) => (
            <BudgetCard
              key={option.id}
              title={option.title}
              description={option.description}
              priceLevel={option.priceLevel}
              selected={draft.budget === option.id}
              onPress={() => setBudget(option.id)}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <GradientButton
            label="Dalej"
            onPress={handleNext}
            disabled={!draft.budget}
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
    marginBottom: spacing[6],
  },
  options: {
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
