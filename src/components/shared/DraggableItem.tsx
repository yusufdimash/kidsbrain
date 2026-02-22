import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

export interface DraggableItemProps {
  children: React.ReactNode;
  onDragEnd: (position: { x: number; y: number }) => void;
  snapBack?: boolean;
  disabled?: boolean;
}

export default function DraggableItem({
  children,
  onDragEnd,
  snapBack = true,
  disabled = false,
}: DraggableItemProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);
  const zIndex = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      'worklet';
      contextX.value = translateX.value;
      contextY.value = translateY.value;
      scale.value = withSpring(1.1, { damping: 15, stiffness: 200 });
      zIndex.value = 100;
    })
    .onUpdate((event) => {
      'worklet';
      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;
    })
    .onEnd((event) => {
      'worklet';
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });

      const absoluteX = event.absoluteX;
      const absoluteY = event.absoluteY;

      runOnJS(onDragEnd)({ x: absoluteX, y: absoluteY });

      if (snapBack) {
        translateX.value = withSpring(0, { damping: 12, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 12, stiffness: 150 });
      }

      zIndex.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
