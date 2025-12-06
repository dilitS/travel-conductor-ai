/**
 * OfferCard Component - Card displaying an affiliate offer
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Image } from 'expo-image';
import { ExternalLink, Ticket, Hotel, MapPin, Utensils, Car, Shield } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { Offer, OfferType, formatPrice } from '@/types/offer';

interface OfferCardProps {
  offer: Offer;
}

/**
 * Get icon for offer type
 */
function getOfferIcon(type: OfferType) {
  switch (type) {
    case 'ticket':
      return Ticket;
    case 'hotel':
      return Hotel;
    case 'tour':
      return MapPin;
    case 'restaurant':
      return Utensils;
    case 'transfer':
      return Car;
    case 'insurance':
      return Shield;
    default:
      return Ticket;
  }
}

/**
 * Get type label in Polish
 */
function getTypeLabel(type: OfferType): string {
  switch (type) {
    case 'ticket':
      return 'Bilet';
    case 'hotel':
      return 'Nocleg';
    case 'tour':
      return 'Wycieczka';
    case 'restaurant':
      return 'Restauracja';
    case 'transfer':
      return 'Transfer';
    case 'insurance':
      return 'Ubezpieczenie';
    default:
      return type;
  }
}

// Default image for offers
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400&auto=format&fit=crop';

export function OfferCard({ offer }: OfferCardProps) {
  const Icon = getOfferIcon(offer.type);
  const typeLabel = getTypeLabel(offer.type);
  const priceText = formatPrice(offer.price_snapshot);

  async function handlePress() {
    try {
      const canOpen = await Linking.canOpenURL(offer.url);
      if (canOpen) {
        await Linking.openURL(offer.url);
      } else {
        Alert.alert('Błąd', 'Nie można otworzyć tego linku');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Błąd', 'Wystąpił problem przy otwieraniu linku');
    }
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <Image
        source={{ uri: offer.thumbnail_url || DEFAULT_IMAGE }}
        style={styles.image}
        contentFit="cover"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={200}
      />
      
      {/* Type Badge */}
      <View style={styles.typeBadge}>
        <Icon size={12} color={colors.background.primary} />
        <Text style={styles.typeBadgeText}>{typeLabel}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {offer.title}
        </Text>
        
        {offer.subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {offer.subtitle}
          </Text>
        )}

        {/* Price & Provider */}
        <View style={styles.footer}>
          <Text style={styles.price}>{priceText}</Text>
          <View style={styles.providerBadge}>
            <Text style={styles.providerText}>{offer.provider}</Text>
            <ExternalLink size={10} color={colors.text.tertiary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
  },
  typeBadge: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green.primary,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: layout.radius.sm,
    gap: 4,
  },
  typeBadgeText: {
    ...typography.styles.caption,
    color: colors.background.primary,
    fontWeight: '600',
  },
  content: {
    padding: spacing[3],
  },
  title: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...typography.styles.body,
    color: colors.green.primary,
    fontWeight: '700',
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  providerText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textTransform: 'capitalize',
  },
});

