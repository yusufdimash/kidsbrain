import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLOR_NAMES, DEFAULT_COLORS } from './ColorPalette';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { S, bilingualInline } from '../../constants/strings';
import { useSound } from '../../hooks/useSound';

interface ColorNameQuizProps {
  rounds?: number;
  onComplete: (stars: number) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export default function ColorNameQuiz({ rounds = 6, onComplete }: ColorNameQuizProps) {
  const sound = useSound();
  const questions = useMemo(() => {
    return shuffle(DEFAULT_COLORS).slice(0, rounds).map((target, idx) => {
      const wrong = shuffle(DEFAULT_COLORS.filter((c) => c !== target)).slice(0, 2);
      return {
        id: `q-${idx}`,
        target,
        options: shuffle([target, ...wrong]),
      };
    });
  }, [rounds]);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);

  const current = questions[index];

  const finish = (finalScore: number) => {
    const ratio = finalScore / rounds;
    const stars = ratio >= 0.9 ? 3 : ratio >= 0.65 ? 2 : 1;
    onComplete(stars);
  };

  const handleAnswer = (picked: string) => {
    if (locked) return;
    setLocked(true);

    const isCorrect = picked === current.target;
    if (isCorrect) {
      sound.playSuccess();
      setScore((s) => s + 1);
    } else {
      sound.playError();
    }

    setTimeout(() => {
      if (index === rounds - 1) {
        finish(isCorrect ? score + 1 : score);
      } else {
        setIndex((i) => i + 1);
        setLocked(false);
      }
    }, 450);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{S.colorNameQuiz.id}</Text>
      <Text style={styles.subtitle}>{S.colorNameQuiz.en}</Text>

      <View style={[styles.targetCircle, { backgroundColor: current.target }]} />
      <Text style={styles.prompt}>Pilih nama warna ini / Pick this color name</Text>
      <Text style={styles.progress}>Soal {index + 1}/{rounds}</Text>

      <View style={styles.options}>
        {current.options.map((opt) => (
          <Pressable key={opt} style={styles.optionBtn} onPress={() => handleAnswer(opt)}>
            <Text style={styles.optionText}>{bilingualInline(COLOR_NAMES[opt])}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    marginHorizontal: SPACING.md,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  targetCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: SPACING.md,
  },
  prompt: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  progress: {
    marginTop: SPACING.xs,
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: SPACING.md,
  },
  options: {
    width: '100%',
    gap: SPACING.sm,
  },
  optionBtn: {
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
});
