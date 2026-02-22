import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

export type AnswerState = 'idle' | 'correct' | 'wrong';

interface AnswerOptionProps {
  emoji: string;
  onPress: () => void;
  state: AnswerState;
  disabled?: boolean;
}

export default function AnswerOption({
  emoji,
  onPress,
  state,
  disabled = false,
}: AnswerOptionProps) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const bgOpacity = useSharedValue(0);

  useEffect(() => {
    if (state === 'correct') {
      // Green highlight + bounce
      bgOpacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.15, { damping: 6, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
    } else if (state === 'wrong') {
      // Red flash + gentle shake
      bgOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 500 })
      );
      translateX.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(-3, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
    } else {
      // Reset to idle
      bgOpacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
      translateX.value = 0;
    }
  }, [state]);

  const handlePressIn = () => {
    if (state === 'idle' && !disabled) {
      scale.value = withSpring(0.9, { damping: 12, stiffness: 200 });
    }
  };

  const handlePressOut = () => {
    if (state === 'idle' && !disabled) {
      scale.value = withSpring(1, { damping: 8, stiffness: 180 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
    backgroundColor: state === 'correct' ? COLORS.success : COLORS.error,
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        {/* Colour overlay for correct / wrong feedback */}
        <Animated.View style={[styles.overlay, overlayStyle]} />

        <View style={styles.content}>
          <Text style={styles.emoji}>{emoji}</Text>
          {state === 'correct' && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.xl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 34,
  },
  checkmark: {
    position: 'absolute',
    bottom: -4,
    right: -14,
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textWhite,
  },
});
