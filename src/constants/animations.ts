import { WithSpringConfig, WithTimingConfig, Easing } from 'react-native-reanimated';

export const SPRING_BOUNCY: WithSpringConfig = {
  damping: 8,
  stiffness: 150,
  mass: 0.8,
};

export const SPRING_GENTLE: WithSpringConfig = {
  damping: 15,
  stiffness: 120,
  mass: 1,
};

export const SPRING_SNAPPY: WithSpringConfig = {
  damping: 12,
  stiffness: 300,
  mass: 0.6,
};

export const SPRING_PRESS: WithSpringConfig = {
  damping: 15,
  stiffness: 300,
};

export const TIMING_FAST: WithTimingConfig = {
  duration: 200,
  easing: Easing.out(Easing.ease),
};

export const TIMING_MEDIUM: WithTimingConfig = {
  duration: 400,
  easing: Easing.inOut(Easing.ease),
};

export const TIMING_SLOW: WithTimingConfig = {
  duration: 800,
  easing: Easing.inOut(Easing.ease),
};
