import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import ShapeCharacter from './ShapeCharacter';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useSound } from '../../hooks/useSound';
import type { ShapeDef } from '../../data/shapeData';
import { shuffleShapes } from '../../data/shapeData';

interface ShapeMatchGameProps {
  shapes: ShapeDef[];
  onComplete: (stars: number) => void;
  rounds?: number;
}

interface Round {
  target: ShapeDef;
  options: ShapeDef[];
}

function generateRounds(shapes: ShapeDef[], count: number): Round[] {
  const rounds: Round[] = [];
  const shuffled = shuffleShapes(shapes);

  for (let i = 0; i < count; i++) {
    const target = shuffled[i % shuffled.length];

    // Pick 2 distractors (different from target)
    const distractors = shuffleShapes(
      shapes.filter((s) => s.id !== target.id)
    ).slice(0, 2);

    // Shuffle options (target + 2 distractors)
    const options = shuffleShapes([target, ...distractors]);

    rounds.push({ target, options });
  }

  return rounds;
}

export default function ShapeMatchGame({
  shapes,
  onComplete,
  rounds: roundCount = 5,
}: ShapeMatchGameProps) {
  const sound = useSound();
  const gameRounds = useMemo(
    () => generateRounds(shapes, roundCount),
    [shapes, roundCount]
  );

  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [roundKey, setRoundKey] = useState(0);

  const round = gameRounds[currentRound];

  const feedbackScale = useSharedValue(1);
  const wrongShake = useSharedValue(0);

  const feedbackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackScale.value }],
  }));

  const handleOptionPress = useCallback(
    (shape: ShapeDef) => {
      if (answered) return;

      setSelectedId(shape.id);
      setAnswered(true);

      const isCorrect = shape.id === round.target.id;

      if (isCorrect) {
        sound.playSuccess();
        setScore((s) => s + 1);
        feedbackScale.value = withSequence(
          withSpring(1.15, { damping: 6, stiffness: 300 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        );
      } else {
        sound.playError();
        wrongShake.value = withSequence(
          withTiming(-8, { duration: 60 }),
          withTiming(8, { duration: 60 }),
          withTiming(-6, { duration: 60 }),
          withTiming(6, { duration: 60 }),
          withTiming(0, { duration: 60 })
        );
      }

      // Move to next round after delay
      setTimeout(() => {
        if (currentRound + 1 >= roundCount) {
          const finalScore = score + (isCorrect ? 1 : 0);
          const stars = finalScore >= roundCount ? 3 : finalScore >= roundCount - 1 ? 2 : 1;
          onComplete(stars);
        } else {
          setCurrentRound((r) => r + 1);
          setAnswered(false);
          setSelectedId(null);
          setRoundKey((k) => k + 1);
        }
      }, 1200);
    },
    [answered, round, currentRound, roundCount, score, onComplete, sound, feedbackScale, wrongShake]
  );

  const getOptionBorder = (shapeId: string) => {
    if (!answered || selectedId !== shapeId) return undefined;
    if (shapeId === round.target.id) {
      return { borderColor: COLORS.success, borderWidth: 4 };
    }
    return { borderColor: COLORS.error, borderWidth: 4 };
  };

  const getCorrectHighlight = (shapeId: string) => {
    if (!answered) return undefined;
    if (shapeId === round.target.id) {
      return { borderColor: COLORS.success, borderWidth: 4 };
    }
    return undefined;
  };

  return (
    <View style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressRow}>
        {Array.from({ length: roundCount }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < currentRound && styles.progressDotDone,
              i === currentRound && styles.progressDotCurrent,
            ]}
          />
        ))}
      </View>

      {/* Instruction */}
      <Animated.View
        key={`instruction-${roundKey}`}
        entering={FadeIn.duration(300)}
        style={styles.instructionBox}
      >
        <Text style={styles.instructionText}>Cari bentuk yang sama!</Text>
        <Text style={styles.instructionTextEn}>Find the matching shape!</Text>
      </Animated.View>

      {/* Target shape (big, with face) */}
      <Animated.View
        key={`target-${roundKey}`}
        entering={BounceIn.duration(500)}
        style={[styles.targetArea, feedbackStyle]}
      >
        <View style={[styles.targetCard, { backgroundColor: round.target.color + '25' }]}>
          <ShapeCharacter shape={round.target} size={120} showFace={true} />
        </View>
        <Text style={styles.targetName}>{round.target.name}</Text>
        <Text style={styles.targetNameEn}>{round.target.nameEn}</Text>
      </Animated.View>

      {/* Options (3 choices) */}
      <Animated.View
        key={`options-${roundKey}`}
        entering={FadeInDown.delay(300).duration(400)}
        style={styles.optionsRow}
      >
        {round.options.map((shape, index) => {
          const borderStyle = getOptionBorder(shape.id) || getCorrectHighlight(shape.id);

          return (
            <Pressable
              key={shape.id}
              onPress={() => handleOptionPress(shape)}
              disabled={answered}
            >
              <Animated.View
                entering={BounceIn.delay(400 + index * 100).duration(400)}
                style={[
                  styles.optionCard,
                  borderStyle,
                  answered && selectedId === shape.id && shape.id === round.target.id
                    ? styles.optionCorrect
                    : undefined,
                  answered && selectedId === shape.id && shape.id !== round.target.id
                    ? styles.optionWrong
                    : undefined,
                ]}
              >
                <ShapeCharacter shape={shape} size={80} showFace={true} />
              </Animated.View>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Feedback emoji */}
      {answered && (
        <Animated.View entering={BounceIn.duration(400)} style={styles.feedbackArea}>
          <Text style={styles.feedbackEmoji}>
            {selectedId === round.target.id ? '🎉' : '🤔'}
          </Text>
          <Text style={styles.feedbackText}>
            {selectedId === round.target.id ? 'Benar! / Correct!' : 'Coba lagi! / Try again!'}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    width: '100%',
    marginBottom: SPACING.md,
  },
  progressDot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  progressDotDone: {
    backgroundColor: COLORS.success,
  },
  progressDotCurrent: {
    backgroundColor: COLORS.star,
  },
  instructionBox: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  instructionTextEn: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  targetArea: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  targetCard: {
    width: 160,
    height: 160,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  targetName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  targetNameEn: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
  },
  optionCard: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    ...SHADOWS.medium,
  },
  optionCorrect: {
    backgroundColor: '#E8F5E9',
  },
  optionWrong: {
    backgroundColor: '#FFEBEE',
  },
  feedbackArea: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  feedbackEmoji: {
    fontSize: 40,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});
