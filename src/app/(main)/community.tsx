import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { FeedCard } from '@/components/social';
import { GradientBackground, HeaderIconButton } from '@/components/ui';
import { SharedPlan } from '@/types/user';
import { ChevronLeft } from 'lucide-react-native';

const FILTER_TABS = ['Nowe', 'Popularne', 'Top'];

// Extended SharedPlan for UI display (includes image and vote state)
interface FeedItem extends SharedPlan {
  imageUrl?: string;
  isVoted: boolean;
}

const DUMMY_FEED: FeedItem[] = [
  {
    id: '1',
    original_trip_id: 't1',
    author_id: 'u1',
    author_display_name: 'Anna Nowak',
    destination: 'Rzym, Włochy',
    duration_days: 3,
    vote_count: 128,
    published_at: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2596&auto=format&fit=crop',
    isVoted: false,
  },
  {
    id: '2',
    original_trip_id: 't2',
    author_id: 'u2',
    author_display_name: 'Piotr Kowalski',
    destination: 'Tokio, Japonia',
    duration_days: 14,
    vote_count: 856,
    published_at: new Date().toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2670&auto=format&fit=crop',
    isVoted: true,
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Nowe');
  const [feed, setFeed] = useState(DUMMY_FEED);

  const handleVote = (id: string) => {
    setFeed(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          vote_count: item.isVoted ? item.vote_count - 1 : item.vote_count + 1,
          isVoted: !item.isVoted
        };
      }
      return item;
    }));
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <HeaderIconButton onPress={() => router.back()}>
              <ChevronLeft size={24} color={colors.text.primary} />
            </HeaderIconButton>
            <Text style={styles.title}>Odkryj</Text>
            <View style={{ width: 40 }} />
          </View>
          <View style={styles.underline} />
        </View>

        <View style={styles.tabsContainer}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeedCard
            plan={item}
            onPress={() => router.push(`/shared/${item.id}`)}
            onVote={() => handleVote(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[4],
    marginBottom: spacing[4],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  underline: {
    height: 4,
    width: 40,
    backgroundColor: colors.green.primary,
    borderRadius: 2,
    marginLeft: 52, // Align with title
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPadding,
    marginBottom: spacing[4],
    gap: spacing[4],
  },
  tab: {
    paddingBottom: spacing[2],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.green.primary,
  },
  tabText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.text.primary,
  },
  listContent: {
    padding: layout.screenPadding,
    paddingBottom: 100,
  },
});
