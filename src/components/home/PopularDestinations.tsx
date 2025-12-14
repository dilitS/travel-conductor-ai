import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors, spacing, typography, layout } from '@/theme';
import { SectionHeader } from '@/components/ui';

interface PopularDestinationsProps {
  onSelectDestination: (destination: string) => void;
}

// Popular destinations with Unsplash images
const DESTINATIONS = [
  {
    name: 'Rzym',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Paryż',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Barcelona',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Praga',
    image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Lizbona',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Amsterdam',
    image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Wiedeń',
    image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Londyn',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=200&auto=format&fit=crop',
  },
];

export function PopularDestinations({ onSelectDestination }: PopularDestinationsProps) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Popularne teraz 🔥" />
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DESTINATIONS.map((destination) => (
          <TouchableOpacity
            key={destination.name}
            style={styles.destinationItem}
            onPress={() => onSelectDestination(destination.name)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: destination.image }}
              style={styles.destinationImage}
              contentFit="cover"
              transition={200}
            />
            <Text style={styles.destinationName}>{destination.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  scrollContent: {
    gap: spacing[3],
    paddingRight: spacing[4],
  },
  destinationItem: {
    alignItems: 'center',
  },
  destinationImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: spacing[2],
    borderWidth: 2,
    borderColor: colors.background.tertiary,
  },
  destinationName: {
    ...typography.styles.caption,
    color: colors.text.primary,
    fontWeight: '500',
  },
});




