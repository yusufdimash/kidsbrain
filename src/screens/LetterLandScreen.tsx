import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  BounceIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';
import { LETTERS, getRandomLetters, LetterDef } from '../data/letterData';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';
import GameHeader from '../components/GameHeader';
import LetterCard from '../components/letters/LetterCard';
import LetterMatchGame from '../components/letters/LetterMatchGame';

type ScreenMode = 'home' | 'tutorial' | 'match';

// ---------- Match Tutorial Overlay ----------

function MatchTutorial({ onStart }: { onStart: () => void }) {
  const progress = useSharedValue(0);

  // Animation phases:
  // 0.0-0.15: hand appears on letter, letter lifts up
  // 0.15-0.85: hand + letter drag together to the right
  // 0.85-1.0: drop on word box, word box glows green
  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(500, withTiming(1, { duration: 2000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })),
        withDelay(1000, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );
  }, [progress]);

  // The letter + hand move together from left to right
  const dragGroupStyle = useAnimatedStyle(() => {
    // Only move during drag phase (0.15 → 0.85)
    const translateX = interpolate(
      progress.value,
      [0, 0.15, 0.85, 1],
      [0, 0, 130, 130]
    );
    // Lift up slightly when picked up
    const translateY = interpolate(
      progress.value,
      [0, 0.1, 0.15, 0.5, 0.85, 0.9],
      [0, 0, -8, -12, -8, 0]
    );
    // Scale up when grabbed
    const scale = interpolate(
      progress.value,
      [0, 0.1, 0.15, 0.85, 0.9, 1],
      [1, 1, 1.12, 1.12, 1, 1]
    );
    return {
      transform: [{ translateX }, { translateY }, { scale }],
    };
  });

  // Hand opacity (appears when touching)
  const handStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.08, 0.12, 0.88, 0.92],
      [0, 0, 1, 1, 0]
    );
    return { opacity };
  });

  // Letter placeholder (ghost) stays in original position, fades when dragging
  const letterGhostStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.12, 0.18],
      [0, 0, 0.25]
    );
    return { opacity };
  });

  // Word box glows when letter arrives
  const wordBoxStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0.82, 0.9, 1], [1, 1.06, 1]);
    const bw = interpolate(progress.value, [0.82, 0.9], [2, 3]);
    return {
      transform: [{ scale }],
      borderWidth: bw,
    };
  });

  const wordBoxBorderStyle = useAnimatedStyle(() => {
    const greenAmount = interpolate(progress.value, [0.82, 0.9], [0, 1]);
    return {
      borderColor: greenAmount > 0.5 ? COLORS.success : '#E0E0E0',
    };
  });

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={styles.tutorialOverlay}
    >
      {/* Title */}
      <View style={styles.tutorialHeader}>
        <Animated.Text
          entering={FadeInDown.duration(400)}
          style={styles.tutorialTitle}
        >
          Cara Bermain
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.tutorialSubtitle}
        >
          How to Play
        </Animated.Text>
      </View>

      {/* Demo area */}
      <Animated.View
        entering={FadeIn.delay(200).duration(500)}
        style={styles.tutorialDemoArea}
      >
        {/* Ghost outline where letter was */}
        <Animated.View style={[styles.tutorialLetterGhost, letterGhostStyle]}>
          <Text style={styles.tutorialLetterGhostText}>A</Text>
        </Animated.View>

        {/* Dragging group: letter + hand move together */}
        <Animated.View style={[styles.tutorialDragGroup, dragGroupStyle]}>
          <View style={styles.tutorialLetterBox}>
            <Text style={styles.tutorialLetterText}>A</Text>
          </View>
          <Animated.Text style={[styles.tutorialHandEmoji, handStyle]}>
            👆
          </Animated.Text>
        </Animated.View>

        {/* Arrow hint (static) */}
        <View style={styles.tutorialArrowArea}>
          <Text style={styles.tutorialArrowText}>→</Text>
        </View>

        {/* Target word box */}
        <Animated.View
          style={[styles.tutorialWordBox, wordBoxStyle, wordBoxBorderStyle]}
        >
          <Text style={styles.tutorialWordEmoji}>🍎</Text>
          <Text style={styles.tutorialWordText}>Apel</Text>
        </Animated.View>
      </Animated.View>

      {/* Step indicators — fills remaining space */}
      <Animated.View
        entering={FadeInUp.delay(400).duration(400)}
        style={styles.tutorialSteps}
      >
        <View style={styles.tutorialStepRow}>
          <View style={[styles.tutorialStepBadge, { backgroundColor: COLORS.pink }]}>
            <Text style={styles.tutorialStepNumber}>1</Text>
          </View>
          <View style={styles.tutorialStepTextBox}>
            <Text style={styles.tutorialStepText}>Tekan & tahan huruf</Text>
            <Text style={styles.tutorialStepTextEn}>Press & hold the letter</Text>
          </View>
        </View>

        <View style={styles.tutorialStepRow}>
          <View style={[styles.tutorialStepBadge, { backgroundColor: COLORS.blue }]}>
            <Text style={styles.tutorialStepNumber}>2</Text>
          </View>
          <View style={styles.tutorialStepTextBox}>
            <Text style={styles.tutorialStepText}>Seret ke kata yang cocok</Text>
            <Text style={styles.tutorialStepTextEn}>Drag to the matching word</Text>
          </View>
        </View>

        <View style={styles.tutorialStepRow}>
          <View style={[styles.tutorialStepBadge, { backgroundColor: COLORS.green }]}>
            <Text style={styles.tutorialStepNumber}>3</Text>
          </View>
          <View style={styles.tutorialStepTextBox}>
            <Text style={styles.tutorialStepText}>Lepaskan untuk mencocokkan!</Text>
            <Text style={styles.tutorialStepTextEn}>Release to match!</Text>
          </View>
        </View>
      </Animated.View>

      {/* Start button — pinned to bottom */}
      <Animated.View
        entering={BounceIn.delay(600).duration(600)}
        style={styles.tutorialBottom}
      >
        <Pressable style={styles.tutorialStartButton} onPress={onStart}>
          <Text style={styles.tutorialStartEmoji}>🎮</Text>
          <Text style={styles.tutorialStartText}>Mulai!</Text>
          <Text style={styles.tutorialStartTextEn}>Start!</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ---------- Letter Detail Overlay ----------

function LetterDetailOverlay({
  letter,
  onClose,
}: {
  letter: LetterDef;
  onClose: () => void;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={[styles.overlay, { backgroundColor: letter.color }]}
    >
      <Pressable style={styles.overlayPressable} onPress={onClose}>
        <Animated.Text
          entering={FadeInDown.duration(300)}
          style={styles.overlayLetter}
        >
          {letter.letter}
        </Animated.Text>

        <Animated.Text
          entering={BounceIn.delay(150).duration(600)}
          style={styles.overlayEmoji}
        >
          {letter.emoji}
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.overlayWordContainer}
        >
          <Text style={styles.overlayWord}>{letter.word}</Text>
          <Text style={styles.overlayWordEn}>{letter.wordEn}</Text>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(450).duration(400)}
          style={styles.overlayPhonics}
        >
          /{letter.phonics}/
        </Animated.Text>

        <Animated.Text
          entering={FadeIn.delay(800).duration(500)}
          style={styles.overlayHint}
        >
          Ketuk untuk tutup / Tap to close
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

// ---------- Main Screen ----------

export default function LetterLandScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [mode, setMode] = useState<ScreenMode>('home');
  const [matchRound, setMatchRound] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<LetterDef | null>(null);
  const { completeLevel } = useProgress('letterLand');
  const sound = useSound();

  const matchLetters = useMemo(() => getRandomLetters(4), [matchRound]);

  const cardSize =
    (screenWidth - SPACING.md * 2 - SPACING.md * 2) / 3;

  const handleMatchComplete = useCallback(
    (stars: number) => {
      completeLevel(`match-round-${matchRound}`, stars);
      sound.playStar();
      setTimeout(() => {
        setMatchRound((r) => r + 1);
      }, 3000);
    },
    [matchRound, completeLevel, sound]
  );

  const handleLetterPress = useCallback(
    (letter: LetterDef) => {
      sound.playTap();
      setSelectedLetter(letter);
    },
    [sound]
  );

  const handleCloseDetail = useCallback(() => {
    setSelectedLetter(null);
  }, []);

  const handleStartMatch = useCallback(() => {
    setMode('tutorial');
  }, []);

  const handleTutorialDone = useCallback(() => {
    setMode('match');
  }, []);

  return (
    <View style={styles.container}>
      <GameHeader
        title={S.letterLand.id}
        subtitle={S.letterLand.en}
        color={COLORS.letterLand}
      />

      {/* Home: Letter grid + Match button */}
      {mode === 'home' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.homeContent}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={handleStartMatch}
            style={styles.matchButtonPressable}
          >
            <View style={styles.matchButton}>
              <View style={styles.matchEmojiContainer}>
                <Text style={styles.matchEmoji}>🎯</Text>
              </View>
              <View style={styles.matchTextContainer}>
                <Text style={styles.matchTitle}>Cocokkan Huruf</Text>
                <Text style={styles.matchSubtitle}>Match Letters</Text>
              </View>
              <Text style={styles.matchArrow}>▶</Text>
            </View>
          </Pressable>

          <View style={styles.letterGrid}>
            {LETTERS.map((letter) => (
              <LetterCard
                key={letter.letter}
                letter={letter}
                onPress={handleLetterPress}
                size={cardSize}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {/* Tutorial */}
      {mode === 'tutorial' && (
        <MatchTutorial onStart={handleTutorialDone} />
      )}

      {/* Match Mode */}
      {mode === 'match' && (
        <View style={styles.fullContent}>
          <View style={styles.gameContainer}>
            <LetterMatchGame
              key={`round-${matchRound}`}
              letters={matchLetters}
              onComplete={handleMatchComplete}
            />
          </View>

          <View style={styles.matchBottomButtons}>
            <Pressable
              style={styles.tryAgainButton}
              onPress={() => setMatchRound((r) => r + 1)}
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
              <Text style={styles.backToHomeText}>◀ {S.back.id} / {S.back.en}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Letter Detail Overlay */}
      {selectedLetter && (
        <LetterDetailOverlay
          letter={selectedLetter}
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
    paddingBottom: SPACING.xxl * 2,
  },

  // Letter grid
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },

  // Match game button
  matchButtonPressable: {
    marginBottom: SPACING.md,
  },
  matchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.blue,
    ...SHADOWS.medium,
  },
  matchEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchEmoji: {
    fontSize: 24,
  },
  matchTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  matchTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  matchSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  matchArrow: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },

  // Match mode
  fullContent: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
  },
  matchBottomButtons: {
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
    backgroundColor: COLORS.letterLand,
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

  // Tutorial overlay
  tutorialOverlay: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  tutorialHeader: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  tutorialTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  tutorialSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // Tutorial demo
  tutorialDemoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SPACING.sm,
    height: 110,
    width: '100%',
    paddingHorizontal: SPACING.md,
  },
  tutorialDragGroup: {
    position: 'absolute',
    left: SPACING.md,
    alignItems: 'center',
    zIndex: 10,
  },
  tutorialLetterBox: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: '#FFB5B5',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  tutorialLetterText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
  },
  tutorialLetterGhost: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: '#FFB5B5',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialLetterGhostText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFB5B5',
  },
  tutorialHandEmoji: {
    fontSize: 28,
    marginTop: -4,
  },
  tutorialArrowArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialArrowText: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  tutorialWordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderStyle: 'dashed',
    ...SHADOWS.small,
  },
  tutorialWordEmoji: {
    fontSize: 24,
  },
  tutorialWordText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },

  // Tutorial steps
  tutorialSteps: {
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  tutorialStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.small,
  },
  tutorialStepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorialStepNumber: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  tutorialStepTextBox: {
    flex: 1,
  },
  tutorialStepText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  tutorialStepTextEn: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 1,
  },

  // Tutorial start button (pinned to bottom)
  tutorialBottom: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.lg,
  },
  tutorialStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.success,
    borderRadius: RADIUS.xl,
    ...SHADOWS.large,
  },
  tutorialStartEmoji: {
    fontSize: 24,
  },
  tutorialStartText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
  },
  tutorialStartTextEn: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },

  // Letter detail overlay
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
  overlayLetter: {
    fontSize: 80,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: SPACING.sm,
  },
  overlayEmoji: {
    fontSize: 140,
    marginBottom: SPACING.lg,
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
  overlayPhonics: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginBottom: SPACING.xl,
  },
  overlayHint: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    bottom: SPACING.xxl,
  },
});
