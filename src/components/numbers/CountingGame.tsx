import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { S } from '../../constants/strings';
import { useSound } from '../../hooks/useSound';
import StarReward from '../StarReward';
import ConfettiOverlay from '../ConfettiOverlay';

interface CountingGameProps {
  targetCount: number;
  emoji: string;
  onComplete: (stars: number) => void;
}

interface EmojiItem {
  id: number;
  x: number;
  y: number;
  tapped: boolean;
  order: number;
}

type Phase = 'counting' | 'choosing' | 'result';

function TappableEmoji({
  item,
  emoji,
  onTap,
}: {
  item: EmojiItem;
  emoji: string;
  onTap: (id: number) => void;
}) {
  const scale = useSharedValue(1);
  const bounceY = useSharedValue(0);

  const handleTap = useCallback(() => {
    if (item.tapped) return;

    scale.value = withSequence(
      withSpring(1.4, { damping: 6, stiffness: 300 }),
      withSpring(1.1, { damping: 10, stiffness: 200 })
    );
    bounceY.value = withSequence(
      withSpring(-15, { damping: 8, stiffness: 200 }),
      withSpring(0, { damping: 10, stiffness: 150 })
    );

    onTap(item.id);
  }, [item.id, item.tapped, scale, bounceY, onTap]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: bounceY.value },
    ],
  }));

  return (
    <Pressable
      onPress={handleTap}
      style={[
        styles.emojiItem,
        { left: item.x, top: item.y },
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Text style={styles.emojiText}>{emoji}</Text>
        {item.tapped && (
          <View style={styles.numberBadge}>
            <Text style={styles.numberBadgeText}>{item.order}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function CountingGame({
  targetCount,
  emoji,
  onComplete,
}: CountingGameProps) {
  const sound = useSound();
  const { width: screenWidth } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>('counting');
  const [tappedCount, setTappedCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [errors, setErrors] = useState(0);

  // Scatter area dimensions
  const areaWidth = screenWidth - SPACING.md * 2 - 40;
  const areaHeight = 280;

  // Generate scattered positions (avoid overlaps)
  const items = useMemo<EmojiItem[]>(() => {
    const cellSize = 55;
    const cols = Math.floor(areaWidth / cellSize);
    const rows = Math.floor(areaHeight / cellSize);
    const positions: { x: number; y: number }[] = [];

    // Create grid cells and shuffle
    const cells: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({
          x: c * cellSize + Math.random() * 15,
          y: r * cellSize + Math.random() * 15,
        });
      }
    }
    const shuffled = cells.sort(() => Math.random() - 0.5);

    for (let i = 0; i < targetCount && i < shuffled.length; i++) {
      positions.push(shuffled[i]);
    }

    return positions.map((pos, idx) => ({
      id: idx,
      x: pos.x,
      y: pos.y,
      tapped: false,
      order: 0,
    }));
  }, [targetCount, areaWidth, areaHeight]);

  const [emojiItems, setEmojiItems] = useState<EmojiItem[]>(items);

  const handleTap = useCallback(
    (id: number) => {
      sound.playTap();

      setEmojiItems((prev) => {
        const newCount = prev.filter((i) => i.tapped).length + 1;
        setTappedCount(newCount);

        const updated = prev.map((item) =>
          item.id === id ? { ...item, tapped: true, order: newCount } : item
        );

        // Check if all tapped
        if (newCount === targetCount) {
          setTimeout(() => setPhase('choosing'), 600);
        }

        return updated;
      });
    },
    [targetCount, sound]
  );

  // Generate answer choices
  const answerOptions = useMemo(() => {
    const correct = targetCount;
    const opts = new Set<number>([correct]);

    while (opts.size < 3) {
      const offset = Math.random() > 0.5 ? 1 : -1;
      const delta = Math.floor(Math.random() * 3) + 1;
      const val = correct + offset * delta;
      if (val > 0 && val <= 20) {
        opts.add(val);
      }
    }

    return Array.from(opts).sort(() => Math.random() - 0.5);
  }, [targetCount]);

  const handleAnswer = useCallback(
    (answer: number) => {
      setSelectedAnswer(answer);

      if (answer === targetCount) {
        sound.playSuccess();
        setIsCorrect(true);
        setPhase('result');

        const stars = errors === 0 ? 3 : errors === 1 ? 2 : 1;
        setTimeout(() => onComplete(stars), 2500);
      } else {
        sound.playError();
        setErrors((e) => e + 1);

        // Reset selection after shake feedback
        setTimeout(() => setSelectedAnswer(null), 800);
      }
    },
    [targetCount, errors, sound, onComplete]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{S.countTitle.id}</Text>
      <Text style={styles.instructionEn}>{S.countTitle.en}</Text>

      {/* Counter display */}
      <View style={styles.counterRow}>
        <Text style={styles.counterLabel}>
          {tappedCount} / {targetCount}
        </Text>
      </View>

      {/* Scatter area */}
      <View style={[styles.scatterArea, { height: areaHeight }]}>
        {emojiItems.map((item) => (
          <TappableEmoji
            key={item.id}
            item={item}
            emoji={emoji}
            onTap={handleTap}
          />
        ))}
      </View>

      {/* Answer choices */}
      {phase === 'choosing' && (
        <View style={styles.choicesSection}>
          <Text style={styles.questionText}>
            {S.numberTitle.id} / {S.numberTitle.en}
          </Text>
          <View style={styles.choicesRow}>
            {answerOptions.map((opt) => {
              const isSelected = selectedAnswer === opt;
              const isWrong = isSelected && opt !== targetCount;

              return (
                <Pressable
                  key={opt}
                  style={[
                    styles.choiceButton,
                    isSelected &&
                      opt === targetCount &&
                      styles.choiceCorrect,
                    isWrong && styles.choiceWrong,
                  ]}
                  onPress={() => handleAnswer(opt)}
                  disabled={isCorrect}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      isSelected &&
                        opt === targetCount &&
                        styles.choiceTextCorrect,
                      isWrong && styles.choiceTextWrong,
                    ]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* Result */}
      <Modal transparent visible={phase === 'result'} animationType="fade">
        <View style={styles.resultOverlay}>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{S.correct.id}</Text>
            <Text style={styles.resultTextEn}>{S.correct.en}</Text>
            <StarReward
              stars={errors === 0 ? 3 : errors === 1 ? 2 : 1}
              size={48}
              animate={true}
            />
          </View>
          <ConfettiOverlay visible={true} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  instruction: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 2,
  },
  instructionEn: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  counterRow: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  counterLabel: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  scatterArea: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.small,
  },
  emojiItem: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 32,
  },
  numberBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
  choicesSection: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  choicesRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  choiceButton: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  choiceCorrect: {
    backgroundColor: COLORS.success,
  },
  choiceWrong: {
    backgroundColor: COLORS.error,
  },
  choiceText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
  },
  choiceTextCorrect: {
    color: COLORS.textWhite,
  },
  choiceTextWrong: {
    color: COLORS.textWhite,
  },
  resultOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.large,
  },
  resultText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  resultTextEn: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
});
