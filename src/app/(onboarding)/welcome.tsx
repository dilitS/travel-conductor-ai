import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { GradientButton, ProgressBar } from '@/components/ui';

// Welcome illustration
const WELCOME_IMAGE = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNext = () => {
    router.push('/(onboarding)/features');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: WELCOME_IMAGE }}
            style={styles.image}
            contentFit="cover"
            transition={300}
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Witaj w TravelAI Guide</Text>
          <Text style={styles.subtitle}>
            Twój osobisty przewodnik podróży z AI.{'\n'}
            Planuj, odkrywaj i zwiedzaj z głosowym asystentem.
          </Text>
        </View>

        {/* CTA Button */}
        <GradientButton
          label="Dalej"
          onPress={handleNext}
          fullWidth
        />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <ProgressBar progress={0.25} />
        <Text style={styles.progressText}>1 z 4</Text>
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
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: spacing[8],
    borderWidth: 4,
    borderColor: colors.green.primary,
  },
  image: {
    width: '100%',
    height: '100%',
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


