import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';
import GameHeader from './GameHeader';

interface PlaceholderScreenProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  color?: string;
}

export default function PlaceholderScreen({
  title,
  subtitle,
  emoji = '🚧',
  color,
}: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <GameHeader title={title} subtitle={subtitle} color={color} />
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{S.comingSoon.id}</Text>
        <Text style={styles.subtitle}>{S.comingSoon.en}</Text>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
