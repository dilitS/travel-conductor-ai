import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { SectionHeader } from '@/components/ui';
import { HeroCTACard, NearestTripCard, EmptyStateCard, PopularDestinations, CommunityPreview } from '@/components/home';
import { useAuth } from '@/hooks';
import { useTripStore, getActiveTrip, getUpcomingTrips } from '@/stores/tripStore';
import { SharedPlan } from '@/types/user';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { trips, fetchTrips, isLoading } = useTripStore();

  // Fetch trips on mount
  useEffect(() => {
    if (user?.uid) {
      fetchTrips(user.uid);
    }
  }, [user?.uid]);

  // Get the most relevant trip (active or upcoming)
  const activeTrip = getActiveTrip(trips);
  const upcomingTrips = getUpcomingTrips(trips);
  const nearestTrip = activeTrip || upcomingTrips[0];

  // Get user's first name for personalized greeting
  const firstName = user?.display_name?.split(' ')[0] || 'Podróżniku';

  const handleCreateTrip = () => {
    router.push('/creator');
  };

  const handleSelectDestination = (destination: string) => {
    // Navigate to creator with pre-selected destination
    router.push({
      pathname: '/creator',
      params: { destination },
    });
  };

  const handleContinueTrip = () => {
    if (nearestTrip) {
      router.push(`/trip/${nearestTrip.id}`);
    }
  };

  const handleVoiceGuide = () => {
    if (nearestTrip) {
      router.push(`/trip/${nearestTrip.id}/voice-guide`);
    }
  };

  const handlePlanPress = (planId: string) => {
    router.push(`/shared/${planId}`);
  };

  const handleSeeMoreCommunity = () => {
    router.push('/(tabs)/community');
  };

  // Empty plans array - will be populated from Firestore in future
  const communityPlans: SharedPlan[] = [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personalized Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Cześć, {firstName}! 👋</Text>
          <Text style={styles.subGreeting}>Gotowy na nową przygodę?</Text>
        </View>

        {/* Hero CTA Card */}
        <HeroCTACard onPress={handleCreateTrip} />

        {/* Trip Section */}
        <SectionHeader
          title={nearestTrip ? 'Twoja podróż' : 'Rozpocznij przygodę'}
          subtitle={nearestTrip ? 'Kontynuuj planowanie' : 'Wybierz destynację'}
        />

        {nearestTrip ? (
          <NearestTripCard
            trip={nearestTrip}
            onContinue={handleContinueTrip}
            onVoiceGuide={handleVoiceGuide}
          />
        ) : (
          <EmptyStateCard
            onCreateTrip={handleCreateTrip}
            onSelectDestination={handleSelectDestination}
          />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingTop: spacing[4],
    paddingBottom: spacing[24], // Space for tab bar
  },
  header: {
    marginBottom: spacing[6],
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
});

