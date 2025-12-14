import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Step, isTransferStep } from '@/types/step';
import { colors, spacing, typography, layout } from '@/theme';
import { Navigation, ArrowRight, Clock, CheckCircle, MapPin } from 'lucide-react-native';
import { Button } from '@/components/ui';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface FocusViewProps {
  activeStep: Step | null;
  nextStep?: Step | null;
  onNavigate: (step: Step) => void;
  onComplete?: (step: Step) => void;
}

export function FocusView({ activeStep, nextStep, onNavigate, onComplete }: FocusViewProps) {
  if (!activeStep) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Brak aktywnych kroków na ten moment.</Text>
      </View>
    );
  }

  const isTransfer = isTransferStep(activeStep);
  const timeDisplay = activeStep.planned_start || '--:--';
  
  // Determine title
  const title = isTransfer 
    ? `Transfer: ${activeStep.move_mode}`
    : (activeStep as any).place_id ? 'Zwiedzanie' : 'Aktywność'; // Simplified, ideally fetch place name

  // Notes
  const notes = activeStep.notes || (isTransfer ? `Szacowany czas: ${activeStep.est_duration_min} min` : '');

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.delay(100)} style={styles.mainCard}>
        <LinearGradient
          colors={['#1E293B', '#0F172A']}
          style={styles.gradient}
        >
          <View style={styles.headerRow}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>TERAZ</Text>
            </View>
            <Text style={styles.timeText}>{timeDisplay}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.stepTitle}>
              {(activeStep as any).place_id || title}
            </Text>
            <Text style={styles.stepNotes}>{notes}</Text>
          </View>

          <View style={styles.actions}>
            <Button
              label="Nawiguj"
              icon={Navigation}
              onPress={() => onNavigate(activeStep)}
              variant="primary"
              fullWidth
            />
            {onComplete && (
              <TouchableOpacity style={styles.completeButton} onPress={() => onComplete(activeStep)}>
                <CheckCircle size={20} color={colors.text.secondary} />
                <Text style={styles.completeText}>Oznacz jako wykonane</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {nextStep && (
        <Animated.View entering={FadeInDown.delay(300)} style={styles.nextCard}>
          <View style={styles.nextHeader}>
            <Text style={styles.nextLabel}>NASTĘPNIE</Text>
            <Text style={styles.nextTime}>{nextStep.planned_start}</Text>
          </View>
          <View style={styles.nextContent}>
            <Text style={styles.nextTitle} numberOfLines={1}>
              {(nextStep as any).place_id || (isTransferStep(nextStep) ? `Transfer: ${nextStep.move_mode}` : 'Aktywność')}
            </Text>
            <ArrowRight size={16} color={colors.text.secondary} />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: layout.screenPadding,
    justifyContent: 'center',
    gap: spacing[4],
  },
  emptyText: {
    ...typography.styles.h3,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  mainCard: {
    width: '100%',
    aspectRatio: 0.85,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: colors.accent.primary, // Glow effect
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    padding: spacing[6],
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)', // Red tint
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.semantic.error,
  },
  liveText: {
    ...typography.styles.caption,
    color: colors.semantic.error,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timeText: {
    ...typography.styles.h1, // Huge time
    fontSize: 42,
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing[2],
  },
  stepTitle: {
    ...typography.styles.h1,
    fontSize: 32,
    color: '#FFFFFF',
    lineHeight: 40,
  },
  stepNotes: {
    ...typography.styles.body,
    fontSize: 18,
    color: colors.text.secondary,
  },
  actions: {
    gap: spacing[4],
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[2],
  },
  completeText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  nextCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 24,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  nextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  nextLabel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  nextTime: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  nextContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing[2],
  },
});

