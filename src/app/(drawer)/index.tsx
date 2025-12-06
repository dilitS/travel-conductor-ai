import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { TripCard } from '@/components/trip/TripCard';
import { FAB } from '@/components/ui';
import { useTrips } from '@/hooks';
import { Trip } from '@/types/trip';
import { Map } from 'lucide-react-native';

// Demo trip to Krakow - complete 5-day plan for testing
const KRAKOW_TRIP_ID = 'krakow_demo_trip';

const DEMO_TRIPS: Trip[] = [
  {
    id: KRAKOW_TRIP_ID,
    user_id: 'demo',
    destination: 'Kraków',
    start_date: '2025-12-10',
    end_date: '2025-12-14',
    transport_mode: 'pociąg',
    budget_level: 'średni',
    people: { adults: 2, children: 0 },
    interests: ['historia', 'kultura', 'jedzenie', 'architektura'],
    timezone: 'Europe/Warsaw',
    status: 'in_progress',
    is_published: false,
    created_at: '2025-12-06T10:00:00.000Z',
    updated_at: '2025-12-06T10:00:00.000Z',
  },
];

export default function MyTripsScreen() {
  const { trips, isLoading } = useTrips();
  const router = useRouter();

  // Use demo Krakow trip if real trips are empty (for UI dev & testing)
  const displayTrips = trips.length > 0 ? trips : DEMO_TRIPS;

  const handleCreateTrip = () => {
    router.push('/creator');
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconBg}>
        <Map size={32} color={colors.green.primary} />
      </View>
      <Text style={styles.emptyTitle}>Brak zaplanowanych podróży</Text>
      <Text style={styles.emptyText}>
        Rozpocznij nową przygodę używając kreatora AI!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={displayTrips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            onPress={(id) => router.push(`/trip/${id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />

      <FAB onPress={handleCreateTrip} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    padding: layout.screenPadding,
    paddingBottom: 100, // Space for FAB
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  emptyTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 250,
  },
});

