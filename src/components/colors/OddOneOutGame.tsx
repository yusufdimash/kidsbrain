import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import StarReward from '../StarReward';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { S, bilingual } from '../../constants/strings';
import { useSound } from '../../hooks/useSound';

// ---------- Round generation ----------

interface RoundData {
  gridSize: number; // 3 means 3x3
  baseColor: string;
  oddColor: string;
  oddIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const BASE_COLORS = [
  '#FF4444', '#4488FF', '#44BB44', '#FFD700', '#FF9933',
  '#9944FF', '#FF77AA', '#00BBCC', '#FF6B6B', '#6BCB77',
];

/** Generates a color offset. Higher difficulty = more subtle difference. */
function adjustColor(hex: string, amount: number): string {
  const r = Math.min(255, Math.max(0, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.min(255, Math.max(0, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.min(255, Math.max(0, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function generateRound(roundIndex: number, totalRounds: number): RoundData {
  // Progressive difficulty
  let difficulty: 'easy' | 'medium' | 'hard';
  let gridSize: number;
  let colorShift: number;

  const progress = roundIndex / Math.max(totalRounds - 1, 1);

  if (progress < 0.35) {
    difficulty = 'easy';
    gridSize = 3;
    colorShift = 80 + Math.floor(Math.random() * 40); // Very different
  } else if (progress < 0.7) {
    difficulty = 'medium';
    gridSize = 3;
    colorShift = 40 + Math.floor(Math.random() * 30); // Moderate
  } else {
    difficulty = 'hard';
    gridSize = 4;
    colorShift = 20 + Math.floor(Math.random() * 20); // Subtle
  }

  const baseColor = BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)];
  const direction = Math.random() > 0.5 ? 1 : -1;
  const oddColor = adjustColor(baseColor, colorShift * direction);
  const total = gridSize * gridSize;
  const oddIndex = Math.floor(Math.random() * total);

  return { gridSize, baseColor, oddColor, oddIndex, difficulty };
}

// ---------- Component ----------

interface OddOneOutGameProps {
  rounds: number;
  onComplete: (stars: number) => void;
}

export default function OddOneOutGame({ rounds, onComplete }: OddOneOutGameProps) {
  const sound = useSound();
  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const roundData = useMemo(
    () => generateRound(currentRound, rounds),
    [currentRound, rounds]
  );

  const handleTap = useCallback(
    (index: number) => {
      if (selectedIndex !== null) return; // Already answered

      setSelectedIndex(index);
      const isCorrect = index === roundData.oddIndex;

      if (isCorrect) {
        sound.playSuccess();
        setCorrectCount((c) => c + 1);
      } else {
        sound.playError();
      }

      // Move to next round
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
          setSelectedIndex(null);
        }
      }, 1000);
    },
    [selectedIndex, roundData, currentRound, rounds, correctCount, onComplete, sound]
  );

  const total = roundData.gridSize * roundData.gridSize;
  const circleSize = roundData.gridSize === 3 ? 72 : 58;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{bilingual(S.colorOdd)}</Text>

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

      {/* Difficulty indicator */}
      <Text style={styles.difficultyText}>
        {roundData.difficulty === 'easy'
          ? 'Mudah / Easy'
          : roundData.difficulty === 'medium'
          ? 'Sedang / Medium'
          : 'Sulit / Hard'}
      </Text>

      {/* Grid */}
      <Animated.View
        key={currentRound}
        entering={FadeIn.duration(300)}
        style={styles.gridContainer}
      >
        <View
          style={[
            styles.grid,
            { width: (circleSize + SPACING.sm) * roundData.gridSize },
          ]}
        >
          {Array.from({ length: total }).map((_, index) => {
            const isOdd = index === roundData.oddIndex;
            const color = isOdd ? roundData.oddColor : roundData.baseColor;
            const isSelected = selectedIndex === index;
            const showCorrectHighlight =
              selectedIndex !== null && isOdd;
            const showWrongHighlight =
              selectedIndex !== null && isSelected && !isOdd;

            return (
              <Pressable
                key={index}
                onPress={() => handleTap(index)}
                disabled={selectedIndex !== null}
                style={[
                  styles.circleWrapper,
                  showCorrectHighlight && styles.circleCorrect,
                  showWrongHighlight && styles.circleWrong,
                ]}
              >
                <View
                  style={[
                    styles.circle,
                    {
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      backgroundColor: color,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      </Animated.View>

      {/* Feedback text */}
      {selectedIndex !== null && (
        <Animated.View entering={FadeIn.duration(200)}>
          {selectedIndex === roundData.oddIndex ? (
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

      {/* Score */}
      <Text style={styles.scoreText}>
        {correctCount}/{currentRound + (selectedIndex !== null ? 1 : 0)}
      </Text>

      {/* Finished overlay */}
      {finished && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.finishedOverlay}>
          <Text style={styles.finishedEmoji}>👁️</Text>
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
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
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  circleWrapper: {
    padding: 3,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  circleCorrect: {
    borderColor: COLORS.success,
  },
  circleWrong: {
    borderColor: COLORS.error,
  },
  circle: {
    ...SHADOWS.small,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
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
