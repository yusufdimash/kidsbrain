import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import ShapeCharacter from './ShapeCharacter';
import StarReward from '../StarReward';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { S, bilingual } from '../../constants/strings';
import { useSound } from '../../hooks/useSound';
import type { ShapeDef } from '../../data/shapeData';
import { shuffleShapes } from '../../data/shapeData';

interface HiddenShapeGameProps {
  shapes: ShapeDef[];
  rounds: number;
  onComplete: (stars: number) => void;
}

type Phase = 'showing' | 'hidden' | 'answered';

const FLASH_DURATION = 1500;

export default function HiddenShapeGame({
  shapes,
  rounds,
  onComplete,
}: HiddenShapeGameProps) {
  const sound = useSound();
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('showing');
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  // Build rounds data
  const roundsData = useMemo(() => {
    const result: { target: ShapeDef; options: ShapeDef[] }[] = [];
    const allShapes = shuffleShapes(shapes);

    for (let i = 0; i < rounds; i++) {
      // Pick target
      const target = allShapes[i % allShapes.length];

      // Pick 3 distractors (progressively more similar)
      const distractors = allShapes
        .filter((s) => s.id !== target.id)
        .slice(0, 3);

      // Shuffle options with target included
      const options = shuffleShapes([target, ...distractors]);
      result.push({ target, options });
    }

    return result;
  }, [shapes, rounds]);

  const currentData = roundsData[currentRound];

  // Timer to hide shape
  useEffect(() => {
    if (phase !== 'showing') return;

    const timer = setTimeout(() => {
      setPhase('hidden');
    }, FLASH_DURATION);

    return () => clearTimeout(timer);
  }, [phase, currentRound]);

  const handleAnswer = useCallback(
    (shapeId: string) => {
      if (phase !== 'hidden') return;

      setSelectedAnswer(shapeId);
      setPhase('answered');

      const isCorrect = shapeId === currentData.target.id;
      if (isCorrect) {
        sound.playSuccess();
        setCorrectCount((c) => c + 1);
      } else {
        sound.playError();
      }

      // Move to next round or finish
      setTimeout(() => {
        const nextRound = currentRound + 1;
        if (nextRound >= rounds) {
          const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
          const ratio = finalCorrect / rounds;
          const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
          setFinished(true);
          setTimeout(() => onComplete(stars), 1200);
        } else {
          setCurrentRound(nextRound);
          setPhase('showing');
          setSelectedAnswer(null);
        }
      }, 1200);
    },
    [phase, currentData, currentRound, rounds, correctCount, onComplete, sound]
  );

  if (!currentData) return null;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{bilingual(S.shapeFind)}</Text>

      {/* Progress */}
      <View style={styles.progressRow}>
        {Array.from({ length: rounds }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i < currentRound
                ? styles.progressDotDone
                : i === currentRound
                ? styles.progressDotCurrent
                : undefined,
            ]}
          />
        ))}
      </View>

      {/* Flash area */}
      <View style={styles.flashArea}>
        {phase === 'showing' && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.shapeShowBox}>
            <ShapeCharacter
              shape={currentData.target}
              size={90}
              showFace={true}
            />
            <Text style={styles.rememberText}>
              Ingat bentuk ini!{'\n'}Remember this shape!
            </Text>
          </Animated.View>
        )}

        {phase === 'hidden' && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.questionBox}>
            <Text style={styles.questionMark}>?</Text>
            <Text style={styles.questionText}>
              {bilingual(S.shapeTitle)}
            </Text>
          </Animated.View>
        )}

        {phase === 'answered' && (
          <Animated.View entering={FadeIn.duration(200)} style={styles.shapeShowBox}>
            <ShapeCharacter
              shape={currentData.target}
              size={90}
              showFace={true}
            />
            {selectedAnswer === currentData.target.id ? (
              <Text style={[styles.feedbackText, { color: COLORS.success }]}>
                {bilingual(S.correct)}
              </Text>
            ) : (
              <Text style={[styles.feedbackText, { color: COLORS.error }]}>
                {bilingual(S.tryAgain)}
              </Text>
            )}
          </Animated.View>
        )}
      </View>

      {/* Answer options */}
      <View style={styles.optionsGrid}>
        {currentData.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrectAnswer =
            phase === 'answered' && option.id === currentData.target.id;
          const isWrongAnswer =
            phase === 'answered' && isSelected && !isCorrectAnswer;

          return (
            <Pressable
              key={option.id}
              style={[
                styles.optionCard,
                isCorrectAnswer && styles.optionCorrect,
                isWrongAnswer && styles.optionWrong,
              ]}
              onPress={() => handleAnswer(option.id)}
              disabled={phase !== 'hidden'}
            >
              <ShapeCharacter shape={option} size={56} showFace={false} />
              <Text style={styles.optionName}>{option.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Score */}
      <Text style={styles.scoreText}>
        {correctCount}/{currentRound + (phase === 'answered' ? 1 : 0)}
      </Text>

      {/* Finished overlay */}
      {finished && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.finishedOverlay}>
          <Text style={styles.finishedEmoji}>🎉</Text>
          <Text style={styles.finishedText}>{bilingual(S.wellDone)}</Text>
          <StarReward
            stars={
              correctCount / rounds >= 0.9
                ? 3
                : correctCount / rounds >= 0.6
                ? 2
                : 1
            }
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.starEmpty,
  },
  progressDotDone: {
    backgroundColor: COLORS.success,
  },
  progressDotCurrent: {
    backgroundColor: COLORS.star,
  },
  flashArea: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  shapeShowBox: {
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  questionBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderWidth: 3,
    borderColor: COLORS.star,
    borderStyle: 'dashed',
  },
  questionMark: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.star,
  },
  questionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  optionCard: {
    width: '44%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.small,
  },
  optionCorrect: {
    borderColor: COLORS.success,
    backgroundColor: '#E8F8E8',
  },
  optionWrong: {
    borderColor: COLORS.error,
    backgroundColor: '#FFE8E8',
  },
  optionName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  finishedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,248,240,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
  },
  finishedEmoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  finishedText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
});
