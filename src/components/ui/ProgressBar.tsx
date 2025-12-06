import React, { useEffect } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, layout } from '@/theme';

interface ProgressBarProps extends ViewProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
}

export function ProgressBar({
  progress,
  color = colors.green.primary,
  height = 4,
  style,
  ...props
}: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(1, progress)) * 100, {
      duration: 500,
    });
  }, [progress, width]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  });

  return (
    <View
      style={[
        styles.container,
        { height, borderRadius: height / 2 },
        style,
      ]}
      {...props}
    >
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: color, borderRadius: height / 2 },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background.tertiary,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

