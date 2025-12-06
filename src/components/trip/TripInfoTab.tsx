/**
 * TripInfoTab Component
 * Displays destination info, practical tips, emergency numbers, transport
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import {
  Globe,
  Banknote,
  Clock,
  Phone,
  AlertTriangle,
  Bus,
  Thermometer,
  Lightbulb,
  ExternalLink,
  MapPin,
} from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { Trip } from '@/types/trip';

interface DestinationInfo {
  country: string;
  currency: {
    code: string;
    symbol: string;
    exchangeHint?: string;
  };
  language: string;
  timezone: string;
  emergencyNumbers: {
    general: string;
    police: string;
    ambulance: string;
    fire: string;
  };
  embassy?: {
    name: string;
    phone: string;
    address: string;
  };
  weather?: {
    current: string;
    forecast: string;
  };
  publicTransport?: {
    types: string[];
    ticketPrice: string;
    appName?: string;
    appUrl?: string;
  };
  tips: string[];
}

// Destination data (hardcoded for demo, would come from API/DB in production)
const DESTINATION_DATA: Record<string, DestinationInfo> = {
  'Kraków': {
    country: 'Polska',
    currency: {
      code: 'PLN',
      symbol: 'zł',
      exchangeHint: '1 EUR ≈ 4.30 PLN',
    },
    language: 'Polski',
    timezone: 'Europe/Warsaw (CET/CEST)',
    emergencyNumbers: {
      general: '112',
      police: '997',
      ambulance: '999',
      fire: '998',
    },
    embassy: {
      name: 'Konsulat Generalny USA',
      phone: '+48 12 424 5100',
      address: 'ul. Stolarska 9, Kraków',
    },
    weather: {
      current: '2°C, Pochmurno',
      forecast: 'Grudzień: -5°C do 5°C, możliwe opady śniegu',
    },
    publicTransport: {
      types: ['Tramwaj', 'Autobus', 'Szybka Kolej Aglomeracyjna'],
      ticketPrice: 'Bilet 20-min: 4 zł, 60-min: 6 zł',
      appName: 'Jakdojade',
      appUrl: 'https://jakdojade.pl',
    },
    tips: [
      'Komunikacja miejska jest dobrze rozwinięta - tramwaje i autobusy dotrą Cię wszędzie',
      'Warto kupić Kraków Card (2 lub 3 dni) - darmowy transport i zniżki do atrakcji',
      'Obieraczki do ziemniaków są zakazane w bagażu podręcznym na lotnisku (serio!)',
      'Większość atrakcji Starego Miasta jest w zasięgu spaceru - wygodne buty obowiązkowe',
      'Restauracje na Rynku są droższe - 1-2 ulice dalej znajdziesz lepsze ceny',
      'W niedzielę sklepy są zamknięte - planuj zakupy na inne dni',
    ],
  },
};

interface TripInfoTabProps {
  trip: Trip;
}

export function TripInfoTab({ trip }: TripInfoTabProps) {
  const info = DESTINATION_DATA[trip.destination] || null;

  if (!info) {
    return (
      <View style={styles.emptyContainer}>
        <MapPin size={48} color={colors.text.tertiary} />
        <Text style={styles.emptyText}>
          Informacje o {trip.destination} będą dostępne wkrótce
        </Text>
      </View>
    );
  }

  const handleOpenApp = (url: string) => {
    Linking.openURL(url).catch(console.error);
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(console.error);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Basic Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Podstawowe informacje</Text>
        
        <View style={styles.infoGrid}>
          <InfoCard
            icon={Globe}
            label="Kraj"
            value={info.country}
          />
          <InfoCard
            icon={Banknote}
            label="Waluta"
            value={`${info.currency.code} (${info.currency.symbol})`}
            hint={info.currency.exchangeHint}
          />
          <InfoCard
            icon={Globe}
            label="Język"
            value={info.language}
          />
          <InfoCard
            icon={Clock}
            label="Strefa czasowa"
            value={info.timezone}
          />
        </View>
      </View>

      {/* Weather Section */}
      {info.weather && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pogoda</Text>
          <View style={styles.weatherCard}>
            <Thermometer size={24} color={colors.blue.primary} />
            <View style={styles.weatherContent}>
              <Text style={styles.weatherCurrent}>{info.weather.current}</Text>
              <Text style={styles.weatherForecast}>{info.weather.forecast}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Emergency Numbers Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Numery alarmowe</Text>
        <View style={styles.emergencyGrid}>
          <EmergencyButton
            label="Alarm"
            number={info.emergencyNumbers.general}
            isMain
            onPress={() => handleCall(info.emergencyNumbers.general)}
          />
          <EmergencyButton
            label="Policja"
            number={info.emergencyNumbers.police}
            onPress={() => handleCall(info.emergencyNumbers.police)}
          />
          <EmergencyButton
            label="Pogotowie"
            number={info.emergencyNumbers.ambulance}
            onPress={() => handleCall(info.emergencyNumbers.ambulance)}
          />
          <EmergencyButton
            label="Straż"
            number={info.emergencyNumbers.fire}
            onPress={() => handleCall(info.emergencyNumbers.fire)}
          />
        </View>
      </View>

      {/* Public Transport Section */}
      {info.publicTransport && trip.transport_mode !== 'car' && trip.transport_mode !== 'samochód' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transport publiczny</Text>
          <View style={styles.transportCard}>
            <Bus size={24} color={colors.green.primary} />
            <View style={styles.transportContent}>
              <Text style={styles.transportTypes}>
                {info.publicTransport.types.join(' • ')}
              </Text>
              <Text style={styles.transportPrice}>
                {info.publicTransport.ticketPrice}
              </Text>
              {info.publicTransport.appName && (
                <TouchableOpacity
                  style={styles.appLink}
                  onPress={() => handleOpenApp(info.publicTransport?.appUrl || '')}
                >
                  <Text style={styles.appLinkText}>
                    Aplikacja: {info.publicTransport.appName}
                  </Text>
                  <ExternalLink size={14} color={colors.green.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Tips Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Przydatne porady</Text>
        {info.tips.map((tip, index) => (
          <View key={index} style={styles.tipCard}>
            <Lightbulb size={18} color={colors.semantic.warning} style={styles.tipIcon} />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Embassy Section */}
      {info.embassy && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pomoc konsularna</Text>
          <View style={styles.embassyCard}>
            <Text style={styles.embassyName}>{info.embassy.name}</Text>
            <TouchableOpacity
              style={styles.embassyRow}
              onPress={() => handleCall(info.embassy?.phone || '')}
            >
              <Phone size={16} color={colors.text.secondary} />
              <Text style={styles.embassyPhone}>{info.embassy.phone}</Text>
            </TouchableOpacity>
            <View style={styles.embassyRow}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={styles.embassyAddress}>{info.embassy.address}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

// Helper Components
function InfoCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Icon size={20} color={colors.green.primary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
      {hint && <Text style={styles.infoHint}>{hint}</Text>}
    </View>
  );
}

function EmergencyButton({
  label,
  number,
  isMain,
  onPress,
}: {
  label: string;
  number: string;
  isMain?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.emergencyButton, isMain && styles.emergencyButtonMain]}
      onPress={onPress}
    >
      <Phone size={18} color={isMain ? colors.background.primary : colors.semantic.error} />
      <Text style={[styles.emergencyNumber, isMain && styles.emergencyNumberMain]}>
        {number}
      </Text>
      <Text style={[styles.emergencyLabel, isMain && styles.emergencyLabelMain]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
    gap: spacing[4],
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  section: {
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.tertiary,
    borderRadius: layout.radius.md,
    padding: spacing[3],
    gap: spacing[1],
  },
  infoLabel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
  infoValue: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  infoHint: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  weatherCard: {
    flexDirection: 'row',
    backgroundColor: colors.blue.soft,
    borderRadius: layout.radius.md,
    padding: spacing[4],
    gap: spacing[3],
  },
  weatherContent: {
    flex: 1,
  },
  weatherCurrent: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  weatherForecast: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  emergencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  emergencyButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: layout.radius.md,
    padding: spacing[3],
    alignItems: 'center',
    gap: spacing[1],
  },
  emergencyButtonMain: {
    backgroundColor: colors.semantic.error,
  },
  emergencyNumber: {
    ...typography.styles.h3,
    color: colors.semantic.error,
  },
  emergencyNumberMain: {
    color: colors.background.primary,
  },
  emergencyLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  emergencyLabelMain: {
    color: colors.background.primary,
  },
  transportCard: {
    flexDirection: 'row',
    backgroundColor: colors.green.soft,
    borderRadius: layout.radius.md,
    padding: spacing[4],
    gap: spacing[3],
  },
  transportContent: {
    flex: 1,
  },
  transportTypes: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  transportPrice: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  appLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[2],
  },
  appLinkText: {
    ...typography.styles.bodySmall,
    color: colors.green.primary,
    fontWeight: '500',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: layout.radius.md,
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  tipIcon: {
    marginRight: spacing[3],
    marginTop: 2,
  },
  tipText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 22,
  },
  embassyCard: {
    backgroundColor: colors.background.tertiary,
    borderRadius: layout.radius.md,
    padding: spacing[4],
    gap: spacing[2],
  },
  embassyName: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  embassyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  embassyPhone: {
    ...typography.styles.body,
    color: colors.green.primary,
  },
  embassyAddress: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    flex: 1,
  },
  bottomPadding: {
    height: spacing[8],
  },
});

