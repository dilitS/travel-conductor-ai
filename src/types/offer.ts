/**
 * Offer types for affiliate links
 * Based on docs/db-project.md
 */

// Offer type options
export type OfferType = 'ticket' | 'hotel' | 'tour' | 'restaurant' | 'transfer' | 'insurance';

// Provider options
export type OfferProvider = 'tiqets' | 'getyourguide' | 'booking' | 'airbnb' | 'viator' | 'other';

/**
 * Link to specific step/place in the trip
 */
export interface LinkedTo {
  day_index: number;
  step_id?: string;
  place_id?: string;
}

/**
 * Price snapshot at time of creation
 */
export interface PriceSnapshot {
  amount: number;
  currency: string; // ISO 4217 (EUR, USD, PLN)
  per: 'person' | 'group' | 'night' | 'item';
}

/**
 * Offer document - affiliate link to external service
 */
export interface Offer {
  offer_id: string;
  type: OfferType;
  linked_to: LinkedTo;
  provider: OfferProvider;
  provider_offer_id?: string; // External ID from provider
  title: string;
  subtitle?: string;
  price_snapshot: PriceSnapshot;
  url: string; // Affiliate link
  thumbnail_url?: string;
  created_at: string; // ISO timestamp
}

/**
 * Offer for creating
 */
export interface OfferCreate {
  type: OfferType;
  linked_to: LinkedTo;
  provider: OfferProvider;
  provider_offer_id?: string;
  title: string;
  subtitle?: string;
  price_snapshot: PriceSnapshot;
  url: string;
  thumbnail_url?: string;
}

/**
 * Format price for display
 */
export function formatPrice(price: PriceSnapshot): string {
  const currencySymbols: Record<string, string> = {
    EUR: '€',
    USD: '$',
    PLN: 'zł',
    GBP: '£',
  };
  
  const symbol = currencySymbols[price.currency] || price.currency;
  const perText = price.per === 'person' ? '/os.' : 
                  price.per === 'night' ? '/noc' :
                  price.per === 'group' ? '/grupa' : '';
  
  return `${price.amount} ${symbol}${perText}`;
}

