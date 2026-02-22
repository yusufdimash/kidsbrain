import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import AnimatedCard from '../components/AnimatedCard';
import { COLORS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';
import { useGameProgress } from '../context/GameProgressContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MODULES: {
  screen: keyof RootStackParamList;
  title: { id: string; en: string };
  emoji: string;
  color: string;
}[] = [
  { screen: 'LetterLand', title: S.letterLand, emoji: '🔤', color: COLORS.letterLand },
  { screen: 'NumberJungle', title: S.numberJungle, emoji: '🔢', color: COLORS.numberJungle },
  { screen: 'ShapeSafari', title: S.shapeSafari, emoji: '🔷', color: COLORS.shapeSafari },
  { screen: 'ColorWorld', title: S.colorWorld, emoji: '🎨', color: COLORS.colorWorld },
  { screen: 'MemoryMagic', title: S.memoryMagic, emoji: '🃏', color: COLORS.memoryMagic },
  { screen: 'PatternGame', title: S.patternGame, emoji: '🧩', color: COLORS.patternGame },
  { screen: 'TracingHome', title: S.tracingFun, emoji: '✏️', color: COLORS.tracingFun },
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { state } = useGameProgress();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + SPACING.lg, paddingBottom: insets.bottom + SPACING.lg },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>🧠 KidsBrain</Text>
        <View style={styles.starBadge}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starCount}>{state.totalStars}</Text>
        </View>
      </View>

      <Text style={styles.title}>{S.homeTitle.id}</Text>
      <Text style={styles.subtitle}>{S.homeTitle.en}</Text>

      {/* Module Grid */}
      <View style={styles.grid}>
        {MODULES.map((mod, index) => (
          <View key={mod.screen} style={styles.cardWrapper}>
            <AnimatedCard
              title={mod.title.id}
              subtitle={mod.title.en}
              emoji={mod.emoji}
              color={mod.color}
              onPress={() => navigation.navigate(mod.screen as any)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  starIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  starCount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardWrapper: {
    width: '50%',
  },
});
