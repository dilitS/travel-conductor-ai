import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { PartyPopper, Sparkles } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { GradientButton, ProgressBar } from '@/components/ui';
import { useOnboardingStore } from '@/stores/onboardingStore';

export default function DoneScreen() {
  const router = useRouter();
  const { completeOnboarding, selectedInterests } = useOnboardingStore();

  const handleStart = () => {
    completeOnboarding();
    router.replace('/(drawer)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Celebration Icon */}
        <View style={styles.iconContainer}>
          <PartyPopper size={64} color={colors.green.primary} />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Gotowe! 🎉</Text>
          <Text style={styles.subtitle}>
            Wszystko przygotowane.{'\n'}
            Czas zaplanować pierwszą podróż!
          </Text>

          {/* Selected interests summary */}
          {selectedInterests.length > 0 && (
            <View style={styles.interestsSummary}>
              <Text style={styles.interestsLabel}>Twoje zainteresowania:</Text>
              <Text style={styles.interestsList}>
                {selectedInterests.join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* CTA Button */}
        <GradientButton
          label="Rozpocznij przygodę"
          icon={Sparkles}
          onPress={handleStart}
          fullWidth
        />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={1} />
        <Text style={styles.progressText}>4 z 4</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    padding: layout.screenPadding,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.green.soft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing[8],
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  title: {
    ...typography.styles.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  interestsSummary: {
    marginTop: spacing[6],
    padding: spacing[4],
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.md,
    width: '100%',
  },
  interestsLabel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
  },
  interestsList: {
    ...typography.styles.bodySmall,
    color: colors.green.primary,
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


