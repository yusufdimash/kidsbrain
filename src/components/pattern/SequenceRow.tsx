import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface SequenceRowProps {
  sequence: string[];
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

function SequenceItem({ emoji }: { emoji: string }) {
  return (
    <View style={styles.itemBox}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
}

function MissingSlot({
  selectedAnswer,
  isCorrect,
}: {
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}) {
  // Pulsing border animation for the empty slot
  const pulseScale = useSharedValue(1);
  const borderOpacity = useSharedValue(0.4);

  // Slide-in animation for when an answer is placed
  const answerScale = useSharedValue(0);
  const answerOpacity = useSharedValue(0);

  useEffect(() => {
    if (!selectedAnswer) {
      // Pulse when waiting for answer
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      borderOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      // Stop pulsing
      cancelAnimation(pulseScale);
      cancelAnimation(borderOpacity);
      pulseScale.value = withTiming(1, { duration: 200 });
      borderOpacity.value = withTiming(1, { duration: 200 });

      // Animate answer sliding in
      answerScale.value = withSpring(1, { damping: 10, stiffness: 180 });
      answerOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [selectedAnswer]);

  const slotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    borderColor:
      isCorrect === true
        ? COLORS.success
        : isCorrect === false
          ? COLORS.error
          : COLORS.orange,
    borderWidth: 3,
    opacity: borderOpacity.value + 0.3, // keep minimum opacity
  }));

  const answerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: answerScale.value }],
    opacity: answerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.missingSlot, slotAnimatedStyle]}>
      {selectedAnswer ? (
        <Animated.Text style={[styles.emoji, answerAnimatedStyle]}>
          {selectedAnswer}
        </Animated.Text>
      ) : (
        <Text style={styles.questionMark}>?</Text>
      )}
    </Animated.View>
  );
}

export default function SequenceRow({
  sequence,
  selectedAnswer,
  isCorrect,
}: SequenceRowProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {sequence.map((item, index) => {
          if (item === '?') {
            return (
              <MissingSlot
                key={`missing-${index}`}
                selectedAnswer={selectedAnswer}
                isCorrect={isCorrect}
              />
            );
          }
          return <SequenceItem key={`item-${index}`} emoji={item} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  itemBox: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  missingSlot: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    ...SHADOWS.small,
  },
  emoji: {
    fontSize: 30,
  },
  questionMark: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textLight,
  },
});
