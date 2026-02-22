import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { S } from '../../constants/strings';
import { LetterDef } from '../../data/letterData';
import { useSound } from '../../hooks/useSound';
import DraggableItem from '../shared/DraggableItem';
import StarReward from '../StarReward';
import ConfettiOverlay from '../ConfettiOverlay';

interface LetterMatchGameProps {
  letters: LetterDef[];
  onComplete: (stars: number) => void;
}

interface TargetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function LetterMatchGame({
  letters,
  onComplete,
}: LetterMatchGameProps) {
  const sound = useSound();
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  // Shuffle words on the right side
  const shuffledWords = useMemo(
    () => [...letters].sort(() => Math.random() - 0.5),
    [letters]
  );

  // Store layouts of target word boxes
  const targetLayouts = useRef<Record<string, TargetLayout>>({});

  const measureTargetRef = useCallback(
    (letter: string) => (ref: View | null) => {
      if (ref) {
        // Use timeout to ensure layout is complete
        setTimeout(() => {
          ref.measureInWindow((x, y, width, height) => {
            if (width > 0 && height > 0) {
              targetLayouts.current[letter] = { x, y, width, height };
            }
          });
        }, 300);
      }
    },
    []
  );

  const handleDragEnd = useCallback(
    (sourceLetter: string, position: { x: number; y: number }) => {
      // Check if dropped on the matching target
      const target = targetLayouts.current[sourceLetter];
      if (!target) return;

      const hitPadding = 30;
      const isHit =
        position.x >= target.x - hitPadding &&
        position.x <= target.x + target.width + hitPadding &&
        position.y >= target.y - hitPadding &&
        position.y <= target.y + target.height + hitPadding;

      if (isHit) {
        // Correct match
        sound.playSuccess();
        setMatched((prev) => {
          const next = new Set(prev);
          next.add(sourceLetter);

          // Check if all matched
          if (next.size === letters.length) {
            setTimeout(() => {
              const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
              setShowComplete(true);
              setTimeout(() => onComplete(stars), 2500);
            }, 500);
          }

          return next;
        });
      } else {
        // Wrong match
        sound.playError();
        setErrors((e) => e + 1);
      }
    },
    [letters.length, errors, sound, onComplete]
  );

  const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{S.letterMatch.id}</Text>
      <Text style={styles.instructionEn}>{S.letterMatch.en}</Text>

      <View style={styles.gameRow}>
        {/* Left side: Draggable letters */}
        <View style={styles.column}>
          {letters.map((l) => (
            <View key={l.letter} style={styles.letterSlot}>
              {matched.has(l.letter) ? (
                <View style={[styles.matchedBadge, { backgroundColor: l.color }]}>
                  <Text style={styles.matchedLetter}>{l.letter}</Text>
                  <Text style={styles.checkMark}>&#10003;</Text>
                </View>
              ) : (
                <DraggableItem
                  onDragEnd={(pos) => handleDragEnd(l.letter, pos)}
                  snapBack={true}
                >
                  <View style={[styles.letterBox, { backgroundColor: l.color }]}>
                    <Text style={styles.letterText}>{l.letter}</Text>
                  </View>
                </DraggableItem>
              )}
            </View>
          ))}
        </View>

        {/* Right side: Target words */}
        <View style={styles.column}>
          {shuffledWords.map((l) => (
            <View
              key={`target-${l.letter}`}
              ref={measureTargetRef(l.letter)}
              style={[
                styles.wordBox,
                matched.has(l.letter) && styles.wordBoxMatched,
              ]}
            >
              <Text style={styles.wordEmoji}>{l.emoji}</Text>
              <Text
                style={[
                  styles.wordText,
                  matched.has(l.letter) && styles.wordTextMatched,
                ]}
              >
                {l.word}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {showComplete && (
        <View style={styles.completeOverlay}>
          <View style={styles.completeBox}>
            <Text style={styles.completeText}>{S.wellDone.id}</Text>
            <Text style={styles.completeTextEn}>{S.wellDone.en}</Text>
            <StarReward stars={stars} size={48} animate={true} />
          </View>
        </View>
      )}

      <ConfettiOverlay visible={showComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: SPACING.lg,
  },
  gameRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  column: {
    flex: 1,
    gap: SPACING.md,
    alignItems: 'center',
  },
  letterSlot: {
    width: '100%',
    alignItems: 'center',
    minHeight: 64,
    justifyContent: 'center',
  },
  letterBox: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  letterText: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
  },
  matchedBadge: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    flexDirection: 'row',
  },
  matchedLetter: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  checkMark: {
    fontSize: 20,
    color: COLORS.success,
    marginLeft: 4,
    fontWeight: '700',
  },
  wordBox: {
    width: '100%',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    minHeight: 64,
    ...SHADOWS.small,
  },
  wordBoxMatched: {
    borderColor: COLORS.success,
    borderStyle: 'solid',
    backgroundColor: '#E8FFE8',
  },
  wordEmoji: {
    fontSize: 22,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  wordTextMatched: {
    color: COLORS.success,
  },
  completeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  completeBox: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.large,
  },
  completeText: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.text,
  },
  completeTextEn: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
});
