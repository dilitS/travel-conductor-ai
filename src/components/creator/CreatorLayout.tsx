import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { X, ChevronLeft } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { ProgressBar } from '@/components/ui';
import { useCreatorStore } from '@/stores/creatorStore';

interface CreatorLayoutProps {
  title: string;
  children: React.ReactNode;
  showBack?: boolean;
}

export function CreatorLayout({ title, children, showBack = true }: CreatorLayoutProps) {
  const router = useRouter();
  const { currentStep, totalSteps, prevStep, reset } = useCreatorStore();

  const handleBack = () => {
    if (currentStep > 1) {
      prevStep();
      router.back();
    } else {
      // If step 1, back means close? Or just use close button.
      // Usually back on step 1 goes to previous screen (e.g. home)
      router.back();
    }
  };

  const handleClose = () => {
    reset();
    router.dismiss(); // Close modal
  };

  const progress = currentStep / totalSteps;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {showBack && (
                <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                  <ChevronLeft size={24} color={colors.text.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.title}>{title}</Text>
            
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
                <X size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} height={4} />
            <Text style={styles.stepText}>
              Krok {currentStep} z {totalSteps}
            </Text>
          </View>

          <View style={styles.content}>{children}</View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    height: layout.headerHeight,
  },
  headerLeft: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: spacing[1],
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  progressContainer: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing[4],
    gap: spacing[2],
  },
  stepText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPadding,
  },
});

