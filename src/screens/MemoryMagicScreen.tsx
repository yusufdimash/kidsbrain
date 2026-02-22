import React, { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import GameHeader from '../components/GameHeader';
import StarReward from '../components/StarReward';
import ConfettiOverlay from '../components/ConfettiOverlay';
import GameBoard from '../components/memory/GameBoard';

import { useMemoryGame } from '../hooks/useMemoryGame';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';

import {
  Difficulty,
  LEVEL_CONFIGS,
} from '../data/memoryCardData';
import { S } from '../constants/strings';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

// ---------- Difficulty selection button ----------

function DifficultyButton({
  difficulty,
  emoji,
  index,
  onSelect,
}: {
  difficulty: Difficulty;
  emoji: string;
  index: number;
  onSelect: (d: Difficulty) => void;
}) {
  const config = LEVEL_CONFIGS[difficulty];
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
        style={[styles.difficultyButton, animatedStyle]}
      >
        <Text style={styles.difficultyEmoji}>{emoji}</Text>
        <Text style={styles.difficultyLabel}>{config.labelId}</Text>
        <Text style={styles.difficultySubLabel}>{config.labelEn}</Text>
        <Text style={styles.difficultyGrid}>
          {config.rows} x {config.columns}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ---------- Main screen ----------

export default function MemoryMagicScreen() {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const progressSavedRef = useRef(false);

  const currentDifficulty = selectedDifficulty ?? 'easy';
  const game = useMemoryGame(currentDifficulty);
  const progress = useProgress('memoryMagic');
  const sound = useSound();

  // ----- Handlers -----

  const handleSelectDifficulty = useCallback(
    (difficulty: Difficulty) => {
      sound.playTap();
      setSelectedDifficulty(difficulty);
      progressSavedRef.current = false;
      game.resetGame(difficulty);
    },
    [game, sound]
  );

  const handleFlipCard = useCallback(
    (boardIndex: number) => {
      sound.playTap();
      game.flipCard(boardIndex);
    },
    [game, sound]
  );

  // Save progress and trigger celebration once on win.
  React.useEffect(() => {
    if (game.isWon && !progressSavedRef.current && selectedDifficulty) {
      progressSavedRef.current = true;
      sound.playSuccess();
      setShowConfetti(true);
      progress.completeLevel(selectedDifficulty, game.stars);
    }
  }, [game.isWon, game.stars, selectedDifficulty, progress, sound]);

  const handlePlayAgain = useCallback(() => {
    sound.playTap();
    setShowConfetti(false);
    progressSavedRef.current = false;
    if (selectedDifficulty) {
      game.resetGame(selectedDifficulty);
    }
  }, [game, selectedDifficulty, sound]);

  const handleNextLevel = useCallback(() => {
    sound.playTap();
    setShowConfetti(false);
    progressSavedRef.current = false;
    const order: Difficulty[] = ['easy', 'medium', 'hard'];
    const currentIndex = order.indexOf(selectedDifficulty ?? 'easy');
    const nextDifficulty = order[Math.min(currentIndex + 1, order.length - 1)];
    setSelectedDifficulty(nextDifficulty);
    game.resetGame(nextDifficulty);
  }, [game, selectedDifficulty, sound]);

  const handleBackToLevels = useCallback(() => {
    sound.playTap();
    setShowConfetti(false);
    setSelectedDifficulty(null);
  }, [sound]);

  // ----- Render: Level selection -----

  if (!selectedDifficulty) {
    return (
      <View style={styles.screen}>
        <GameHeader
          title={S.memoryMagic.id}
          subtitle={S.memoryMagic.en}
          color={COLORS.text}
        />

        <ScrollView
          contentContainerStyle={styles.selectionContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.Text
            entering={FadeIn.duration(400)}
            style={styles.selectTitle}
          >
            {S.memoryTitle.id}
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.duration(400).delay(100)}
            style={styles.selectSubtitle}
          >
            {S.memoryTitle.en}
          </Animated.Text>

          <View style={styles.difficultyRow}>
            <DifficultyButton
              difficulty="easy"
              emoji="⭐"
              index={0}
              onSelect={handleSelectDifficulty}
            />
            <DifficultyButton
              difficulty="medium"
              emoji="🌟"
              index={1}
              onSelect={handleSelectDifficulty}
            />
            <DifficultyButton
              difficulty="hard"
              emoji="💫"
              index={2}
              onSelect={handleSelectDifficulty}
            />
          </View>

          {/* Show best scores per level */}
          <Animated.View
            entering={FadeInUp.delay(400).springify()}
            style={styles.bestScoresContainer}
          >
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => {
              const best = progress.getStars(d);
              if (best === 0) return null;
              return (
                <View key={d} style={styles.bestScoreRow}>
                  <Text style={styles.bestScoreLabel}>
                    {LEVEL_CONFIGS[d].labelId}
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

  // ----- Render: Game in progress / Won -----

  const config = LEVEL_CONFIGS[selectedDifficulty];

  return (
    <View style={styles.screen}>
      <GameHeader
        title={S.memoryMagic.id}
        subtitle={S.memoryMagic.en}
        color={COLORS.text}
        showBack
      />

      {/* Moves counter + back to levels */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBackToLevels} style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>
            {config.labelId} / {config.labelEn}
          </Text>
        </Pressable>

        <View style={styles.movesContainer}>
          <Text style={styles.movesLabel}>{S.memoryMoves.id}</Text>
          <Text style={styles.movesCount}>{game.moves}</Text>
        </View>
      </View>

      {/* Card grid */}
      <ScrollView
        contentContainerStyle={styles.boardScroll}
        showsVerticalScrollIndicator={false}
      >
        <GameBoard
          cards={game.cards}
          flippedIndices={game.flippedIndices}
          matchedIds={game.matchedIds}
          onFlipCard={handleFlipCard}
          columns={config.columns}
        />
      </ScrollView>

      {/* Win overlay */}
      {game.isWon && (
        <Animated.View
          entering={FadeIn.duration(400)}
          style={styles.winOverlay}
        >
          <View style={styles.winCard}>
            <Text style={styles.winEmoji}>🎉</Text>
            <Text style={styles.winTitle}>{S.memoryWin.id}</Text>
            <Text style={styles.winSubtitle}>{S.memoryWin.en}</Text>

            <View style={styles.winStars}>
              <StarReward stars={game.stars} size={48} animate />
            </View>

            <Text style={styles.winMoves}>
              {game.moves} {S.memoryMoves.id} / {S.memoryMoves.en}
            </Text>

            <View style={styles.winButtons}>
              <Pressable
                style={[styles.winButton, styles.retryButton]}
                onPress={handlePlayAgain}
              >
                <Text style={styles.winButtonText}>
                  {S.retry.id}{'\n'}
                  <Text style={styles.winButtonSubText}>{S.retry.en}</Text>
                </Text>
              </Pressable>

              {selectedDifficulty !== 'hard' && (
                <Pressable
                  style={[styles.winButton, styles.nextButton]}
                  onPress={handleNextLevel}
                >
                  <Text style={styles.winButtonText}>
                    {S.next.id}{'\n'}
                    <Text style={styles.winButtonSubText}>{S.next.en}</Text>
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Confetti */}
      <ConfettiOverlay
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
    </View>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // -- Level selection --
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
  difficultyButton: {
    width: 100,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  difficultyEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  difficultyLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  difficultySubLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  difficultyGrid: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    fontWeight: '600',
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

  // -- Game in progress --
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  levelBadge: {
    backgroundColor: COLORS.memoryMagic,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  levelBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  movesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  movesLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  movesCount: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  boardScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: SPACING.xl,
  },

  // -- Win overlay --
  winOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 500,
  },
  winCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
    ...SHADOWS.large,
  },
  winEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  winTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  winSubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  winStars: {
    marginVertical: SPACING.lg,
  },
  winMoves: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  winButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  winButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.memoryMagic,
  },
  nextButton: {
    backgroundColor: COLORS.success,
  },
  winButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  winButtonSubText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textLight,
  },
});
