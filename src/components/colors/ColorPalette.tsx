import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SPACING, SHADOWS } from '../../constants/theme';

// Default color list
export const DEFAULT_COLORS = [
  '#FF4444', // Red
  '#4488FF', // Blue
  '#44BB44', // Green
  '#FFD700', // Yellow
  '#FF9933', // Orange
  '#9944FF', // Purple
  '#FF77AA', // Pink
  '#8B4513', // Brown
  '#333333', // Black
  '#F5F5F5', // White
];

export const COLOR_NAMES: Record<string, { id: string; en: string }> = {
  '#FF4444': { id: 'Merah', en: 'Red' },
  '#4488FF': { id: 'Biru', en: 'Blue' },
  '#44BB44': { id: 'Hijau', en: 'Green' },
  '#FFD700': { id: 'Kuning', en: 'Yellow' },
  '#FF9933': { id: 'Oranye', en: 'Orange' },
  '#9944FF': { id: 'Ungu', en: 'Purple' },
  '#FF77AA': { id: 'Merah Muda', en: 'Pink' },
  '#8B4513': { id: 'Cokelat', en: 'Brown' },
  '#333333': { id: 'Hitam', en: 'Black' },
  '#F5F5F5': { id: 'Putih', en: 'White' },
};

interface ColorPaletteProps {
  colors?: string[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

function ColorCircle({
  color,
  isSelected,
  onPress,
}: {
  color: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isSelected ? 1.25 : 1, { damping: 12, stiffness: 200 }) },
    ],
  }));

  const names = COLOR_NAMES[color];

  return (
    <Pressable onPress={onPress} style={styles.colorItem}>
      <Animated.View
        style={[
          styles.colorCircle,
          {
            backgroundColor: color,
            borderColor: isSelected ? '#FFFFFF' : 'rgba(0,0,0,0.1)',
            borderWidth: isSelected ? 3 : 1.5,
          },
          isSelected && styles.colorCircleSelected,
          animatedStyle,
        ]}
      >
        {color === '#F5F5F5' && (
          <View style={styles.whiteInner} />
        )}
      </Animated.View>
      {names && (
        <Text style={styles.colorName} numberOfLines={1}>
          {names.id}
        </Text>
      )}
    </Pressable>
  );
}

export default function ColorPalette({
  colors = DEFAULT_COLORS,
  selectedColor,
  onSelectColor,
}: ColorPaletteProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {colors.map((color) => (
          <ColorCircle
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onPress={() => onSelectColor(color)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.sm + 4,
    paddingBottom: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  colorItem: {
    alignItems: 'center',
    width: 52,
  },
  colorCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    ...SHADOWS.small,
  },
  colorCircleSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  whiteInner: {
    position: 'absolute',
    top: 4,
    left: 4,
    right: 4,
    bottom: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorName: {
    fontSize: 9,
    fontWeight: '600',
    color: '#888',
    marginTop: 3,
    textAlign: 'center',
  },
});
