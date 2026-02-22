import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import type { Point } from '../../utils/pathUtils';

interface DemoAnimationProps {
  guidePoints: Point[];
  duration?: number; // ms, default 3000
  dotSize?: number;
  dotColor?: string;
  onComplete?: () => void;
  playing: boolean;
}

export default function DemoAnimation({
  guidePoints,
  duration = 3000,
  dotSize = 20,
  dotColor = '#FF6B6B',
  onComplete,
  playing,
}: DemoAnimationProps) {
  const progress = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (playing && guidePoints.length > 1) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      }, (finished) => {
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      });
    }
  }, [playing, guidePoints]);

  // We'll use a simpler approach: animate through the points with a timer
  useEffect(() => {
    if (!playing || guidePoints.length < 2) return;

    const interval = duration / guidePoints.length;
    let idx = 0;

    const timer = setInterval(() => {
      idx++;
      if (idx >= guidePoints.length) {
        clearInterval(timer);
        return;
      }
      setCurrentIndex(idx);
    }, interval);

    setCurrentIndex(0);
    return () => clearInterval(timer);
  }, [playing, guidePoints, duration]);

  if (!playing || guidePoints.length === 0) return null;

  const point = guidePoints[Math.min(currentIndex, guidePoints.length - 1)];

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: dotColor,
          left: point.x - dotSize / 2,
          top: point.y - dotSize / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
