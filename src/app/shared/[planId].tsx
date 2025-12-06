import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Share as ShareIcon, Copy } from 'lucide-react-native';
import { colors, spacing, layout } from '@/theme';
import { TripHero, DayCarousel, TripTimeline } from '@/components/trip';
import { AuthorBadge, VoteButton } from '@/components/social';
import { Button } from '@/components/ui';
import { Trip, TripDay, Step, VisitStep, Place } from '@/types';

// Dummy Data mirroring Feed with new model
const SHARED_TRIP: Trip = {
  id: 't1',
  user_id: 'u1',
  destination: 'Rzym, Włochy',
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  transport_mode: 'samolot',
  budget_level: 'średni',
  people: { adults: 2, children: 0 },
  interests: ['kultura', 'historia'],
  timezone: 'Europe/Rome',
  status: 'done',
  is_published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const today = new Date().toISOString().split('T')[0];

const SHARED_DAYS: TripDay[] = [
  { 
    id: 'd1', 
    trip_id: 't1',
    day_index: 1, 
    date: today,
    city: 'Rzym',
    theme: 'Starożytny Rzym',
    ui_summary_text: 'Koloseum i Forum Romanum',
    plan_json: {
      day_index: 1,
      city: 'Rzym',
      date: today,
      theme: 'Starożytny Rzym',
      steps: [
        {
          step_id: 'a1',
          type: 'visit',
          place_id: 'p1',
          planned_start: '09:00',
          planned_end: '11:00',
          notes: 'Amfiteatr Flawiuszów',
          status: 'completed',
        } as VisitStep,
        {
          step_id: 'a2',
          type: 'meal',
          planned_start: '13:00',
          planned_end: '14:00',
          place_id: 'p2',
          notes: 'Lokalna pizzeria',
          status: 'completed',
        },
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: 'd2', 
    trip_id: 't1',
    day_index: 2, 
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    city: 'Rzym',
    theme: 'Watykan',
    ui_summary_text: 'Bazylika św. Piotra i Muzea Watykańskie',
    plan_json: { 
      day_index: 2,
      city: 'Rzym',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      theme: 'Watykan',
      steps: [] 
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { 
    id: 'd3', 
    trip_id: 't1',
    day_index: 3, 
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    city: 'Rzym',
    theme: 'Trastevere',
    ui_summary_text: 'Spacer po urokliwej dzielnicy',
    plan_json: { 
      day_index: 3,
      city: 'Rzym',
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      theme: 'Trastevere',
      steps: [] 
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Dummy places
const DUMMY_PLACES: Place[] = [
  {
    id: 'p1',
    trip_id: 't1',
    place_id: 'ROM_COLOSSEUM',
    name: 'Koloseum',
    city: 'Rzym',
    country: 'Włochy',
    lat: 41.8902,
    lon: 12.4922,
    categories: ['atrakcja', 'historia'],
    typical_visit_duration_min: 120,
    trigger_radius_meters: 80,
    notes_json: {
      short_intro: 'Największy amfiteatr starożytnego Rzymu',
      fun_facts: ['Mógł pomieścić 50 000 widzów'],
      what_to_look_at: ['Arena', 'Podziemia'],
      practical_tips: ['Kup bilety online'],
      guide_note_audio: 'Witaj w Koloseum...',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function SharedPlanScreen() {
  const { planId } = useLocalSearchParams();
  const router = useRouter();
  const [activeDayIndex, setActiveDayIndex] = useState(1);
  const [votes, setVotes] = useState(128);
  const [isVoted, setIsVoted] = useState(false);

  // Build places map
  const placesMap = useMemo(() => {
    const map = new Map<string, Place>();
    DUMMY_PLACES.forEach(p => map.set(p.id, p));
    return map;
  }, []);

  const activeDay = SHARED_DAYS.find(d => d.day_index === activeDayIndex);
  const steps = activeDay?.plan_json.steps || [];

  const handleVote = () => {
    setVotes(prev => isVoted ? prev - 1 : prev + 1);
    setIsVoted(!isVoted);
  };

  const handleCopy = () => {
    // Mock copy logic -> navigate to my trips or show success
    console.log('Copy plan', planId);
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <AuthorBadge 
          name="Anna Nowak" 
          avatarUrl="https://ui-avatars.com/api/?name=Anna+Nowak&background=10B981&color=fff"
          subtitle="Podróżnik"
        />
        
        <TouchableOpacity style={styles.iconButton}>
          <ShareIcon size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <TripHero trip={SHARED_TRIP} />
        <DayCarousel 
          days={SHARED_DAYS} 
          activeDayIndex={activeDayIndex} 
          onDayPress={(index) => setActiveDayIndex(index)} 
        />
        <TripTimeline steps={steps} places={placesMap} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.voteContainer}>
          <VoteButton votes={votes} isVoted={isVoted} onPress={handleVote} />
        </View>
        
        <Button
          label="Skopiuj plan"
          icon={Copy}
          variant="primary"
          onPress={handleCopy}
          style={styles.copyButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    height: layout.headerHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  iconButton: {
    padding: spacing[1],
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.secondary,
    paddingBottom: spacing[8],
  },
  voteContainer: {
    marginRight: spacing[4],
  },
  copyButton: {
    flex: 1,
  },
});

