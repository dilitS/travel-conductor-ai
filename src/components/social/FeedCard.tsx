import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Calendar } from 'lucide-react-native';
import { colors, spacing, typography, layout, shadows } from '@/theme';
import { SharedPlan } from '@/types/user';
import { Avatar, Button } from '@/components/ui';
import { VoteButton } from './VoteButton';

// Extended plan with UI-specific fields
interface FeedPlan extends SharedPlan {
  imageUrl?: string;
  isVoted: boolean;
}

interface FeedCardProps {
  plan: FeedPlan;
  onPress: () => void;
  onVote: () => void;
}

// Default placeholder image
const DEFAULT_PLAN_IMAGE = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop';

export function FeedCard({ plan, onPress, onVote }: FeedCardProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar url={plan.author_photo_url} name={plan.author_display_name} size={32} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{plan.author_display_name}</Text>
          <Text style={styles.time}>2 godz. temu</Text>
        </View>
      </View>

      {/* Hero Image */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.heroContainer}>
        <Image
          source={{ uri: plan.imageUrl || DEFAULT_PLAN_IMAGE }}
          style={styles.image}
          contentFit="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />
        <View style={styles.heroContent}>
          <Text style={styles.title}>{plan.destination}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={14} color={colors.text.secondary} />
              <Text style={styles.metaText}>{plan.destination}</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={14} color={colors.text.secondary} />
              <Text style={styles.metaText}>{plan.duration_days} dni</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <VoteButton votes={plan.vote_count} isVoted={plan.isVoted} onPress={onVote} />
        
        <Button
          label="Zobacz plan"
          variant="outline"
          size="sm"
          onPress={onPress}
          style={styles.viewButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
    marginBottom: spacing[4],
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
  },
  authorInfo: {
    marginLeft: spacing[3],
  },
  authorName: {
    ...typography.styles.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
  },
  time: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[4],
  },
  title: {
    ...typography.styles.h3,
    color: '#FFFFFF',
    marginBottom: spacing[1],
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  viewButton: {
    borderColor: colors.green.primary,
  },
});

