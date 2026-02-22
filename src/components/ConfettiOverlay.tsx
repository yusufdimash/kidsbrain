import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const PARTICLE_COUNT = 30;
const CONFETTI_COLORS = [
  '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF',
  '#FF8FD8', '#A855F7', '#FF9F43', '#00D2D3',
];

interface Particle {
  x: number;
  delay: number;
  color: string;
  size: number;
}

interface ConfettiOverlayProps {
  visible: boolean;
  onComplete?: () => void;
}

function ConfettiParticle({
  particle,
  screenHeight,
}: {
  particle: Particle;
  screenHeight: number;
}) {
  const translateY = useSharedValue(-50);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      particle.delay,
      withTiming(screenHeight + 50, {
        duration: 2000 + Math.random() * 1000,
        easing: Easing.out(Easing.quad),
      })
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1), {
        duration: 2500,
      })
    );
    opacity.value = withDelay(
      particle.delay + 1500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          borderRadius: particle.size / 2,
        },
        style,
      ]}
    />
  );
}

export default function ConfettiOverlay({
  visible,
  onComplete,
}: ConfettiOverlayProps) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (visible && onComplete) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    delay: Math.random() * 500,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: 8 + Math.random() * 12,
  }));

  return (
    <>
      {particles.map((p, i) => (
        <ConfettiParticle key={i} particle={p} screenHeight={height} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
});
