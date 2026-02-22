import React, { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameHeader from '../components/GameHeader';
import StarReward from '../components/StarReward';
import ConfettiOverlay from '../components/ConfettiOverlay';
import ColoringCanvas, { PICTURES } from '../components/colors/ColoringCanvas';
import type { PictureTemplate } from '../components/colors/ColoringCanvas';
import ColorPalette, { DEFAULT_COLORS, COLOR_NAMES } from '../components/colors/ColorPalette';
import ColorMixGame from '../components/colors/ColorMixGame';
import OddOneOutGame from '../components/colors/OddOneOutGame';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { S, bilingual } from '../constants/strings';
import { useProgress } from '../hooks/useProgress';
import { useSound } from '../hooks/useSound';

type GameMode = 'menu' | 'coloring' | 'mix' | 'odd';

const MODE_BUTTONS: { mode: GameMode; labelId: string; labelEn: string; emoji: string }[] = [
  { mode: 'coloring', labelId: 'Mewarnai', labelEn: 'Coloring', emoji: '🖌️' },
  { mode: 'mix', labelId: 'Campur', labelEn: 'Mix', emoji: '🧪' },
  { mode: 'odd', labelId: 'Cari Beda', labelEn: 'Odd One', emoji: '👁️' },
];

export default function ColorWorldScreen() {
  const progress = useProgress('colorWorld');
  const sound = useSound();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<GameMode>('menu');
  const [showConfetti, setShowConfetti] = useState(false);
  const [rewardStars, setRewardStars] = useState(0);

  // Coloring state
  const [selectedPicture, setSelectedPicture] = useState<PictureTemplate | null>(null);
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [filledZones, setFilledZones] = useState<Record<string, string>>({});

  const completionTriggered = useRef(false);

  // Game keys for remount
  const [mixKey, setMixKey] = useState(0);
  const [oddKey, setOddKey] = useState(0);

  const handleZoneFill = useCallback(
    (zoneId: string) => {
      sound.playTap();
      setFilledZones((prev) => ({ ...prev, [zoneId]: selectedColor }));
    },
    [selectedColor, sound]
  );

  const handleColoringComplete = useCallback(() => {
    if (!selectedPicture) return;
    const totalZones = selectedPicture.zones.length;
    const filledCount = Object.keys(filledZones).length;
    if (filledCount >= totalZones) {
      sound.playStar();
      progress.completeLevel(`coloring_${selectedPicture.id}`, 3);
      setRewardStars(3);
      setShowConfetti(true);
    }
  }, [selectedPicture, filledZones, progress, sound]);

  // Check if coloring is complete whenever zones change
  React.useEffect(() => {
    if (mode !== 'coloring' || !selectedPicture) return;
    if (completionTriggered.current) return;
    const totalZones = selectedPicture.zones.length;
    const filledCount = Object.keys(filledZones).length;
    if (filledCount >= totalZones && filledCount > 0) {
      completionTriggered.current = true;
      setTimeout(handleColoringComplete, 500);
    }
  }, [filledZones, mode, selectedPicture, handleColoringComplete]);

  const handleMixComplete = useCallback(
    (stars: number) => {
      sound.playStar();
      progress.completeLevel('mix', stars);
      setRewardStars(stars);
      setShowConfetti(true);
    },
    [progress, sound]
  );

  const handleOddComplete = useCallback(
    (stars: number) => {
      sound.playStar();
      progress.completeLevel('odd', stars);
      setRewardStars(stars);
      setShowConfetti(true);
    },
    [progress, sound]
  );

  const handleBack = () => {
    if (showConfetti) {
      setShowConfetti(false);
      setRewardStars(0);
    }
    if (mode === 'coloring' && selectedPicture) {
      completionTriggered.current = false;
      setSelectedPicture(null);
      setFilledZones({});
      return;
    }
    setMode('menu');
  };

  const handlePlayAgain = () => {
    setShowConfetti(false);
    setRewardStars(0);
    if (mode === 'coloring') {
      completionTriggered.current = false;
      setFilledZones({});
    } else if (mode === 'mix') {
      setMixKey((k) => k + 1);
    } else if (mode === 'odd') {
      setOddKey((k) => k + 1);
    }
  };

  const handleSelectPicture = (pic: PictureTemplate) => {
    sound.playTap();
    setSelectedPicture(pic);
    setFilledZones({});
  };

  return (
    <View style={styles.screen}>
      <GameHeader
        title={S.colorWorld.id}
        subtitle={S.colorWorld.en}
        color={COLORS.colorWorld}
      />

      {/* Mode menu */}
      {mode === 'menu' && (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>{bilingual(S.colorTitle)}</Text>

          <View style={styles.modeRow}>
            {MODE_BUTTONS.map((btn, index) => (
              <Animated.View
                key={btn.mode}
                entering={FadeInDown.delay(index * 100).duration(400)}
              >
                <Pressable
                  style={styles.modeCard}
                  onPress={() => setMode(btn.mode)}
                >
                  <Text style={styles.modeEmoji}>{btn.emoji}</Text>
                  <Text style={styles.modeLabelId}>{btn.labelId}</Text>
                  <Text style={styles.modeLabelEn}>{btn.labelEn}</Text>
                  {progress.getStars(btn.mode) > 0 && (
                    <View style={styles.modeStar}>
                      <StarReward
                        stars={progress.getStars(btn.mode)}
                        size={16}
                        animate={false}
                      />
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            ))}
          </View>

          {/* Color preview */}
          <Text style={styles.previewTitle}>Warna / Colors</Text>
          <View style={styles.previewRow}>
            {DEFAULT_COLORS.slice(0, 7).map((color) => (
              <View key={color} style={styles.previewItem}>
                <View
                  style={[
                    styles.previewCircle,
                    { backgroundColor: color },
                  ]}
                />
                <Text style={styles.previewName}>
                  {COLOR_NAMES[color]?.id || ''}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Coloring mode - picture selection */}
      {mode === 'coloring' && !selectedPicture && !showConfetti && (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.pickPictureText}>
            {bilingual(S.colorFill)}
          </Text>

          <View style={styles.pictureGrid}>
            {PICTURES.map((pic, index) => (
              <Animated.View
                key={pic.id}
                entering={FadeInDown.delay(index * 80).duration(300)}
              >
                <Pressable
                  style={styles.pictureCard}
                  onPress={() => handleSelectPicture(pic)}
                >
                  <Text style={styles.pictureEmoji}>{pic.emoji}</Text>
                  <Text style={styles.pictureName}>{pic.nameId}</Text>
                  <Text style={styles.pictureNameEn}>{pic.nameEn}</Text>
                  {progress.getStars(`coloring_${pic.id}`) > 0 && (
                    <View style={styles.pictureStars}>
                      <StarReward
                        stars={progress.getStars(`coloring_${pic.id}`)}
                        size={12}
                        animate={false}
                      />
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            ))}
          </View>

          <View style={[styles.bottomButtons, { marginTop: SPACING.xl }]}>
            <Pressable style={styles.backToHomeButton} onPress={handleBack}>
              <Text style={styles.backToHomeText}>◀ {S.back.id} / {S.back.en}</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* Coloring mode - canvas */}
      {mode === 'coloring' && selectedPicture && !showConfetti && (
        <View style={styles.coloringContainer}>
          {/* Color palette + status at top */}
          <ColorPalette
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
          <View style={styles.statusBar}>
            <View style={styles.statusLeft}>
              <View style={[styles.statusSwatch, { backgroundColor: selectedColor }]} />
              <Text style={styles.statusColorName}>
                {COLOR_NAMES[selectedColor]?.id ?? ''}
              </Text>
            </View>
            <View style={styles.statusRight}>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(Object.keys(filledZones).length / selectedPicture.zones.length) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Object.keys(filledZones).length}/{selectedPicture.zones.length}
              </Text>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.canvasScrollContent}
            style={styles.canvasScroll}
          >
            <ColoringCanvas
              picture={selectedPicture}
              selectedColor={selectedColor}
              onZoneFill={handleZoneFill}
              filledZones={filledZones}
            />
          </ScrollView>

          <View style={[styles.bottomButtons, { paddingBottom: Math.max(insets.bottom, SPACING.lg) }]}>
            <Pressable
              style={styles.tryAgainButton}
              onPress={() => setFilledZones({})}
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

      {/* Mix mode */}
      {mode === 'mix' && !showConfetti && (
        <ScrollView style={styles.gameContainer} contentContainerStyle={styles.gameScrollContent}>
          <ColorMixGame key={mixKey} onComplete={handleMixComplete} />
          <View style={styles.bottomButtons}>
            <Pressable
              style={styles.tryAgainButton}
              onPress={() => setMixKey((k) => k + 1)}
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
        </ScrollView>
      )}

      {/* Odd One Out mode */}
      {mode === 'odd' && !showConfetti && (
        <ScrollView style={styles.gameContainer} contentContainerStyle={styles.gameScrollContent}>
          <OddOneOutGame key={oddKey} rounds={6} onComplete={handleOddComplete} />
          <View style={styles.bottomButtons}>
            <Pressable
              style={styles.tryAgainButton}
              onPress={() => setOddKey((k) => k + 1)}
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
        </ScrollView>
      )}

      {/* Reward overlay */}
      {showConfetti && (
        <View style={styles.rewardOverlay}>
          <ConfettiOverlay visible={true} />
          <Animated.View entering={FadeIn.duration(500)} style={styles.rewardCard}>
            <Text style={styles.rewardEmoji}>🏆</Text>
            <Text style={styles.rewardTitle}>{bilingual(S.amazing)}</Text>
            <StarReward stars={rewardStars} size={44} />
            <View style={styles.rewardButtons}>
              <Pressable
                style={[styles.rewardBtn, styles.rewardBtnPrimary]}
                onPress={handlePlayAgain}
              >
                <Text style={styles.rewardBtnTextPrimary}>
                  {bilingual(S.retry)}
                </Text>
              </Pressable>
              <Pressable style={styles.rewardBtn} onPress={handleBack}>
                <Text style={styles.rewardBtnText}>{bilingual(S.back)}</Text>
              </Pressable>
            </View>
          </Animated.View>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  gameContainer: {
    flex: 1,
  },
  gameScrollContent: {
    flexGrow: 1,
  },
  bottomButtons: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.colorWorld,
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
  coloringContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  modeCard: {
    width: 105,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  modeEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  modeLabelId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  modeLabelEn: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  modeStar: {
    marginTop: SPACING.xs,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  previewItem: {
    alignItems: 'center',
    gap: 2,
  },
  previewCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  previewName: {
    fontSize: 9,
    fontWeight: '600',
    color: '#999',
  },
  // Picture selection
  pickPictureText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  pictureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  pictureCard: {
    width: 140,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  pictureEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  pictureName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  pictureNameEn: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  pictureStars: {
    marginTop: SPACING.xs,
  },
  // Canvas
  canvasScroll: {
    flex: 1,
  },
  canvasScrollContent: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statusSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  statusColorName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressTrack: {
    width: 100,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textLight,
    minWidth: 30,
  },
  // Reward
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
  rewardButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  rewardBtn: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  rewardBtnPrimary: {
    backgroundColor: COLORS.colorWorld,
  },
  rewardBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  rewardBtnTextPrimary: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
});
