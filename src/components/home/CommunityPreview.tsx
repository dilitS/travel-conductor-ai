import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Star, Copy, ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography, layout, shadows } from '@/theme';
import { SectionHeader, Button } from '@/components/ui';
import { SharedPlan } from '@/types/user';

interface CommunityPreviewProps {
  plans: SharedPlan[];
  onPlanPress: (planId: string) => void;
  onSeeMore: () => void;
}

// Default placeholder image for plans
const DEFAULT_PLAN_IMAGE = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=200&auto=format&fit=crop';

// Demo data for when no plans are available
const DEMO_PLANS: SharedPlan[] = [
  {
    id: 'demo-1',
    original_trip_id: 'trip-1',
    author_id: 'user-1',
    author_display_name: 'Anna K.',
    destination: 'Weekend w Lizbonie',
    duration_days: 3,
    vote_count: 234,
    published_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    original_trip_id: 'trip-2',
    author_id: 'user-2',
    author_display_name: 'Marek W.',
    destination: 'Tydzień w Barcelonie',
    duration_days: 7,
    vote_count: 187,
    published_at: new Date().toISOString(),
  },
];

export function CommunityPreview({ plans, onPlanPress, onSeeMore }: CommunityPreviewProps) {
  // Use demo data if no plans provided
  const displayPlans = plans.length > 0 ? plans.slice(0, 2) : DEMO_PLANS;

  return (
    <View style={styles.container}>
      <SectionHeader
        title="Ze społeczności 💡"
        rightAction={
          <Button
            label="Zobacz więcej"
            variant="ghost"
            size="sm"
            icon={ChevronRight}
            onPress={onSeeMore}
          />
        }
      />

      <View style={styles.plansContainer}>
        {displayPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => onPlanPress(plan.id)}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: DEFAULT_PLAN_IMAGE }}
              style={styles.planImage}
              contentFit="cover"
              transition={200}
            />
            
            <View style={styles.planInfo}>
              <Text style={styles.planTitle} numberOfLines={1}>
                {plan.destination}
              </Text>
              <Text style={styles.planAuthor}>
                przez {plan.author_display_name}
              </Text>
              
              <View style={styles.planStats}>
                <View style={styles.statItem}>
                  <Star size={14} color={colors.semantic.warning} fill={colors.semantic.warning} />
                  <Text style={styles.statText}>{plan.vote_count}</Text>
                </View>
                <View style={styles.statItem}>
                  <Copy size={14} color={colors.text.tertiary} />
                  <Text style={styles.statText}>{plan.duration_days} dni</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[6],
  },
  plansContainer: {
    gap: spacing[3],
  },
  planCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.md,
    padding: spacing[3],
    ...shadows.sm,
  },
  planImage: {
    width: 60,
    height: 60,
    borderRadius: layout.radius.sm,
  },
  planInfo: {
    flex: 1,
    marginLeft: spacing[3],
    justifyContent: 'center',
  },
  planTitle: {
    ...typography.styles.bodySmall,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing[0.5],
  },
  planAuthor: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginBottom: spacing[1],
  },
  planStats: {
    flexDirection: 'row',
    gap: spacing[4],
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  statText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
});




