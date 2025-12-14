import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { TripCard } from '@/components/trip/TripCard';
import { FAB, GradientBackground, SectionHeader, HeaderIconButton } from '@/components/ui';
import { useAuth, useTrips } from '@/hooks';
import { usePremium } from '@/hooks/usePremium';
import { PremiumGateModal } from '@/components/subscription';
import { Trip } from '@/types/trip';
import { Map, ChevronLeft } from 'lucide-react-native';

// Temporary dummy data for UI verification
const DUMMY_TRIPS: Trip[] = [
  {
    id: '1',
    user_id: 'test',
    destination: 'Wyprawa w Tatry',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    transport_mode: 'własny',
    budget_level: 'średni',
    people: { adults: 2, children: 0 },
    interests: ['góry', 'przyroda'],
    timezone: 'Europe/Warsaw',
    status: 'in_progress',
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'test',
    destination: 'Weekend w Paryżu',
    start_date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
    transport_mode: 'samolot',
    budget_level: 'luksusowy',
    people: { adults: 2, children: 0 },
    interests: ['kultura', 'jedzenie'],
    timezone: 'Europe/Paris',
    status: 'confirmed',
    is_published: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function MyTripsScreen() {
  const { user } = useAuth();
  const { trips, isLoading } = useTrips();
  const { canCreateTrip } = usePremium();
  const [showPremiumGate, setShowPremiumGate] = React.useState(false);
  const router = useRouter();

  // Use dummy data if real trips are empty (for UI dev)
  const displayTrips = trips.length > 0 ? trips : DUMMY_TRIPS;

  const handleCreateTrip = () => {
    if (!canCreateTrip) {
      setShowPremiumGate(true);
      return;
    }
    router.push('/creator');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <HeaderIconButton onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </HeaderIconButton>
        <Text style={styles.title}>Moje Podróże</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.underline} />
    </View>
  );

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
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
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
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />

        <FAB onPress={handleCreateTrip} />
        
        <PremiumGateModal
          visible={showPremiumGate}
          onClose={() => setShowPremiumGate(false)}
          featureName="Nowa Podróż"
          description="Osiągnięto limit darmowych podróży. Przejdź na Premium, aby tworzyć nielimitowane plany!"
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: layout.screenPadding,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing[6],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  underline: {
    height: 4,
    width: 40,
    backgroundColor: colors.green.primary,
    borderRadius: 2,
    marginLeft: 52, // Align with title (approx)
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
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
