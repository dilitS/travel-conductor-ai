import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { GradientButton, ProgressBar, Chip } from '@/components/ui';
import { useOnboardingStore, INTEREST_OPTIONS, Interest } from '@/stores/onboardingStore';

export default function InterestsScreen() {
  const router = useRouter();
  const { selectedInterests, toggleInterest } = useOnboardingStore();

  const handleNext = () => {
    router.push('/(onboarding)/done');
  };

  const isSelected = (interest: Interest) => selectedInterests.includes(interest);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Co Cię interesuje?</Text>
        <Text style={styles.subtitle}>
          Wybierz kategorie, które lubisz. Pomoże nam to dopasować rekomendacje.
        </Text>

        {/* Interest Chips */}
        <View style={styles.chipsContainer}>
          {INTEREST_OPTIONS.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              selected={isSelected(interest)}
              onPress={() => toggleInterest(interest)}
            />
          ))}
        </View>

        {/* Selected count */}
        <Text style={styles.selectedCount}>
          Wybrano: {selectedInterests.length} {selectedInterests.length === 1 ? 'kategorię' : 
            selectedInterests.length >= 2 && selectedInterests.length <= 4 ? 'kategorie' : 'kategorii'}
        </Text>

        {/* CTA Button */}
        <GradientButton
          label="Dalej"
          onPress={handleNext}
          fullWidth
        />
      </ScrollView>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={0.75} />
        <Text style={styles.progressText}>3 z 4</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingTop: spacing[8],
  },
  title: {
    ...typography.styles.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[8],
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  selectedCount: {
    ...typography.styles.bodySmall,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing[8],
  },
  progressContainer: {
    padding: layout.screenPadding,
    paddingBottom: spacing[8],
    alignItems: 'center',
  },
  progressText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: spacing[2],
  },
});




