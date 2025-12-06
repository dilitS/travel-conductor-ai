import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { FeedCard } from '@/components/social';
import { SharedPlan } from '@/types/user';

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
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing[3],
    gap: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
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

