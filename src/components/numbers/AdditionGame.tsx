import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { S } from '../../constants/strings';
import { useSound } from '../../hooks/useSound';

interface AdditionGameProps {
  a: number;
  b: number;
  options: number[];
  emoji?: string;
  onComplete: (correct: boolean) => void;
}

function EmojiGroup({ count, emoji }: { count: number; emoji: string }) {
  return (
    <View style={styles.emojiGroup}>
      {Array.from({ length: count }).map((_, i) => (
        <Text key={i} style={styles.groupEmoji}>
          {emoji}
        </Text>
      ))}
    </View>
  );
}

function AnswerButton({
  value,
  onPress,
  state,
}: {
  value: number;
  onPress: (v: number) => void;
  state: 'default' | 'correct' | 'wrong';
}) {
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    scale.value = withSequence(
      withSpring(0.85, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
    onPress(value);
  }, [value, onPress, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      disabled={state !== 'default'}
    >
      <Animated.View
        style={[
          styles.answerButton,
          state === 'correct' && styles.answerCorrect,
          state === 'wrong' && styles.answerWrong,
          animatedStyle,
        ]}
      >
        <Text
          style={[
            styles.answerText,
            state !== 'default' && styles.answerTextSelected,
          ]}
        >
          {value}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function AdditionGame({
  a,
  b,
  options,
  emoji = '⭐',
  onComplete,
}: AdditionGameProps) {
  const sound = useSound();
  const correctAnswer = a + b;
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isResolved, setIsResolved] = useState(false);

  // Animate the question mark
  const questionScale = useSharedValue(1);

  // Pulse the question mark
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isResolved) {
        questionScale.value = withSequence(
          withSpring(1.15, { damping: 10, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        );
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isResolved, questionScale]);

  const questionStyle = useAnimatedStyle(() => ({
    transform: [{ scale: questionScale.value }],
  }));

  const handleAnswer = useCallback(
    (answer: number) => {
      if (isResolved) return;

      setSelectedAnswer(answer);
      setIsResolved(true);

      if (answer === correctAnswer) {
        sound.playSuccess();
        questionScale.value = withSequence(
          withSpring(1.3, { damping: 6, stiffness: 200 }),
          withSpring(1, { damping: 10, stiffness: 150 })
        );
        setTimeout(() => onComplete(true), 1200);
      } else {
        sound.playError();
        setTimeout(() => onComplete(false), 1200);
      }
    },
    [correctAnswer, isResolved, sound, onComplete, questionScale]
  );

  const getButtonState = (value: number): 'default' | 'correct' | 'wrong' => {
    if (!isResolved) return 'default';
    if (value === correctAnswer) return 'correct';
    if (value === selectedAnswer && value !== correctAnswer) return 'wrong';
    return 'default';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{S.addTitle.id}</Text>
      <Text style={styles.instructionEn}>{S.addTitle.en}</Text>

      {/* Visual equation */}
      <View style={styles.equationContainer}>
        {/* Group A */}
        <View style={styles.groupBox}>
          <EmojiGroup count={a} emoji={emoji} />
          <Text style={styles.groupNumber}>{a}</Text>
        </View>

        <Text style={styles.operator}>+</Text>

        {/* Group B */}
        <View style={styles.groupBox}>
          <EmojiGroup count={b} emoji={emoji} />
          <Text style={styles.groupNumber}>{b}</Text>
        </View>

        <Text style={styles.operator}>=</Text>

        {/* Answer placeholder */}
        <Animated.View style={[styles.answerPlaceholder, questionStyle]}>
          {isResolved && selectedAnswer === correctAnswer ? (
            <Text style={styles.resolvedAnswer}>{correctAnswer}</Text>
          ) : (
            <Text style={styles.questionMark}>?</Text>
          )}
        </Animated.View>
      </View>

      {/* Answer choices */}
      <View style={styles.choicesRow}>
        {options.map((opt) => (
          <AnswerButton
            key={opt}
            value={opt}
            onPress={handleAnswer}
            state={getButtonState(opt)}
          />
        ))}
      </View>

      {/* Feedback text */}
      {isResolved && (
        <View style={styles.feedback}>
          {selectedAnswer === correctAnswer ? (
            <>
              <Text style={styles.feedbackCorrect}>{S.correct.id}</Text>
              <Text style={styles.feedbackSubtext}>{S.correct.en}</Text>
            </>
          ) : (
            <>
              <Text style={styles.feedbackWrong}>{S.tryAgain.id}</Text>
              <Text style={styles.feedbackSubtext}>
                {a} + {b} = {correctAnswer}
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  instructionEn: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  equationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    flexWrap: 'wrap',
  },
  groupBox: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    minWidth: 80,
    ...SHADOWS.small,
  },
  emojiGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
    marginBottom: SPACING.xs,
    maxWidth: 100,
  },
  groupEmoji: {
    fontSize: 22,
  },
  groupNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  operator: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.text,
  },
  answerPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.star,
    borderStyle: 'dashed',
    ...SHADOWS.small,
  },
  questionMark: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.star,
  },
  resolvedAnswer: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.success,
  },
  choicesRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  answerButton: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  answerCorrect: {
    backgroundColor: COLORS.success,
  },
  answerWrong: {
    backgroundColor: COLORS.error,
  },
  answerText: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.text,
  },
  answerTextSelected: {
    color: COLORS.textWhite,
  },
  feedback: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  feedbackCorrect: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.success,
  },
  feedbackWrong: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.error,
  },
  feedbackSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});
