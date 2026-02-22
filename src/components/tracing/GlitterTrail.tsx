import React, { useMemo } from 'react';
import { Canvas, Path as SkiaPath, Skia, LinearGradient, vec } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';
import type { Point } from '../../utils/pathUtils';

type BrushStyle = 'rainbow' | 'glitter' | 'fire' | 'water' | 'stars';

const BRUSH_COLORS: Record<BrushStyle, string[]> = {
  rainbow: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#A855F7', '#FF8FD8'],
  glitter: ['#FFD700', '#FFF8DC', '#FFD700', '#FFA500'],
  fire: ['#FF4500', '#FF6347', '#FFD700', '#FF8C00'],
  water: ['#00BFFF', '#87CEEB', '#4169E1', '#00CED1'],
  stars: ['#FFD700', '#FFF5B5', '#FFD700', '#FFFACD'],
};

interface GlitterTrailProps {
  points: Point[];
  width: number;
  height: number;
  brushStyle?: BrushStyle;
  strokeWidth?: number;
}

export default function GlitterTrail({
  points,
  width,
  height,
  brushStyle = 'rainbow',
  strokeWidth = 8,
}: GlitterTrailProps) {
  const path = useMemo(() => {
    const p = Skia.Path.Make();
    if (points.length < 2) return p;

    p.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      // Use quadratic bezier for smoother lines
      if (i < points.length - 1) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        p.quadTo(points[i].x, points[i].y, midX, midY);
      } else {
        p.lineTo(points[i].x, points[i].y);
      }
    }
    return p;
  }, [points]);

  const colors = BRUSH_COLORS[brushStyle];

  if (points.length < 2) return null;

  return (
    <Canvas style={[styles.canvas, { width, height }]}>
      <SkiaPath
        path={path}
        style="stroke"
        strokeWidth={strokeWidth}
        strokeCap="round"
        strokeJoin="round"
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={colors}
        />
      </SkiaPath>
      {/* Thinner glow layer */}
      <SkiaPath
        path={path}
        style="stroke"
        strokeWidth={strokeWidth + 6}
        strokeCap="round"
        strokeJoin="round"
        opacity={0.15}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, height)}
          colors={colors}
        />
      </SkiaPath>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
