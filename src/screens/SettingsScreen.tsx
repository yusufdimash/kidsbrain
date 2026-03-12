import React from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import GameHeader from '../components/GameHeader';
import { useGameProgress } from '../context/GameProgressContext';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';

function AudioToggleRow({
  emoji,
  title,
  subtitle,
  value,
  onToggle,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowEmoji}>{emoji}</Text>
        <View>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#D0D0D0', true: COLORS.success }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { state, dispatch } = useGameProgress();

  const handleReset = () => {
    Alert.alert(S.resetProgress.id, S.resetConfirm.id + '\n' + S.resetConfirm.en, [
      { text: S.back.en, style: 'cancel' },
      {
        text: S.resetProgress.en,
        style: 'destructive',
        onPress: () => dispatch({ type: 'RESET' }),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <GameHeader title={S.settings.id} subtitle={S.settings.en} showStars={false} />

      <View style={styles.content}>
        <AudioToggleRow
          emoji="🔊"
          title={state.soundEnabled ? S.soundOn.id : S.soundOff.id}
          subtitle={state.soundEnabled ? S.soundOn.en : S.soundOff.en}
          value={state.soundEnabled}
          onToggle={() => dispatch({ type: 'TOGGLE_SOUND' })}
        />

        <AudioToggleRow
          emoji="🎵"
          title={state.musicEnabled ? S.musicOn.id : S.musicOff.id}
          subtitle={state.musicEnabled ? S.musicOn.en : S.musicOff.en}
          value={state.musicEnabled}
          onToggle={() => dispatch({ type: 'TOGGLE_MUSIC' })}
        />

        <AudioToggleRow
          emoji="👏"
          title={state.sfxEnabled ? S.sfxOn.id : S.sfxOff.id}
          subtitle={state.sfxEnabled ? S.sfxOn.en : S.sfxOff.en}
          value={state.sfxEnabled}
          onToggle={() => dispatch({ type: 'TOGGLE_SFX' })}
        />

        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Statistik / Statistics</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>⭐ {S.stars.id} / {S.stars.en}</Text>
            <Text style={styles.statValue}>{state.totalStars}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>🦁 {S.zooBook.en}</Text>
            <Text style={styles.statValue}>{state.zooCollection.length}</Text>
          </View>
        </View>

        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetText}>🗑️ {S.resetProgress.id}</Text>
          <Text style={styles.resetSubtext}>{S.resetProgress.en}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  rowEmoji: {
    fontSize: 28,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  rowSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  statsCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
    ...SHADOWS.small,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statLabel: {
    fontSize: 15,
    color: COLORS.text,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  resetButton: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
  resetSubtext: {
    fontSize: 13,
    color: COLORS.error,
    opacity: 0.7,
  },
});
