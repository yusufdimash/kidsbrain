import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, SPACING } from '../constants/theme';

interface StarRewardProps {
  stars: number; // 1-3
  size?: number;
  animate?: boolean;
}

function Star({
  filled,
  index,
  size,
  animate,
}: {
  filled: boolean;
  index: number;
  size: number;
  animate: boolean;
}) {
  const scale = useSharedValue(animate ? 0 : 1);

  useEffect(() => {
    if (animate && filled) {
      scale.value = withDelay(
        index * 300,
        withSpring(1, { damping: 8, stiffness: 150 })
      );
    }
  }, [animate, filled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.starWrapper, animatedStyle]}>
      <Text style={[styles.star, { fontSize: size }]}>
        {filled ? '⭐' : '☆'}
      </Text>
    </Animated.View>
  );
}

export default function StarReward({
  stars,
  size = 40,
  animate = true,
}: StarRewardProps) {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          filled={i < stars}
          index={i}
          size={size}
          animate={animate}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  starWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    color: COLORS.star,
  },
});
