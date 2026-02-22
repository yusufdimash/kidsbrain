import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../../constants/theme';

interface WaypointDotProps {
  x: number;
  y: number;
  order: number;
  reached: boolean;
  size?: number;
}

export default function WaypointDot({
  x,
  y,
  order,
  reached,
  size = 28,
}: WaypointDotProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    if (reached) {
      scale.value = withSequence(
        withSpring(1.5, { damping: 6, stiffness: 200 }),
        withSpring(0, { damping: 15, stiffness: 150 })
      );
      opacity.value = withTiming(0, { duration: 400 });
    }
  }, [reached]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: reached ? COLORS.success : '#FFFFFF',
          borderColor: reached ? COLORS.success : '#B0B0B0',
        },
        animatedStyle,
      ]}
    >
      <Text style={[styles.number, { fontSize: size * 0.45 }]}>
        {order + 1}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  number: {
    fontWeight: '700',
    color: '#666',
  },
});
