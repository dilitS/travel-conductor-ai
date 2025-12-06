import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated as RNAnimated } from 'react-native';
import { Heart } from 'lucide-react-native';
import { colors, spacing, typography } from '@/theme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';

interface VoteButtonProps {
  votes: number;
  isVoted: boolean;
  onPress: () => void;
}

export function VoteButton({ votes, isVoted, onPress }: VoteButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} activeOpacity={0.8}>
      <Animated.View style={animatedStyle}>
        <Heart
          size={20}
          color={isVoted ? colors.semantic.error : colors.text.secondary}
          fill={isVoted ? colors.semantic.error : 'transparent'}
        />
      </Animated.View>
      <Text style={[styles.count, isVoted && styles.votedCount]}>
        {votes}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    padding: spacing[2],
  },
  count: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  votedCount: {
    color: colors.semantic.error,
  },
});

