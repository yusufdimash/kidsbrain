import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { LetterDef } from '../../data/letterData';

interface LetterCardProps {
  letter: LetterDef;
  onPress?: (letter: LetterDef) => void;
  size?: number;
}

export default function LetterCard({
  letter,
  onPress,
  size = 120,
}: LetterCardProps) {
  const scale = useSharedValue(1);
  const [showWord, setShowWord] = useState(false);

  const handlePress = useCallback(() => {
    // Bounce animation
    scale.value = withSequence(
      withSpring(1.2, { damping: 8, stiffness: 300 }),
      withSpring(0.9, { damping: 8, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    setShowWord(true);

    // Hide word after a moment
    setTimeout(() => setShowWord(false), 2000);

    onPress?.(letter);
  }, [letter, onPress, scale]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    // Only reset if not in bounce animation
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
    >
      <Animated.View
        style={[
          styles.card,
          {
            width: size,
            height: size + 30,
            backgroundColor: letter.color,
          },
          animatedStyle,
        ]}
      >
        <Text style={[styles.letter, { fontSize: size * 0.45 }]}>
          {letter.letter}
        </Text>

        {showWord ? (
          <View style={styles.wordContainer}>
            <Text style={styles.word}>
              {letter.word} {letter.emoji}
            </Text>
            <Text style={styles.wordEn}>{letter.wordEn}</Text>
          </View>
        ) : (
          <View style={styles.wordContainer}>
            <Text style={styles.emoji}>{letter.emoji}</Text>
            <Text style={styles.phonics}>/{letter.phonics}/</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  letter: {
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  wordContainer: {
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  phonics: {
    fontSize: 12,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  word: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  wordEn: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
