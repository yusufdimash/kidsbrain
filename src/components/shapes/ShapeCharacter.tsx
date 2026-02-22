import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';
import type { ShapeDef } from '../../data/shapeData';

interface ShapeCharacterProps {
  shape: ShapeDef;
  size?: number;
  onPress?: () => void;
  showFace?: boolean;
}

function ShapeBody({
  shapeId,
  color,
  size,
}: {
  shapeId: string;
  color: string;
  size: number;
}) {
  switch (shapeId) {
    case 'circle':
      return (
        <View
          style={[
            shapeStyles.circle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        />
      );

    case 'square':
      return (
        <View
          style={[
            shapeStyles.square,
            {
              width: size,
              height: size,
              borderRadius: size * 0.08,
              backgroundColor: color,
            },
          ]}
        />
      );

    case 'triangle':
      return (
        <View style={[shapeStyles.triangleContainer, { width: size, height: size }]}>
          <View
            style={[
              shapeStyles.triangle,
              {
                borderLeftWidth: size / 2,
                borderRightWidth: size / 2,
                borderBottomWidth: size * 0.85,
                borderBottomColor: color,
              },
            ]}
          />
        </View>
      );

    case 'rectangle':
      return (
        <View
          style={[
            shapeStyles.rectangle,
            {
              width: size,
              height: size * 0.65,
              borderRadius: size * 0.06,
              backgroundColor: color,
            },
          ]}
        />
      );

    case 'star': {
      // 5-pointed star: alternate between outer radius (tips) and inner radius (valleys)
      const cx = size / 2;
      const cy = size / 2;
      const outerR = size * 0.45;
      const innerR = outerR * 0.38;
      const points = Array.from({ length: 10 }, (_, i) => {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = ((i * 36 - 90) * Math.PI) / 180;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      }).join(' ');

      return (
        <View style={[shapeStyles.starContainer, { width: size, height: size }]}>
          <Svg width={size} height={size}>
            <Polygon points={points} fill={color} />
          </Svg>
        </View>
      );
    }

    case 'heart':
      return (
        <View style={[shapeStyles.heartContainer, { width: size, height: size }]}>
          <View
            style={[
              shapeStyles.heartLeft,
              {
                width: size * 0.52,
                height: size * 0.52,
                borderRadius: size * 0.26,
                backgroundColor: color,
                left: size * 0.06,
                top: size * 0.15,
              },
            ]}
          />
          <View
            style={[
              shapeStyles.heartRight,
              {
                width: size * 0.52,
                height: size * 0.52,
                borderRadius: size * 0.26,
                backgroundColor: color,
                right: size * 0.06,
                top: size * 0.15,
              },
            ]}
          />
          <View
            style={[
              shapeStyles.heartBottom,
              {
                borderLeftWidth: size * 0.42,
                borderRightWidth: size * 0.42,
                borderTopWidth: size * 0.48,
                borderTopColor: color,
                left: size * 0.08,
                bottom: size * 0.05,
              },
            ]}
          />
        </View>
      );

    case 'diamond':
      return (
        <View style={[shapeStyles.diamondOuter, { width: size, height: size }]}>
          <View
            style={[
              shapeStyles.diamond,
              {
                width: size * 0.6,
                height: size * 0.6,
                backgroundColor: color,
                borderRadius: size * 0.06,
                transform: [{ rotate: '45deg' }],
              },
            ]}
          />
        </View>
      );

    case 'oval':
      return (
        <View
          style={[
            shapeStyles.oval,
            {
              width: size,
              height: size * 0.65,
              borderRadius: size / 2,
              backgroundColor: color,
            },
          ]}
        />
      );

    case 'hexagon':
      return (
        <View style={[shapeStyles.hexContainer, { width: size, height: size }]}>
          <View
            style={[
              shapeStyles.hexRect,
              {
                width: size * 0.58,
                height: size * 0.85,
                backgroundColor: color,
                borderRadius: size * 0.04,
              },
            ]}
          />
          <View
            style={[
              shapeStyles.hexRect,
              {
                width: size * 0.58,
                height: size * 0.85,
                backgroundColor: color,
                borderRadius: size * 0.04,
                transform: [{ rotate: '60deg' }],
                position: 'absolute',
              },
            ]}
          />
          <View
            style={[
              shapeStyles.hexRect,
              {
                width: size * 0.58,
                height: size * 0.85,
                backgroundColor: color,
                borderRadius: size * 0.04,
                transform: [{ rotate: '120deg' }],
                position: 'absolute',
              },
            ]}
          />
        </View>
      );

    case 'pentagon': {
      // Regular pentagon via SVG — 5 vertices at 72° intervals, starting at top (-90°)
      const cx = size / 2;
      const cy = size / 2;
      const r = size * 0.45;
      const points = Array.from({ length: 5 }, (_, i) => {
        const angle = ((i * 72 - 90) * Math.PI) / 180;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      }).join(' ');

      return (
        <View style={[shapeStyles.pentContainer, { width: size, height: size }]}>
          <Svg width={size} height={size}>
            <Polygon points={points} fill={color} />
          </Svg>
        </View>
      );
    }

    default:
      return (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size * 0.15,
            backgroundColor: color,
          }}
        />
      );
  }
}

export default function ShapeCharacter({
  shape,
  size = 80,
  onPress,
  showFace = true,
}: ShapeCharacterProps) {
  const scale = useSharedValue(0);
  const bounceScale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 120 });
  }, []);

  const handlePress = () => {
    bounceScale.value = withSequence(
      withSpring(1.2, { damping: 6, stiffness: 300 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * bounceScale.value }],
  }));

  const eyeSize = Math.max(size * 0.08, 4);
  const eyeSpacing = size * 0.15;
  const isTriangle = shape.id === 'triangle';

  const content = (
    <Animated.View style={[styles.wrapper, { width: size, height: size }, animatedStyle]}>
      <ShapeBody shapeId={shape.id} color={shape.color} size={size} />
      {showFace && (
        <View
          style={[
            styles.face,
            isTriangle ? { top: size * 0.4 } : undefined,
          ]}
        >
          {/* Left eye */}
          <View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize,
                borderRadius: eyeSize / 2,
                marginRight: eyeSpacing,
              },
            ]}
          />
          {/* Right eye */}
          <View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize,
                borderRadius: eyeSize / 2,
              },
            ]}
          />
          {/* Smile */}
          <View
            style={[
              styles.smile,
              {
                width: eyeSpacing * 1.4,
                height: eyeSpacing * 0.7,
                borderBottomLeftRadius: eyeSpacing,
                borderBottomRightRadius: eyeSpacing,
                borderWidth: Math.max(eyeSize * 0.4, 1.5),
                borderTopWidth: 0,
                top: eyeSize + 2,
              },
            ]}
          />
        </View>
      )}
    </Animated.View>
  );

  if (onPress) {
    return <Pressable onPress={handlePress}>{content}</Pressable>;
  }
  return content;
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  face: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    backgroundColor: '#2D3436',
  },
  smile: {
    position: 'absolute',
    borderColor: '#2D3436',
    backgroundColor: 'transparent',
  },
});

const shapeStyles = StyleSheet.create({
  circle: {},
  square: {},
  triangleContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderStyle: 'solid',
  },
  rectangle: {
    alignSelf: 'center',
  },
  starContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartContainer: {
    position: 'relative',
  },
  heartLeft: {
    position: 'absolute',
  },
  heartRight: {
    position: 'absolute',
  },
  heartBottom: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderStyle: 'solid',
  },
  diamondOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamond: {},
  oval: {
    alignSelf: 'center',
  },
  hexContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexRect: {},
  pentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
