import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import GameHeader from '../components/GameHeader';
import ZooBookOverlay from '../components/ZooBookOverlay';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';
import { useZooCollection } from '../hooks/useZooCollection';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const MODES = [
  {
    screen: 'LetterTracing' as const,
    title: S.tracingLetters,
    emoji: '🔤',
    color: COLORS.pink,
  },
  {
    screen: 'ShapeTracing' as const,
    title: S.tracingShapes,
    emoji: '🔷',
    color: COLORS.blue,
  },
  {
    screen: 'AnimalTracing' as const,
    title: S.tracingAnimals,
    emoji: '🦁',
    color: COLORS.green,
  },
];

function ModeRow({
  emoji,
  title,
  subtitle,
  color,
  onPress,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
    >
      <Animated.View style={[styles.modeRow, { backgroundColor: color }, animatedStyle]}>
        <View style={styles.modeEmojiContainer}>
          <Text style={styles.modeEmoji}>{emoji}</Text>
        </View>
        <View style={styles.modeTextContainer}>
          <Text style={styles.modeTitle}>{title}</Text>
          <Text style={styles.modeSubtitle}>{subtitle}</Text>
        </View>
        <Text style={styles.modeArrow}>▶</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function TracingHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { count } = useZooCollection();
  const [showZoo, setShowZoo] = useState(false);

  return (
    <View style={styles.container}>
      <GameHeader title={S.tracingFun.id} subtitle={S.tracingFun.en} />

      <View style={styles.content}>
        {MODES.map((mode) => (
          <ModeRow
            key={mode.screen}
            emoji={mode.emoji}
            title={mode.title.id}
            subtitle={mode.title.en}
            color={mode.color}
            onPress={() => navigation.navigate(mode.screen)}
          />
        ))}

        {/* Zoo Book Button */}
        <Pressable style={styles.zooButton} onPress={() => setShowZoo(true)}>
          <Text style={styles.zooEmoji}>🦁</Text>
          <View style={styles.zooTextContainer}>
            <Text style={styles.zooText}>{S.zooBook.id}</Text>
            <Text style={styles.zooSubtext}>
              {count} {S.zooCollected.en.toLowerCase()}
            </Text>
          </View>
        </Pressable>
      </View>

      <ZooBookOverlay visible={showZoo} onClose={() => setShowZoo(false)} />
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
    padding: SPACING.md,
    gap: SPACING.md,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    ...SHADOWS.medium,
  },
  modeEmojiContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeEmoji: {
    fontSize: 28,
  },
  modeTextContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  modeSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  modeArrow: {
    fontSize: 16,
    color: COLORS.textLight,
    marginLeft: SPACING.sm,
  },
  zooButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.sm,
    gap: SPACING.md,
    ...SHADOWS.small,
  },
  zooEmoji: {
    fontSize: 40,
  },
  zooTextContainer: {
    flex: 1,
  },
  zooText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  zooSubtext: {
    fontSize: 13,
    color: COLORS.textLight,
  },
});
