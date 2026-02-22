import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BoardCard } from '../../data/memoryCardData';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';

interface FlipCardProps {
  card: BoardCard;
  isFlipped: boolean;
  isMatched: boolean;
  onPress: (boardIndex: number) => void;
  size: number;
}

export default function FlipCard({
  card,
  isFlipped,
  isMatched,
  onPress,
  size,
}: FlipCardProps) {
  // 0 = face-down, 1 = face-up
  const flipProgress = useSharedValue(0);
  const matchScale = useSharedValue(1);

  // Drive flip animation whenever isFlipped or isMatched change.
  useEffect(() => {
    flipProgress.value = withSpring(isFlipped || isMatched ? 1 : 0, {
      damping: 14,
      stiffness: 90,
      mass: 0.8,
    });
  }, [isFlipped, isMatched]);

  // Matched glow / scale pulse.
  useEffect(() => {
    if (isMatched) {
      matchScale.value = withSpring(1.06, {
        damping: 8,
        stiffness: 150,
      });
    } else {
      matchScale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }
  }, [isMatched]);

  // ---------- Animated styles ----------

  // Back of card (the "?" side -- visible when NOT flipped).
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [0, 180]);
    return {
      transform: [
        { perspective: 800 },
        { rotateY: `${rotateY}deg` },
        { scale: matchScale.value },
      ],
      backfaceVisibility: 'hidden' as const,
    };
  });

  // Front of card (emoji side -- visible when flipped).
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return {
      transform: [
        { perspective: 800 },
        { rotateY: `${rotateY}deg` },
        { scale: matchScale.value },
      ],
      backfaceVisibility: 'hidden' as const,
    };
  });

  const handlePress = () => {
    if (isMatched) return;
    onPress(card.boardIndex);
  };

  const cardDimension = size;
  const emojiSize = Math.max(size * 0.42, 20);
  const questionSize = Math.max(size * 0.36, 18);

  return (
    <Pressable onPress={handlePress} style={{ width: cardDimension, height: cardDimension }}>
      {/* Back face ("?") */}
      <Animated.View
        style={[
          styles.face,
          {
            width: cardDimension,
            height: cardDimension,
            backgroundColor: COLORS.memoryMagic,
          },
          backAnimatedStyle,
        ]}
      >
        <Text style={[styles.questionMark, { fontSize: questionSize }]}>?</Text>
      </Animated.View>

      {/* Front face (emoji) */}
      <Animated.View
        style={[
          styles.face,
          styles.frontFace,
          {
            width: cardDimension,
            height: cardDimension,
            backgroundColor: isMatched ? card.color : COLORS.card,
          },
          isMatched && styles.matchedGlow,
          frontAnimatedStyle,
        ]}
      >
        <Text style={{ fontSize: emojiSize }}>{card.emoji}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  frontFace: {
    // Sits on top (same absolute position). backfaceVisibility handled by animated style.
  },
  questionMark: {
    fontWeight: '800',
    color: COLORS.text,
    opacity: 0.5,
  },
  matchedGlow: {
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
});
