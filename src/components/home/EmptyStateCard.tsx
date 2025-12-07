import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Sparkles } from 'lucide-react-native';
import { colors, spacing, typography, layout, shadows } from '@/theme';
import { Chip, GradientButton } from '@/components/ui';

interface EmptyStateCardProps {
  onCreateTrip: () => void;
  onSelectDestination: (destination: string) => void;
}

// Inspirational travel image
const HERO_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop';

// Popular destinations
const POPULAR_DESTINATIONS = [
  'Rzym',
  'Paryż',
  'Barcelona',
  'Praga',
  'Lizbona',
  'Amsterdam',
  'Wiedeń',
];

export function EmptyStateCard({ onCreateTrip, onSelectDestination }: EmptyStateCardProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: HERO_IMAGE }}
        style={styles.heroImage}
        contentFit="cover"
        transition={300}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Dokąd chcesz pojechać?</Text>
        <Text style={styles.subtitle}>
          Wybierz popularną destynację lub stwórz własny plan
        </Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {POPULAR_DESTINATIONS.map((destination) => (
            <Chip
              key={destination}
              label={destination}
              onPress={() => onSelectDestination(destination)}
            />
          ))}
        </ScrollView>
        
        <GradientButton
          label="Zaplanuj z AI"
          icon={Sparkles}
          onPress={onCreateTrip}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
    marginBottom: spacing[4],
    ...shadows.card,
  },
  heroImage: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: spacing[5],
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  subtitle: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing[2],
    paddingBottom: spacing[4],
  },
});


