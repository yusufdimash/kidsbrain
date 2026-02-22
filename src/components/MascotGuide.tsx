import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface MascotGuideProps {
  message: string;
  visible?: boolean;
  position?: 'bottom-left' | 'bottom-right';
}

export default function MascotGuide({
  message,
  visible = true,
  position = 'bottom-right',
}: MascotGuideProps) {
  const bounce = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withSpring(1);
      bounce.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 600 }),
          withTiming(0, { duration: 600 })
        ),
        -1,
        true
      );
    } else {
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: bounce.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'bottom-left' ? styles.left : styles.right,
        animatedStyle,
      ]}
    >
      <View style={styles.bubble}>
        <Text style={styles.message}>{message}</Text>
      </View>
      <Text style={styles.mascot}>🦉</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center',
    zIndex: 100,
  },
  left: { left: 16 },
  right: { right: 16 },
  bubble: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
    maxWidth: 180,
    ...SHADOWS.small,
  },
  message: {
    fontSize: 13,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  mascot: {
    fontSize: 48,
  },
});
