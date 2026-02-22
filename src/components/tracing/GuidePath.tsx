import React from 'react';
import { Canvas, Path, DashPathEffect, SkPath } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';

interface GuidePathProps {
  path: SkPath;
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  visible?: boolean;
}

export default function GuidePath({
  path,
  width,
  height,
  color = '#D0D0D0',
  strokeWidth = 4,
  visible = true,
}: GuidePathProps) {
  if (!visible) return null;

  return (
    <Canvas style={[styles.canvas, { width, height }]}>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={strokeWidth}
        strokeCap="round"
        strokeJoin="round"
      >
        <DashPathEffect intervals={[10, 8]} />
      </Path>
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
