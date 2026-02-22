import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import StarReward from '../StarReward';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { S, bilingual } from '../../constants/strings';
import { useSound } from '../../hooks/useSound';

// ---------- Color Mixing Data ----------

interface MixQuestion {
  id: string;
  color1: string;
  color1Name: { id: string; en: string };
  color2: string;
  color2Name: { id: string; en: string };
  result: string;
  resultName: { id: string; en: string };
  distractors: string[]; // 2 wrong answer colors
}

const MIX_QUESTIONS: MixQuestion[] = [
  {
    id: 'red_blue',
    color1: '#FF4444',
    color1Name: { id: 'Merah', en: 'Red' },
    color2: '#4488FF',
    color2Name: { id: 'Biru', en: 'Blue' },
    result: '#9944FF',
    resultName: { id: 'Ungu', en: 'Purple' },
    distractors: ['#44BB44', '#FF9933'],
  },
  {
    id: 'red_yellow',
    color1: '#FF4444',
    color1Name: { id: 'Merah', en: 'Red' },
    color2: '#FFD700',
    color2Name: { id: 'Kuning', en: 'Yellow' },
    result: '#FF9933',
    resultName: { id: 'Oranye', en: 'Orange' },
    distractors: ['#9944FF', '#44BB44'],
  },
  {
    id: 'blue_yellow',
    color1: '#4488FF',
    color1Name: { id: 'Biru', en: 'Blue' },
    color2: '#FFD700',
    color2Name: { id: 'Kuning', en: 'Yellow' },
    result: '#44BB44',
    resultName: { id: 'Hijau', en: 'Green' },
    distractors: ['#FF9933', '#9944FF'],
  },
  {
    id: 'red_white',
    color1: '#FF4444',
    color1Name: { id: 'Merah', en: 'Red' },
    color2: '#F5F5F5',
    color2Name: { id: 'Putih', en: 'White' },
    result: '#FF77AA',
    resultName: { id: 'Merah Muda', en: 'Pink' },
    distractors: ['#FF9933', '#FFD700'],
  },
  {
    id: 'blue_white',
    color1: '#4488FF',
    color1Name: { id: 'Biru', en: 'Blue' },
    color2: '#F5F5F5',
    color2Name: { id: 'Putih', en: 'White' },
    result: '#88BBFF',
    resultName: { id: 'Biru Muda', en: 'Light Blue' },
    distractors: ['#9944FF', '#44BB44'],
  },
  {
    id: 'red_green',
    color1: '#FF4444',
    color1Name: { id: 'Merah', en: 'Red' },
    color2: '#44BB44',
    color2Name: { id: 'Hijau', en: 'Green' },
    result: '#8B4513',
    resultName: { id: 'Cokelat', en: 'Brown' },
    distractors: ['#FF9933', '#333333'],
  },
  {
    id: 'yellow_white',
    color1: '#FFD700',
    color1Name: { id: 'Kuning', en: 'Yellow' },
    color2: '#F5F5F5',
    color2Name: { id: 'Putih', en: 'White' },
    result: '#FFFACD',
    resultName: { id: 'Kuning Muda', en: 'Light Yellow' },
    distractors: ['#FF77AA', '#88BBFF'],
  },
  {
    id: 'red_black',
    color1: '#FF4444',
    color1Name: { id: 'Merah', en: 'Red' },
    color2: '#333333',
    color2Name: { id: 'Hitam', en: 'Black' },
    result: '#8B0000',
    resultName: { id: 'Merah Tua', en: 'Dark Red' },
    distractors: ['#8B4513', '#9944FF'],
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------- Component ----------

interface ColorMixGameProps {
  onComplete: (stars: number) => void;
}

const TOTAL_ROUNDS = 5;

export default function ColorMixGame({ onComplete }: ColorMixGameProps) {
  const sound = useSound();
  const [currentRound, setCurrentRound] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(
    () => shuffleArray(MIX_QUESTIONS).slice(0, TOTAL_ROUNDS),
    []
  );

  const question = questions[currentRound];

  const options = useMemo(
    () =>
      question
        ? shuffleArray([question.result, ...question.distractors])
        : [],
    [question]
  );

  // Mixing animation
  const mixProgress = useSharedValue(0);
  const circle1X = useSharedValue(-40);
  const circle2X = useSharedValue(40);

  useEffect(() => {
    // Reset animation for each question
    circle1X.value = -40;
    circle2X.value = 40;
    mixProgress.value = 0;
  }, [currentRound]);

  const triggerMixAnimation = useCallback(() => {
    circle1X.value = withSpring(0, { damping: 8, stiffness: 100 });
    circle2X.value = withSpring(0, { damping: 8, stiffness: 100 });
    mixProgress.value = withDelay(
      300,
      withSpring(1, { damping: 10, stiffness: 80 })
    );
  }, []);

  const circle1Style = useAnimatedStyle(() => ({
    transform: [{ translateX: circle1X.value }],
  }));

  const circle2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: circle2X.value }],
  }));

  const mixResultStyle = useAnimatedStyle(() => ({
    opacity: mixProgress.value,
    transform: [{ scale: mixProgress.value }],
  }));

  const handleAnswer = useCallback(
    (color: string) => {
      if (showResult) return;

      setSelectedAnswer(color);
      setShowResult(true);

      const isCorrect = color === question.result;
      if (isCorrect) {
        sound.playSuccess();
        setCorrectCount((c) => c + 1);
      } else {
        sound.playError();
      }

      // Trigger mixing animation
      triggerMixAnimation();

      // Move to next
      setTimeout(() => {
        const nextRound = currentRound + 1;
        if (nextRound >= TOTAL_ROUNDS) {
          const finalCorrect = isCorrect ? correctCount + 1 : correctCount;
          const ratio = finalCorrect / TOTAL_ROUNDS;
          const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
          setFinished(true);
          setTimeout(() => onComplete(stars), 1200);
        } else {
          setCurrentRound(nextRound);
          setSelectedAnswer(null);
          setShowResult(false);
        }
      }, 1800);
    },
    [
      showResult,
      question,
      currentRound,
      correctCount,
      onComplete,
      sound,
      triggerMixAnimation,
    ]
  );

  if (!question) return null;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{bilingual(S.colorMix)}</Text>

      {/* Progress */}
      <View style={styles.progressRow}>
        {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
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

      {/* Color equation */}
      <View style={styles.equation}>
        {/* Color 1 */}
        <Animated.View style={circle1Style}>
          <View style={styles.colorBubble}>
            <View
              style={[styles.bigCircle, { backgroundColor: question.color1 }]}
            />
            <Text style={styles.colorLabel}>
              {question.color1Name.id}
            </Text>
          </View>
        </Animated.View>

        <Text style={styles.operator}>+</Text>

        {/* Color 2 */}
        <Animated.View style={circle2Style}>
          <View style={styles.colorBubble}>
            <View
              style={[styles.bigCircle, { backgroundColor: question.color2 }]}
            />
            <Text style={styles.colorLabel}>
              {question.color2Name.id}
            </Text>
          </View>
        </Animated.View>

        <Text style={styles.operator}>=</Text>

        {/* Result */}
        <View style={styles.colorBubble}>
          {showResult ? (
            <Animated.View style={mixResultStyle}>
              <View
                style={[styles.bigCircle, { backgroundColor: question.result }]}
              />
              <Text style={styles.colorLabel}>
                {question.resultName.id}
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.questionCircle}>
              <Text style={styles.questionMark}>?</Text>
            </View>
          )}
        </View>
      </View>

      {/* Answer options */}
      <Text style={styles.pickText}>
        Pilih warnanya! / Pick the color!
      </Text>
      <View style={styles.optionsRow}>
        {options.map((color) => {
          const isSelected = selectedAnswer === color;
          const isCorrectAnswer = showResult && color === question.result;
          const isWrongSelected = showResult && isSelected && color !== question.result;

          return (
            <Pressable
              key={color}
              onPress={() => handleAnswer(color)}
              disabled={showResult}
              style={[
                styles.optionCircleWrapper,
                isCorrectAnswer && styles.optionCorrect,
                isWrongSelected && styles.optionWrong,
              ]}
            >
              <View
                style={[
                  styles.optionCircle,
                  { backgroundColor: color },
                  isSelected && styles.optionSelected,
                ]}
              />
            </Pressable>
          );
        })}
      </View>

      {/* Score */}
      <Text style={styles.scoreText}>
        {correctCount}/{currentRound + (showResult ? 1 : 0)}
      </Text>

      {/* Finished overlay */}
      {finished && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.finishedOverlay}>
          <Text style={styles.finishedEmoji}>🎨</Text>
          <Text style={styles.finishedText}>{bilingual(S.wellDone)}</Text>
          <StarReward
            stars={
              correctCount / TOTAL_ROUNDS >= 0.9
                ? 3
                : correctCount / TOTAL_ROUNDS >= 0.6
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
    marginBottom: SPACING.sm,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: SPACING.lg,
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
  equation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  colorBubble: {
    alignItems: 'center',
  },
  bigCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    ...SHADOWS.medium,
  },
  colorLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
    textAlign: 'center',
  },
  operator: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textLight,
  },
  questionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: COLORS.star,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  questionMark: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.star,
  },
  pickText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  optionCircleWrapper: {
    padding: 4,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  optionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    ...SHADOWS.small,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: '#FFF',
  },
  optionCorrect: {
    borderColor: COLORS.success,
  },
  optionWrong: {
    borderColor: COLORS.error,
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
