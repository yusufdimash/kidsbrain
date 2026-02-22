import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { S, bilingual } from '../constants/strings';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';
import GameHeader from '../components/GameHeader';
import StarReward from '../components/StarReward';
import ConfettiOverlay from '../components/ConfettiOverlay';
import SequenceRow from '../components/pattern/SequenceRow';
import AnswerOption from '../components/pattern/AnswerOption';
import type { AnswerState } from '../components/pattern/AnswerOption';
import {
  getLevelsByDifficulty,
  DIFFICULTIES,
  type PatternLevel,
} from '../data/patternLevels';

type Difficulty = PatternLevel['difficulty'];

const DIFFICULTY_LABELS: Record<Difficulty, { id: string; en: string }> = {
  easy: { id: 'Mudah', en: 'Easy' },
  medium: { id: 'Sedang', en: 'Medium' },
  hard: { id: 'Sulit', en: 'Hard' },
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: COLORS.green,
  medium: COLORS.yellow,
  hard: COLORS.pink,
};

const DIFFICULTY_EMOJIS: Record<Difficulty, string> = {
  easy: '⭐',
  medium: '🌟',
  hard: '💫',
};

// ---------- Difficulty selection button ----------

function DifficultyCard({
  difficulty,
  index,
  onSelect,
}: {
  difficulty: Difficulty;
  index: number;
  onSelect: (d: Difficulty) => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      onPress={() => onSelect(difficulty)}
    >
      <Animated.View
        entering={FadeInDown.delay(index * 120).springify()}
        style={[
          styles.difficultyCard,
          { backgroundColor: DIFFICULTY_COLORS[difficulty] },
          animatedStyle,
        ]}
      >
        <Text style={styles.difficultyCardEmoji}>
          {DIFFICULTY_EMOJIS[difficulty]}
        </Text>
        <Text style={styles.difficultyCardLabel}>
          {DIFFICULTY_LABELS[difficulty].id}
        </Text>
        <Text style={styles.difficultyCardSubLabel}>
          {DIFFICULTY_LABELS[difficulty].en}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ---------- Main screen ----------

export default function PatternGameScreen() {
  const { completeLevel, getStars } = useProgress('patternGame');
  const sound = useSound();

  // ── State ────────────────────────────────────────────────────────────────────
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [levelIndex, setLevelIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [optionStates, setOptionStates] = useState<Record<string, AnswerState>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [groupFinished, setGroupFinished] = useState(false);
  const [groupStars, setGroupStars] = useState(0);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const levels = useMemo(() => getLevelsByDifficulty(difficulty), [difficulty]);
  const currentLevel = levels[levelIndex];
  const isLastLevel = levelIndex === levels.length - 1;

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    };
  }, []);

  // ── Reset when difficulty changes ────────────────────────────────────────────
  useEffect(() => {
    resetRound();
    setLevelIndex(0);
    setMistakes(0);
    setGroupFinished(false);
    setShowCelebration(false);
  }, [difficulty]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const resetRound = useCallback(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setOptionStates({});
  }, []);

  const computeStars = (totalMistakes: number): number => {
    if (totalMistakes === 0) return 3;
    if (totalMistakes <= 2) return 2;
    return 1;
  };

  // ── Handle difficulty selection ──────────────────────────────────────────────
  const handleSelectDifficulty = useCallback((d: Difficulty) => {
    setSelectedDifficulty(d);
    setDifficulty(d);
  }, []);

  // ── Handle back to levels ────────────────────────────────────────────────────
  const handleBackToLevels = useCallback(() => {
    setSelectedDifficulty(null);
  }, []);

  // ── Handle answer press ──────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (emoji: string) => {
      if (isCorrect === true) return; // Already answered correctly

      if (emoji === currentLevel.answer) {
        // Correct!
        sound.playSuccess();
        setSelectedAnswer(emoji);
        setIsCorrect(true);
        setOptionStates((prev) => ({ ...prev, [emoji]: 'correct' }));

        // Save progress for this individual level
        const starsForLevel = computeStars(mistakes);
        completeLevel(currentLevel.id, starsForLevel);

        if (isLastLevel) {
          // Group finished
          const finalStars = computeStars(mistakes);
          setGroupStars(finalStars);
          setShowCelebration(true);
          advanceTimerRef.current = setTimeout(() => {
            setGroupFinished(true);
          }, 1500);
        } else {
          // Auto-advance after 1.5 seconds
          advanceTimerRef.current = setTimeout(() => {
            setLevelIndex((prev) => prev + 1);
            resetRound();
          }, 1500);
        }
      } else {
        // Wrong
        sound.playError();
        setMistakes((prev) => prev + 1);
        setOptionStates((prev) => ({ ...prev, [emoji]: 'wrong' }));

        // Reset this option state after shake animation completes
        setTimeout(() => {
          setOptionStates((prev) => {
            const updated = { ...prev };
            if (updated[emoji] === 'wrong') {
              updated[emoji] = 'idle';
            }
            return updated;
          });
        }, 800);
      }
    },
    [currentLevel, isCorrect, mistakes, isLastLevel, completeLevel, resetRound, sound]
  );

  // ── Replay group ─────────────────────────────────────────────────────────────
  const handleReplay = useCallback(() => {
    setLevelIndex(0);
    setMistakes(0);
    setGroupFinished(false);
    setShowCelebration(false);
    resetRound();
  }, [resetRound]);

  // ── Render: Difficulty selection screen ──────────────────────────────────────
  if (!selectedDifficulty) {
    return (
      <View style={styles.screen}>
        <GameHeader
          title={S.patternGame.id}
          subtitle={S.patternGame.en}
          color={COLORS.patternGame}
        />

        <ScrollView
          contentContainerStyle={styles.selectionContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Text
            entering={FadeIn.duration(400)}
            style={styles.selectTitle}
          >
            Pilih Tingkatan
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.duration(400).delay(100)}
            style={styles.selectSubtitle}
          >
            Choose Level
          </Animated.Text>

          <View style={styles.difficultyRow}>
            {DIFFICULTIES.map((d, index) => (
              <DifficultyCard
                key={d}
                difficulty={d}
                index={index}
                onSelect={handleSelectDifficulty}
              />
            ))}
          </View>

          {/* Show best scores per level */}
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={styles.bestScoresContainer}
          >
            {(DIFFICULTIES as readonly Difficulty[]).map((d) => {
              const best = getStars(d);
              if (best === 0) return null;
              return (
                <View key={d} style={styles.bestScoreRow}>
                  <Text style={styles.bestScoreLabel}>
                    {DIFFICULTY_LABELS[d].id}
                  </Text>
                  <StarReward stars={best} size={20} animate={false} />
                </View>
              );
            })}
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ── Render: Group completion celebration ─────────────────────────────────────
  if (groupFinished) {
    return (
      <View style={styles.screen}>
        <GameHeader
          title={S.patternGame.id}
          subtitle={S.patternGame.en}
          color={COLORS.patternGame}
        />
        <ConfettiOverlay visible={true} />

        <Animated.View entering={FadeIn.duration(500)} style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>{bilingual(S.wellDone)}</Text>
          <Text style={styles.celebrationSubtitle}>
            {DIFFICULTY_LABELS[difficulty].id} / {DIFFICULTY_LABELS[difficulty].en}
          </Text>

          <View style={styles.starRewardContainer}>
            <StarReward stars={groupStars} size={50} animate={true} />
          </View>

          <View style={styles.celebrationActions}>
            <Pressable style={styles.replayButton} onPress={handleReplay}>
              <Text style={styles.replayButtonText}>{bilingual(S.retry)}</Text>
            </Pressable>

            {difficulty !== 'hard' && (
              <Pressable
                style={[styles.nextDiffButton, { backgroundColor: DIFFICULTY_COLORS[
                  DIFFICULTIES[DIFFICULTIES.indexOf(difficulty) + 1]
                ] }]}
                onPress={() => {
                  const nextIdx = DIFFICULTIES.indexOf(difficulty) + 1;
                  if (nextIdx < DIFFICULTIES.length) {
                    const nextDiff = DIFFICULTIES[nextIdx];
                    setSelectedDifficulty(nextDiff);
                    setDifficulty(nextDiff);
                  }
                }}
              >
                <Text style={styles.nextDiffButtonText}>{bilingual(S.next)}</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>
    );
  }

  // ── Render: Main game ────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <GameHeader
        title={S.patternGame.id}
        subtitle={S.patternGame.en}
        color={COLORS.patternGame}
      />

      <ConfettiOverlay
        visible={showCelebration && isLastLevel}
        onComplete={() => {}}
      />

      {/* Back to levels badge */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBackToLevels} style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>
            {DIFFICULTY_LABELS[difficulty].id} / {DIFFICULTY_LABELS[difficulty].en}
          </Text>
        </Pressable>
      </View>

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {levels.map((_, i) => {
          const completed = i < levelIndex || (i === levelIndex && isCorrect === true);
          const isCurrent = i === levelIndex;
          return (
            <View
              key={i}
              style={[
                styles.progressDot,
                completed && styles.progressDotCompleted,
                isCurrent && !completed && styles.progressDotCurrent,
              ]}
            />
          );
        })}
      </View>

      {/* Level indicator */}
      <Text style={styles.levelLabel}>
        {S.level.id} {levelIndex + 1} / {levels.length}
      </Text>

      {/* Prompt */}
      <Animated.Text
        key={`prompt-${currentLevel.id}`}
        entering={FadeInDown.duration(400)}
        style={styles.prompt}
      >
        {bilingual(S.patternQuestion)}
      </Animated.Text>

      {/* Sequence row */}
      <Animated.View
        key={`seq-${currentLevel.id}`}
        entering={SlideInRight.duration(400)}
        exiting={SlideOutLeft.duration(300)}
      >
        <SequenceRow
          sequence={currentLevel.sequence}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
        />
      </Animated.View>

      {/* Feedback text */}
      {isCorrect === true && (
        <Animated.Text entering={FadeIn.duration(300)} style={styles.feedbackCorrect}>
          {bilingual(S.correct)}
        </Animated.Text>
      )}
      {isCorrect === false && (
        <Animated.Text entering={FadeIn.duration(200)} style={styles.feedbackWrong}>
          {bilingual(S.tryAgain)}
        </Animated.Text>
      )}

      {/* Answer options */}
      <Animated.View
        key={`opts-${currentLevel.id}`}
        entering={FadeInDown.delay(200).duration(400)}
        style={styles.optionsContainer}
      >
        {currentLevel.options.map((opt) => (
          <AnswerOption
            key={opt}
            emoji={opt}
            state={optionStates[opt] || 'idle'}
            disabled={isCorrect === true}
            onPress={() => handleAnswer(opt)}
          />
        ))}
      </Animated.View>

      {/* Star indicator for current level best */}
      {getStars(currentLevel.id) > 0 && (
        <View style={styles.bestStars}>
          <StarReward stars={getStars(currentLevel.id)} size={20} animate={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ── Difficulty selection screen ────────────────────────────────────────────
  selectionContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  selectTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  selectSubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  difficultyCard: {
    width: 100,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  difficultyCardEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  difficultyCardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  difficultyCardSubLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  bestScoresContainer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  bestScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  bestScoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    width: 60,
  },

  // ── Top bar with back-to-levels badge ──────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
  },
  levelBadge: {
    backgroundColor: COLORS.patternGame,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },

  // ── Progress dots ──────────────────────────────────────────────────────────
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.starEmpty,
  },
  progressDotCompleted: {
    backgroundColor: COLORS.success,
  },
  progressDotCurrent: {
    backgroundColor: COLORS.orange,
    transform: [{ scale: 1.3 }],
  },

  // ── Level label ────────────────────────────────────────────────────────────
  levelLabel: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },

  // ── Prompt ─────────────────────────────────────────────────────────────────
  prompt: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.md,
  },

  // ── Feedback ───────────────────────────────────────────────────────────────
  feedbackCorrect: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.success,
    marginTop: SPACING.xs,
  },
  feedbackWrong: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
    marginTop: SPACING.xs,
  },

  // ── Answer options ─────────────────────────────────────────────────────────
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },

  // ── Best stars ─────────────────────────────────────────────────────────────
  bestStars: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },

  // ── Celebration ────────────────────────────────────────────────────────────
  celebrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  starRewardContainer: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  celebrationActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  replayButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    ...SHADOWS.medium,
  },
  replayButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  nextDiffButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  nextDiffButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
});
