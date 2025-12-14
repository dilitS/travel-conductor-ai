import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { SectionHeader, GradientBackground, Button } from '@/components/ui';
import { HeroCTACard, EmptyStateCard, PopularDestinations, CommunityPreview } from '@/components/home';
import { TripCard } from '@/components/trip';
import { useAuth } from '@/hooks';
import { useTripStore } from '@/stores/tripStore';
import { SharedPlan } from '@/types/user';
import { seedKrakowTrip } from '@/services/firebase/functions';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { trips, fetchTrips, isLoading } = useTripStore();
  const [isSeeding, setIsSeeding] = useState(false);

  // Fetch trips on mount
  useEffect(() => {
    if (user?.uid) {
      fetchTrips(user.uid);
    }
  }, [user?.uid]);

  // DEV: Seed demo data using Cloud Function
  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      console.log('[DEV] Calling seedKrakowTrip Cloud Function...');
      const result = await seedKrakowTrip();
      console.log('[DEV] Seed result:', result);
      Alert.alert('Sukces!', `Dane demo zostały dodane (trip: ${result.tripId})`);
      // Refetch trips after seeding
      if (user?.uid) {
        fetchTrips(user.uid);
      }
    } catch (error) {
      console.error('Seeding failed:', error);
      Alert.alert('Błąd', `Nie udało się dodać danych demo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Get user's first name for personalized greeting
  const firstName = user?.display_name?.split(' ')[0] || 'Podróżniku';

  const handleCreateTrip = () => {
    router.push('/creator');
  };

  const handleSelectDestination = (destination: string) => {
    router.push({
      pathname: '/creator',
      params: { destination },
    });
  };

  const handleTripPress = (tripId: string) => {
    router.push(`/trip/${tripId}`);
  };

  const handlePlanPress = (planId: string) => {
    router.push(`/shared/${planId}`);
  };

  const handleSeeMoreCommunity = () => {
    router.push('/(main)/community');
  };

  const handleSeeAllTrips = () => {
    router.push('/(main)/trips');
  };

  // Empty plans array - will be populated from Firestore in future
  const communityPlans: SharedPlan[] = [];

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header with Avatar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Cześć, {firstName}! 👋</Text>
            <Text style={styles.subGreeting}>Gotowy na nową przygodę?</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(main)/profile')} activeOpacity={0.8}>
            <Image
              source={user?.photo_url ? { uri: user.photo_url } : { uri: 'https://ui-avatars.com/api/?name=User&background=10B981&color=fff' }}
              style={styles.avatar}
              contentFit="cover"
            />
          </TouchableOpacity>
        </View>

        {/* My Trips Section (Carousel) */}
        {trips.length > 0 ? (
          <View style={styles.myTripsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Twoje podróże</Text>
              <TouchableOpacity onPress={handleSeeAllTrips}>
                <Text style={styles.seeAllText}>Pokaż wszystkie</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              data={trips}
              renderItem={({ item }) => (
                <View style={styles.tripCardWrapper}>
                  <TripCard trip={item} onPress={handleTripPress} />
                </View>
              )}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
            />
          </View>
        ) : (
          /* Empty state hero if no trips */
          <View style={styles.heroSection}>
             <HeroCTACard onPress={handleCreateTrip} />
          </View>
        )}

        {/* DEV: Seed Button - show only if no trips to avoid clutter */}
        {trips.length === 0 && (
          <View style={styles.devSectionTop}>
            <Button
              label={isSeeding ? 'Seedowanie...' : '🧪 Dodaj dane demo Kraków'}
              onPress={handleSeedData}
              variant="outline"
              disabled={isSeeding}
            />
          </View>
        )}

        {/* Create Trip CTA (secondary if has trips) */}
        {trips.length > 0 && (
          <View style={styles.secondaryCta}>
             <Button 
               label="Zaplanuj nową podróż" 
               icon="plus" 
               onPress={handleCreateTrip} 
               variant="secondary"
             />
          </View>
        )}

        {/* Popular Destinations */}
        <PopularDestinations onSelectDestination={handleSelectDestination} />

        {/* Community Preview */}
        <CommunityPreview
          plans={communityPlans}
          onPlanPress={handlePlanPress}
          onSeeMore={handleSeeMoreCommunity}
        />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[8],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[6],
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[4],
  },
  greeting: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  subGreeting: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background.tertiary,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
    paddingHorizontal: layout.screenPadding,
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  seeAllText: {
    ...typography.styles.bodySmall,
    color: colors.green.primary,
    fontWeight: '600',
  },
  myTripsSection: {
    marginBottom: spacing[6],
  },
  carouselContent: {
    paddingHorizontal: layout.screenPadding,
    paddingRight: layout.screenPadding - spacing[4], // Adjust for last item margin
  },
  tripCardWrapper: {
    width: 280,
    marginRight: spacing[4],
  },
  heroSection: {
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[6],
  },
  devSectionTop: {
    marginBottom: spacing[4],
    paddingHorizontal: layout.screenPadding,
  },
  secondaryCta: {
    marginBottom: spacing[6],
    paddingHorizontal: layout.screenPadding,
  },
});

