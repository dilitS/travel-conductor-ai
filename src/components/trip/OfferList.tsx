/**
 * OfferList Component - Horizontal list of offers
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Gift } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { Offer } from '@/types/offer';
import { OfferCard } from './OfferCard';

interface OfferListProps {
  offers: Offer[];
  title?: string;
}

export function OfferList({ offers, title = 'Polecane oferty' }: OfferListProps) {
  if (!offers || offers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Gift size={24} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>Brak ofert dla tego dnia</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View style={styles.header}>
        <Gift size={20} color={colors.green.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {offers.map((offer) => (
          <OfferCard key={offer.offer_id} offer={offer} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing[3],
  },
  emptyContainer: {
    padding: spacing[6],
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});

