import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import StarReward from '../StarReward';
import ConfettiOverlay from '../ConfettiOverlay';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { S } from '../../constants/strings';

interface TracingResultScreenProps {
  stars: number;
  accuracy: number;
  onRetry: () => void;
  onNext?: () => void;
  onCollection?: () => void;
  targetName: string;
}

export default function TracingResultScreen({
  stars,
  accuracy,
  onRetry,
  onNext,
  onCollection,
  targetName,
}: TracingResultScreenProps) {
  const feedback =
    stars === 3 ? S.perfect : stars === 2 ? S.goodJob : S.keepGoing;

  return (
    <View style={styles.container}>
      <ConfettiOverlay visible={stars >= 2} />

      <View style={styles.card}>
        <Text style={styles.targetName}>{targetName}</Text>
        <StarReward stars={stars} size={52} animate />

        <Text style={styles.feedback}>{feedback.id}</Text>
        <Text style={styles.feedbackEn}>{feedback.en}</Text>

        <Text style={styles.accuracy}>
          {Math.round(accuracy)}% akurasi
        </Text>

        <View style={styles.buttonRow}>
          <Pressable style={[styles.button, styles.retryButton]} onPress={onRetry}>
            <Text style={styles.buttonText}>{S.retry.id}</Text>
            <Text style={styles.buttonSubtext}>{S.retry.en}</Text>
          </Pressable>

          {onNext && (
            <Pressable style={[styles.button, styles.nextButton]} onPress={onNext}>
              <Text style={[styles.buttonText, styles.nextText]}>{S.next.id}</Text>
              <Text style={[styles.buttonSubtext, styles.nextText]}>{S.next.en}</Text>
            </Pressable>
          )}
        </View>

        {onCollection && (
          <Pressable style={styles.collectionButton} onPress={onCollection}>
            <Text style={styles.collectionText}>
              🦁 {S.zooBook.id} / {S.zooBook.en}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  targetName: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  feedback: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  feedbackEn: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  accuracy: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.xl,
  },
  button: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  retryButton: {
    backgroundColor: COLORS.yellow,
  },
  nextButton: {
    backgroundColor: COLORS.success,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  buttonSubtext: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  nextText: {
    color: COLORS.textWhite,
  },
  collectionButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  collectionText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});
