import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Compass, Sparkles } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { GradientButton } from '@/components/ui';

interface HeroCTACardProps {
  onPress: () => void;
}

export function HeroCTACard({ onPress }: HeroCTACardProps) {
  return (
    <LinearGradient
      colors={[colors.green.pale, colors.background.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.iconContainer}>
        <Compass size={48} color={colors.green.primary} strokeWidth={1.5} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>Zaplanuj podróż z AI</Text>
        <Text style={styles.subtitle}>w 5 minut</Text>
      </View>
      
      <GradientButton
        label="Rozpocznij"
        icon={Sparkles}
        onPress={onPress}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[6],
    borderRadius: layout.radius.xl,
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.green.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.styles.bodySmall,
    color: colors.green.primary,
    marginTop: spacing[1],
  },
});


