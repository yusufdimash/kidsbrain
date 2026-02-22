import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface TargetItem {
  id: string;
  label: string;
  emoji: string;
  completed?: boolean;
  stars?: number;
}

interface TargetSelectionGridProps {
  items: TargetItem[];
  onSelect: (id: string) => void;
  columns?: number;
}

function GridItem({ item, onSelect }: { item: TargetItem; onSelect: (id: string) => void }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => onSelect(item.id)}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10 });
      }}
    >
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.label}>{item.label}</Text>
        {item.completed && (
          <View style={styles.starsRow}>
            {[0, 1, 2].map((i) => (
              <Text key={i} style={styles.star}>
                {i < (item.stars || 0) ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

export default function TargetSelectionGrid({
  items,
  onSelect,
  columns = 3,
}: TargetSelectionGridProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.grid}>
        {items.map((item) => (
          <View
            key={item.id}
            style={[styles.itemWrapper, { width: `${100 / columns}%` }]}
          >
            <GridItem item={item} onSelect={onSelect} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemWrapper: {
    padding: SPACING.xs,
  },
  item: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  emoji: {
    fontSize: 36,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  star: {
    fontSize: 12,
    marginHorizontal: 1,
  },
});
