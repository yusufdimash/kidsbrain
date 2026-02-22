import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  BounceIn,
} from 'react-native-reanimated';
import GameHeader from '../components/GameHeader';
import StarReward from '../components/StarReward';
import ConfettiOverlay from '../components/ConfettiOverlay';
import ShapeCharacter from '../components/shapes/ShapeCharacter';
import ShapeMatchGame from '../components/shapes/ShapeMatchGame';
import HiddenShapeGame from '../components/shapes/HiddenShapeGame';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { S, bilingual } from '../constants/strings';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';
import { SHAPES, shuffleShapes } from '../data/shapeData';
import type { ShapeDef } from '../data/shapeData';

type GameMode = 'home' | 'match' | 'find';

// ---------- Shape Detail Overlay ----------

function ShapeDetailOverlay({
  shape,
  onClose,
}: {
  shape: ShapeDef;
  onClose: () => void;
}) {
  return (
    <Animated.View
      entering={FadeIn.duration(250)}
      exiting={FadeOut.duration(200)}
      style={[styles.overlay, { backgroundColor: shape.color + '40' }]}
    >
      <Pressable style={styles.overlayPressable} onPress={onClose}>
        <Animated.View entering={BounceIn.duration(500)}>
          <ShapeCharacter shape={shape} size={160} showFace={true} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.overlayWordContainer}
        >
          <Text style={styles.overlayWord}>{shape.name}</Text>
          <Text style={styles.overlayWordEn}>{shape.nameEn}</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.overlayFactContainer}
        >
          <Text style={styles.overlayFact}>{shape.funFact.id}</Text>
          <Text style={styles.overlayFactEn}>{shape.funFact.en}</Text>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(600).duration(400)}
          style={styles.overlaySides}
        >
          {shape.sides > 0
            ? `${shape.sides} sisi / ${shape.sides} sides`
            : 'Tidak ada sisi / No sides'}
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

export default function ShapeSafariScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const { bottom: bottomInset } = useSafeAreaInsets();
  const progress = useProgress('shapeSafari');
  const sound = useSound();

  const [mode, setMode] = useState<GameMode>('home');
  const [selectedShape, setSelectedShape] = useState<ShapeDef | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rewardStars, setRewardStars] = useState(0);
  const [matchKey, setMatchKey] = useState(0);
  const [findKey, setFindKey] = useState(0);

  const matchShapes = useMemo(
    () => shuffleShapes(SHAPES),
    [matchKey]
  );

  const findShapes = useMemo(
    () => shuffleShapes(SHAPES),
    [findKey]
  );

  // Gallery card size: 3-column grid matching LetterLand
  const cardSize = (screenWidth - SPACING.md * 2 - SPACING.md * 2) / 3;

  const handleMatchComplete = useCallback(
    (stars: number) => {
      sound.playStar();
      progress.completeLevel('match', stars);
      setRewardStars(stars);
      setShowConfetti(true);
    },
    [progress, sound]
  );

  const handleFindComplete = useCallback(
    (stars: number) => {
      sound.playStar();
      progress.completeLevel('find', stars);
      setRewardStars(stars);
      setShowConfetti(true);
    },
    [progress, sound]
  );

  const handleShapeTap = useCallback(
    (shape: ShapeDef) => {
      sound.playTap();
      setSelectedShape(shape);
    },
    [sound]
  );

  const handleCloseDetail = useCallback(() => {
    setSelectedShape(null);
  }, []);

  const handleBack = useCallback(() => {
    if (showConfetti) {
      setShowConfetti(false);
      setRewardStars(0);
    }
    setMode('home');
  }, [showConfetti]);

  const handlePlayAgain = useCallback(() => {
    setShowConfetti(false);
    setRewardStars(0);
    if (mode === 'match') {
      setMatchKey((k) => k + 1);
    } else if (mode === 'find') {
      setFindKey((k) => k + 1);
    }
  }, [mode]);

  return (
    <View style={styles.screen}>
      <GameHeader
        title={S.shapeSafari.id}
        subtitle={S.shapeSafari.en}
        color={COLORS.shapeSafari}
      />

      {/* ========== HOME: Activity buttons + Shape gallery ========== */}
      {mode === 'home' && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.homeContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Match button */}
          <Pressable
            onPress={() => {
              setMatchKey((k) => k + 1);
              setMode('match');
            }}
            style={styles.activityButtonPressable}
          >
            <View style={[styles.activityButton, { backgroundColor: COLORS.blue }]}>
              <View style={styles.activityEmojiContainer}>
                <Text style={styles.activityEmoji}>🧩</Text>
              </View>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityTitle}>Cocokkan Bentuk</Text>
                <Text style={styles.activitySubtitle}>Match the Shape</Text>
              </View>
              <Text style={styles.activityArrow}>▶</Text>
            </View>
          </Pressable>

          {/* Find button */}
          <Pressable
            onPress={() => {
              setFindKey((k) => k + 1);
              setMode('find');
            }}
            style={styles.activityButtonPressable}
          >
            <View style={[styles.activityButton, { backgroundColor: COLORS.purple }]}>
              <View style={styles.activityEmojiContainer}>
                <Text style={styles.activityEmoji}>🔍</Text>
              </View>
              <View style={styles.activityTextContainer}>
                <Text style={styles.activityTitle}>Cari Bentuk</Text>
                <Text style={styles.activitySubtitle}>Find the Shape</Text>
              </View>
              <Text style={styles.activityArrow}>▶</Text>
            </View>
          </Pressable>

          {/* Shape gallery grid */}
          <View style={styles.shapeGrid}>
            {SHAPES.map((shape, index) => (
              <Animated.View
                key={shape.id}
                entering={FadeInDown.delay(index * 50).duration(300)}
              >
                <Pressable onPress={() => handleShapeTap(shape)}>
                  <View
                    style={[
                      styles.shapeCard,
                      {
                        width: cardSize,
                        height: cardSize + 20,
                      },
                    ]}
                  >
                    <ShapeCharacter shape={shape} size={cardSize * 0.5} showFace={true} />
                    <Text style={styles.shapeName}>{shape.name}</Text>
                    <Text style={styles.shapeNameEn}>{shape.nameEn}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* ========== MATCH MODE ========== */}
      {mode === 'match' && !showConfetti && (
        <View style={styles.fullContent}>
          <View style={styles.gameContainer}>
            <ShapeMatchGame
              key={matchKey}
              shapes={matchShapes}
              onComplete={handleMatchComplete}
            />
          </View>

          <View style={[styles.bottomButtons, { paddingBottom: bottomInset + SPACING.sm }]}>
            <Pressable
              style={styles.tryAgainButton}
              onPress={() => setMatchKey((k) => k + 1)}
            >
              <Text style={styles.tryAgainEmoji}>🔄</Text>
              <Text style={styles.tryAgainText}>
                {S.retry.id} / {S.retry.en}
              </Text>
            </Pressable>

            <Pressable style={styles.backToHomeButton} onPress={handleBack}>
              <Text style={styles.backToHomeText}>
                ◀ {S.back.id} / {S.back.en}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ========== FIND MODE ========== */}
      {mode === 'find' && !showConfetti && (
        <View style={styles.fullContent}>
          <View style={styles.gameContainer}>
            <HiddenShapeGame
              key={findKey}
              shapes={findShapes}
              rounds={5}
              onComplete={handleFindComplete}
            />
          </View>

          <View style={[styles.bottomButtons, { paddingBottom: bottomInset + SPACING.sm }]}>
            <Pressable
              style={styles.tryAgainButton}
              onPress={() => setFindKey((k) => k + 1)}
            >
              <Text style={styles.tryAgainEmoji}>🔄</Text>
              <Text style={styles.tryAgainText}>
                {S.retry.id} / {S.retry.en}
              </Text>
            </Pressable>

            <Pressable style={styles.backToHomeButton} onPress={handleBack}>
              <Text style={styles.backToHomeText}>
                ◀ {S.back.id} / {S.back.en}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ========== Reward overlay ========== */}
      {showConfetti && (
        <View style={styles.rewardOverlay}>
          <ConfettiOverlay visible={true} />
          <Animated.View entering={FadeIn.duration(500)} style={styles.rewardCard}>
            <Text style={styles.rewardEmoji}>🏆</Text>
            <Text style={styles.rewardTitle}>{bilingual(S.amazing)}</Text>
            <StarReward stars={rewardStars} size={44} />
            <View style={styles.rewardButtonsColumn}>
              <Pressable style={styles.rewardPlayAgainButton} onPress={handlePlayAgain}>
                <Text style={styles.rewardPlayAgainEmoji}>🔄</Text>
                <Text style={styles.rewardPlayAgainText}>
                  {S.retry.id} / {S.retry.en}
                </Text>
              </Pressable>
              <Pressable style={styles.rewardBackButton} onPress={handleBack}>
                <Text style={styles.rewardBackText}>
                  ◀ {S.back.id} / {S.back.en}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      )}

      {/* ========== Shape Detail Overlay ========== */}
      {selectedShape && (
        <ShapeDetailOverlay shape={selectedShape} onClose={handleCloseDetail} />
      )}
    </View>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  screen: {
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

  // Activity buttons (matches LetterLand/NumberJungle)
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

  // Shape grid
  shapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.sm,
  },
  shapeCard: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    ...SHADOWS.medium,
  },
  shapeName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  shapeNameEn: {
    fontSize: 9,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // Game modes
  fullContent: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
  },

  // Bottom buttons (matches LetterLand/NumberJungle)
  bottomButtons: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.blue,
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

  // Reward overlay
  rewardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,248,240,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  rewardCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 320,
  },
  rewardEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  rewardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  rewardButtonsColumn: {
    width: '100%',
    gap: SPACING.lg,
    marginTop: SPACING.xl,
  },
  rewardPlayAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.blue,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  rewardPlayAgainEmoji: {
    fontSize: 20,
  },
  rewardPlayAgainText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  rewardBackButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  rewardBackText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
  },

  // Shape detail overlay
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
  overlayWordContainer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
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
  overlayFactContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    maxWidth: 300,
  },
  overlayFact: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  overlayFactEn: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  overlaySides: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  overlayHint: {
    fontSize: 14,
    color: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    bottom: SPACING.xxl,
  },
});
