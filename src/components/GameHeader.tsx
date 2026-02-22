import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '../constants/theme';
import { useGameProgress } from '../context/GameProgressContext';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  showStars?: boolean;
  showBack?: boolean;
  color?: string;
}

export default function GameHeader({
  title,
  subtitle,
  showStars = true,
  showBack = true,
  color,
}: GameHeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state } = useGameProgress();

  return (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      <View style={styles.row}>
        {showBack && (
          <Pressable
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={12}
          >
            <Text style={styles.backText}>◀</Text>
          </Pressable>
        )}

        <View style={styles.titleContainer}>
          <Text style={[styles.title, color ? { color } : undefined]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {showStars && (
          <View style={styles.starContainer}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starCount}>{state.totalStars}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  backText: {
    fontSize: 18,
    color: COLORS.text,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  starCount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
});
