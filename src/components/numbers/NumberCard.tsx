import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { NumberDef } from '../../data/numberData';

interface NumberCardProps {
  number: NumberDef;
  onPress?: (num: NumberDef) => void;
  size?: number;
}

export default function NumberCard({
  number,
  onPress,
  size = 120,
}: NumberCardProps) {
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    // Bounce animation
    scale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 300 }),
      withSpring(0.9, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    onPress?.(number);
  }, [number, onPress, scale]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={handlePress} onPressIn={handlePressIn}>
      <Animated.View
        style={[
          styles.card,
          {
            width: size,
            height: size + 30,
            backgroundColor: number.color,
          },
          animatedStyle,
        ]}
      >
        <Text style={[styles.number, { fontSize: size * 0.4 }]}>
          {number.value}
        </Text>

        <View style={styles.wordContainer}>
          <Text style={styles.word}>{number.word}</Text>
          <Text style={styles.wordEn}>{number.wordEn}</Text>
        </View>

        <Text style={styles.emoji}>{number.emoji}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    ...SHADOWS.medium,
  },
  number: {
    fontWeight: '900',
    color: COLORS.text,
  },
  wordContainer: {
    alignItems: 'center',
    marginTop: 2,
  },
  word: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  wordEn: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 20,
    marginTop: 2,
  },
});
