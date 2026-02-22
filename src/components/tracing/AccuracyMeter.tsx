import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StarReward from '../StarReward';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { S } from '../../constants/strings';

interface AccuracyMeterProps {
  accuracy: number;
  coverage: number;
  stars: number;
  visible: boolean;
}

export default function AccuracyMeter({
  accuracy,
  coverage,
  stars,
  visible,
}: AccuracyMeterProps) {
  if (!visible) return null;

  const getFeedback = () => {
    if (stars === 3) return S.perfect;
    if (stars === 2) return S.goodJob;
    return S.keepGoing;
  };

  const feedback = getFeedback();

  return (
    <View style={styles.container}>
      <StarReward stars={stars} size={48} animate />
      <Text style={styles.feedback}>{feedback.id}</Text>
      <Text style={styles.feedbackEn}>{feedback.en}</Text>
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{Math.round(accuracy)}%</Text>
          <Text style={styles.statLabel}>Akurasi</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{Math.round(coverage)}%</Text>
          <Text style={styles.statLabel}>Cakupan</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
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
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
});
