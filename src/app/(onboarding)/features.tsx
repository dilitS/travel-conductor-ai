import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Mic, Users } from 'lucide-react-native';
import { colors, spacing, typography, layout, shadows } from '@/theme';
import { GradientButton, ProgressBar } from '@/components/ui';

// Feature data
const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Planner',
    description: 'Wygeneruj spersonalizowany plan podróży w 5 minut. AI dobierze atrakcje, restauracje i hotele.',
    color: colors.green.primary,
  },
  {
    icon: Mic,
    title: 'Voice Guide',
    description: 'Używaj głosowego przewodnika podczas zwiedzania. Opowieści o miejscach i nawigacja.',
    color: colors.blue.primary,
  },
  {
    icon: Users,
    title: 'Społeczność',
    description: 'Odkrywaj plany innych podróżników. Kopiuj, dostosowuj i dziel się własnymi.',
    color: colors.semantic.warning,
  },
];

export default function FeaturesScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/(onboarding)/interests');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Co możesz robić?</Text>
        <Text style={styles.subtitle}>
          Odkryj główne funkcje TravelAI Guide
        </Text>

        {/* Feature Cards */}
        <View style={styles.cardsContainer}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: `${feature.color}20` }]}>
                <feature.icon size={32} color={feature.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTA Button */}
        <GradientButton
          label="Dalej"
          onPress={handleNext}
          fullWidth
        />
      </ScrollView>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={0.5} />
        <Text style={styles.progressText}>2 z 4</Text>
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
  cardsContainer: {
    gap: spacing[4],
    marginBottom: spacing[8],
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.lg,
    padding: spacing[4],
    ...shadows.sm,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[4],
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  cardDescription: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    lineHeight: 20,
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




