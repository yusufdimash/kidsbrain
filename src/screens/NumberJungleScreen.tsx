import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  BounceIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';
import { NUMBERS, NumberDef, getRandomEmoji } from '../data/numberData';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';
import GameHeader from '../components/GameHeader';
import NumberCard from '../components/numbers/NumberCard';
import CountingGame from '../components/numbers/CountingGame';
import AdditionGame from '../components/numbers/AdditionGame';
import ConfettiOverlay from '../components/ConfettiOverlay';
import StarReward from '../components/StarReward';

type ScreenMode = 'home' | 'counting' | 'addition';

/** Generate an addition problem with sum <= 10 */
function generateAddition(): { a: number; b: number; options: number[]; emoji: string } {
  const sum = Math.floor(Math.random() * 9) + 2; // 2-10
  const a = Math.floor(Math.random() * (sum - 1)) + 1;
  const b = sum - a;

  const options = new Set<number>([sum]);
  while (options.size < 3) {
    const offset = Math.random() > 0.5 ? 1 : -1;
    const delta = Math.floor(Math.random() * 3) + 1;
    const val = sum + offset * delta;
    if (val > 0 && val <= 15) {
      options.add(val);
    }
  }

  return {
    a,
    b,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    emoji: getRandomEmoji(),
  };
}

// ---------- Number Detail Overlay ----------

function NumberDetailOverlay({
  number,
  onClose,
}: {
  number: NumberDef;
  onClose: () => void;
}) {
  // Build rows of emojis (max 5 per row)
  const emojiRows: number[][] = [];
  let remaining = number.value;
  while (remaining > 0) {
    const count = Math.min(remaining, 5);
    emojiRows.push(Array.from({ length: count }, (_, i) => i));
    remaining -= count;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={[styles.overlay, { backgroundColor: number.color }]}
    >
      <Pressable style={styles.overlayPressable} onPress={onClose}>
        <Animated.Text
          entering={FadeInDown.duration(300)}
          style={styles.overlayNumber}
        >
          {number.value}
        </Animated.Text>

        <Animated.View
          entering={FadeIn.delay(200).duration(300)}
          style={styles.overlayEmojiGrid}
        >
          {emojiRows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.overlayEmojiRow}>
              {row.map((_, colIdx) => {
                const totalIdx = rowIdx * 5 + colIdx;
                return (
                  <Animated.Text
                    key={colIdx}
                    entering={BounceIn.delay(300 + totalIdx * 80).duration(500)}
                    style={styles.overlayEmoji}
                  >
                    {number.emoji}
                  </Animated.Text>
                );
              })}
            </View>
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300 + number.value * 80).duration(400)}
          style={styles.overlayWordContainer}
        >
          <Text style={styles.overlayWord}>{number.word}</Text>
          <Text style={styles.overlayWordEn}>{number.wordEn}</Text>
        </Animated.View>

        <Animated.Text
          entering={FadeIn.delay(800 + number.value * 60).duration(500)}
          style={styles.overlayHint}
        >
          Ketuk untuk tutup / Tap to close
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

// ---------- Main Screen ----------

export default function NumberJungleScreen() {
  const [mode, setMode] = useState<ScreenMode>('home');
  const { width: screenWidth } = useWindowDimensions();
  const [selectedNumber, setSelectedNumber] = useState<NumberDef | null>(null);
  const { completeLevel } = useProgress('numberJungle');
  const sound = useSound();

  // Counting game state
  const [countingRound, setCountingRound] = useState(0);
  const [countingDifficulty, setCountingDifficulty] = useState(3);

  // Addition game state
  const [additionRound, setAdditionRound] = useState(0);
  const [additionScore, setAdditionScore] = useState(0);
  const [additionTotal, setAdditionTotal] = useState(0);
  const [showAdditionResult, setShowAdditionResult] = useState(false);

  // Generate counting target
  const countingTarget = useMemo(
    () => Math.min(countingDifficulty, 15),
    [countingDifficulty]
  );
  const countingEmoji = useMemo(() => getRandomEmoji(), [countingRound]);

  // Generate addition problem
  const additionProblem = useMemo(() => generateAddition(), [additionRound]);

  // Card size matching LetterLand: 3-column with SPACING.md gaps
  const cardSize =
    (screenWidth - SPACING.md * 2 - SPACING.md * 2) / 3;

  const handleCountingComplete = useCallback(
    (stars: number) => {
      completeLevel(`counting-${countingRound}`, stars);
      sound.playStar();

      setTimeout(() => {
        setCountingRound((r) => r + 1);
        setCountingDifficulty((d) => Math.min(d + 1, 15));
      }, 3000);
    },
    [countingRound, completeLevel, sound]
  );

  const handleAdditionComplete = useCallback(
    (correct: boolean) => {
      setAdditionTotal((t) => t + 1);
      if (correct) {
        setAdditionScore((s) => s + 1);
      }

      if (additionTotal + 1 >= 5) {
        const finalScore = additionScore + (correct ? 1 : 0);
        const stars = finalScore >= 5 ? 3 : finalScore >= 3 ? 2 : 1;
        completeLevel(`addition-set-${additionRound}`, stars);
        sound.playStar();

        setTimeout(() => {
          setShowAdditionResult(true);
        }, 1500);
      } else {
        setTimeout(() => {
          setAdditionRound((r) => r + 1);
        }, 1500);
      }
    },
    [additionTotal, additionScore, additionRound, completeLevel, sound]
  );

  const handleNewAdditionSet = useCallback(() => {
    setAdditionRound((r) => r + 1);
    setAdditionScore(0);
    setAdditionTotal(0);
    setShowAdditionResult(false);
  }, []);

  const handleNumberPress = useCallback(
    (num: NumberDef) => {
      sound.playTap();
      setSelectedNumber(num);
    },
    [sound]
  );

  const handleCloseDetail = useCallback(() => {
    setSelectedNumber(null);
  }, []);

  const additionStars = additionScore >= 5 ? 3 : additionScore >= 3 ? 2 : 1;

  return (
    <View style={styles.container}>
      <GameHeader
        title={S.numberJungle.id}
        subtitle={S.numberJungle.en}
        color={COLORS.numberJungle}
      />

      {/* ========== HOME: Activity buttons + Number grid ========== */}
      {mode === 'home' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.homeContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Counting button */}
          <Pressable
            onPress={() => setMode('counting')}
            style={styles.activityButtonPressable}
          >
            <View style={[styles.activityButton, { backgroundColor: COLORS.yellow }]}>
              <View style={styles.activityEmojiContainer}>
                <Text style={styles.activityEmoji}>👆</Text>
              </View>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityTitle}>Hitung Benda</Text>
                <Text style={styles.activitySubtitle}>Count Objects</Text>
              </View>
              <Text style={styles.activityArrow}>▶</Text>
            </View>
          </Pressable>

          {/* Addition button */}
          <Pressable
            onPress={() => {
              setMode('addition');
              handleNewAdditionSet();
            }}
            style={styles.activityButtonPressable}
          >
            <View style={[styles.activityButton, { backgroundColor: COLORS.orange }]}>
              <View style={styles.activityEmojiContainer}>
                <Text style={styles.activityEmoji}>➕</Text>
              </View>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityTitle}>Penjumlahan</Text>
                <Text style={styles.activitySubtitle}>Addition</Text>
              </View>
              <Text style={styles.activityArrow}>▶</Text>
            </View>
          </Pressable>

          {/* Number grid */}
          <View style={styles.numberGrid}>
            {NUMBERS.map((num) => (
              <NumberCard
                key={num.value}
                number={num}
                onPress={handleNumberPress}
                size={cardSize}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* ========== COUNTING MODE ========== */}
      {mode === 'counting' && (
        <ScrollView style={styles.fullContent} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View>
            <CountingGame
              key={`counting-${countingRound}`}
              targetCount={countingTarget}
              emoji={countingEmoji}
              onComplete={handleCountingComplete}
            />
          </View>

          <View style={styles.bottomButtons}>
            <Pressable
              style={styles.tryAgainButton}
              onPress={() => setCountingRound((r) => r + 1)}
            >
              <Text style={styles.tryAgainEmoji}>🔄</Text>
              <Text style={styles.tryAgainText}>
                {S.retry.id} / {S.retry.en}
              </Text>
            </Pressable>

            <Pressable
              style={styles.backToHomeButton}
              onPress={() => setMode('home')}
            >
              <Text style={styles.backToHomeText}>
                ◀ {S.back.id} / {S.back.en}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* ========== ADDITION MODE ========== */}
      {mode === 'addition' && !showAdditionResult && (
        <View style={styles.fullContent}>
          <View style={styles.gameContainer}>
            {/* Progress indicator */}
            <View style={styles.progressRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.progressDot,
                    i < additionTotal && styles.progressDotDone,
                    i === additionTotal && styles.progressDotCurrent,
                  ]}
                />
              ))}
            </View>

            <AdditionGame
              key={`add-${additionRound}`}
              a={additionProblem.a}
              b={additionProblem.b}
              options={additionProblem.options}
              emoji={additionProblem.emoji}
              onComplete={handleAdditionComplete}
            />
          </View>

          <View style={styles.bottomButtons}>
            <Pressable
              style={styles.backToHomeButton}
              onPress={() => setMode('home')}
            >
              <Text style={styles.backToHomeText}>
                ◀ {S.back.id} / {S.back.en}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {mode === 'addition' && showAdditionResult && (
        <View style={styles.fullContent}>
          <View style={styles.resultContainer}>
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>{S.wellDone.id}</Text>
              <Text style={styles.resultTitleEn}>{S.wellDone.en}</Text>
              <Text style={styles.scoreText}>
                {additionScore} / 5
              </Text>
              <StarReward stars={additionStars} size={48} animate={true} />
              <Pressable
                style={styles.playAgainButton}
                onPress={handleNewAdditionSet}
              >
                <Text style={styles.playAgainText}>
                  {S.retry.id} / {S.retry.en}
                </Text>
              </Pressable>
            </View>

            <ConfettiOverlay visible={true} />
          </View>

          <View style={styles.bottomButtons}>
            <Pressable
              style={styles.backToHomeButton}
              onPress={() => setMode('home')}
            >
              <Text style={styles.backToHomeText}>
                ◀ {S.back.id} / {S.back.en}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ========== Number Detail Overlay ========== */}
      {selectedNumber && (
        <NumberDetailOverlay
          number={selectedNumber}
          onClose={handleCloseDetail}
        />
      )}
    </View>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  homeContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxl * 2,
  },

  // Activity buttons (like LetterLand matchButton)
  activityButtonPressable: {
    marginBottom: SPACING.sm,
  },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  activityEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  activityTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  activitySubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  activityArrow: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },

  // Number grid (matches LetterLand letterGrid)
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },

  // Game modes
  fullContent: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
  },

  // Bottom buttons (matches LetterLand matchBottomButtons)
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: SPACING.xxl,
  },
  bottomButtons: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
    gap: SPACING.lg,
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  tryAgainEmoji: {
    fontSize: 20,
  },
  tryAgainText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  backToHomeButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  backToHomeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },

  // Progress
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
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

  // Addition Result
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    width: '100%',
    maxWidth: 320,
    ...SHADOWS.large,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  resultTitleEn: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.text,
    marginVertical: SPACING.sm,
  },
  playAgainButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.full,
    marginTop: SPACING.md,
    ...SHADOWS.small,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Number detail overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  overlayPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  overlayNumber: {
    fontSize: 80,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: SPACING.sm,
  },
  overlayEmojiGrid: {
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  overlayEmojiRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  overlayEmoji: {
    fontSize: 36,
  },
  overlayWordContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  overlayWord: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  overlayWordEn: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  overlayHint: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    bottom: SPACING.xxl,
  },
});
