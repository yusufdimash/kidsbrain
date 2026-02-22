import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ---------- Zone types ----------

export interface Zone {
  id: string;
  label: string;
  style: {
    position: 'absolute';
    left: number;
    top: number;
    width: number;
    height: number;
    borderRadius?: number;
  };
}

export interface PictureTemplate {
  id: string;
  nameId: string;
  nameEn: string;
  emoji: string;
  canvasWidth: number;
  canvasHeight: number;
  zones: Zone[];
}

// ---------- Predefined pictures ----------

export const PICTURES: PictureTemplate[] = [
  {
    id: 'house',
    nameId: 'Rumah',
    nameEn: 'House',
    emoji: '🏠',
    canvasWidth: 260,
    canvasHeight: 260,
    zones: [
      // Roof (triangle approximated as wide top piece)
      {
        id: 'roof',
        label: 'Atap',
        style: { position: 'absolute', left: 10, top: 10, width: 240, height: 70, borderRadius: 8 },
      },
      // Wall left
      {
        id: 'wallLeft',
        label: 'Dinding',
        style: { position: 'absolute', left: 30, top: 80, width: 90, height: 120, borderRadius: 4 },
      },
      // Wall right
      {
        id: 'wallRight',
        label: 'Dinding',
        style: { position: 'absolute', left: 140, top: 80, width: 90, height: 120, borderRadius: 4 },
      },
      // Door
      {
        id: 'door',
        label: 'Pintu',
        style: { position: 'absolute', left: 100, top: 130, width: 60, height: 70, borderRadius: 6 },
      },
      // Window
      {
        id: 'window',
        label: 'Jendela',
        style: { position: 'absolute', left: 155, top: 95, width: 40, height: 40, borderRadius: 4 },
      },
      // Ground
      {
        id: 'ground',
        label: 'Tanah',
        style: { position: 'absolute', left: 0, top: 210, width: 260, height: 50, borderRadius: 8 },
      },
    ],
  },
  {
    id: 'flower',
    nameId: 'Bunga',
    nameEn: 'Flower',
    emoji: '🌻',
    canvasWidth: 260,
    canvasHeight: 280,
    zones: [
      // Center
      {
        id: 'center',
        label: 'Tengah',
        style: { position: 'absolute', left: 100, top: 50, width: 60, height: 60, borderRadius: 30 },
      },
      // Petal top
      {
        id: 'petalTop',
        label: 'Kelopak',
        style: { position: 'absolute', left: 105, top: 5, width: 50, height: 55, borderRadius: 25 },
      },
      // Petal right
      {
        id: 'petalRight',
        label: 'Kelopak',
        style: { position: 'absolute', left: 155, top: 50, width: 55, height: 50, borderRadius: 25 },
      },
      // Petal bottom
      {
        id: 'petalBottom',
        label: 'Kelopak',
        style: { position: 'absolute', left: 105, top: 100, width: 50, height: 55, borderRadius: 25 },
      },
      // Petal left
      {
        id: 'petalLeft',
        label: 'Kelopak',
        style: { position: 'absolute', left: 50, top: 50, width: 55, height: 50, borderRadius: 25 },
      },
      // Stem
      {
        id: 'stem',
        label: 'Batang',
        style: { position: 'absolute', left: 120, top: 155, width: 20, height: 125, borderRadius: 10 },
      },
    ],
  },
  {
    id: 'fish',
    nameId: 'Ikan',
    nameEn: 'Fish',
    emoji: '🐟',
    canvasWidth: 280,
    canvasHeight: 200,
    zones: [
      // Body
      {
        id: 'body',
        label: 'Badan',
        style: { position: 'absolute', left: 50, top: 40, width: 160, height: 100, borderRadius: 50 },
      },
      // Tail
      {
        id: 'tail',
        label: 'Ekor',
        style: { position: 'absolute', left: 10, top: 50, width: 60, height: 80, borderRadius: 8 },
      },
      // Top fin
      {
        id: 'finTop',
        label: 'Sirip',
        style: { position: 'absolute', left: 110, top: 10, width: 50, height: 40, borderRadius: 16 },
      },
      // Eye
      {
        id: 'eye',
        label: 'Mata',
        style: { position: 'absolute', left: 170, top: 65, width: 25, height: 25, borderRadius: 12 },
      },
      // Bottom stripe
      {
        id: 'stripe',
        label: 'Garis',
        style: { position: 'absolute', left: 80, top: 110, width: 100, height: 20, borderRadius: 10 },
      },
    ],
  },
  {
    id: 'tree',
    nameId: 'Pohon',
    nameEn: 'Tree',
    emoji: '🌳',
    canvasWidth: 240,
    canvasHeight: 300,
    zones: [
      // Crown top
      {
        id: 'crownTop',
        label: 'Daun',
        style: { position: 'absolute', left: 60, top: 10, width: 120, height: 80, borderRadius: 60 },
      },
      // Crown bottom
      {
        id: 'crownBottom',
        label: 'Daun',
        style: { position: 'absolute', left: 40, top: 70, width: 160, height: 90, borderRadius: 50 },
      },
      // Trunk
      {
        id: 'trunk',
        label: 'Batang',
        style: { position: 'absolute', left: 95, top: 150, width: 50, height: 110, borderRadius: 8 },
      },
      // Ground
      {
        id: 'ground',
        label: 'Tanah',
        style: { position: 'absolute', left: 20, top: 255, width: 200, height: 40, borderRadius: 20 },
      },
    ],
  },
];

// ---------- Component ----------

interface ColoringCanvasProps {
  zones: Zone[];
  canvasWidth: number;
  canvasHeight: number;
  selectedColor: string;
  onZoneFill: (zoneId: string) => void;
  filledZones: Record<string, string>;
}

export default function ColoringCanvas({
  zones,
  canvasWidth,
  canvasHeight,
  selectedColor,
  onZoneFill,
  filledZones,
}: ColoringCanvasProps) {
  return (
    <View style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]}>
      {zones.map((zone) => {
        const fillColor = filledZones[zone.id];
        return (
          <Pressable
            key={zone.id}
            style={[
              styles.zone,
              zone.style,
              fillColor
                ? { backgroundColor: fillColor, borderColor: fillColor }
                : undefined,
            ]}
            onPress={() => onZoneFill(zone.id)}
          >
            {fillColor ? (
              <Animated.View entering={FadeIn.duration(200)} style={styles.filledOverlay} />
            ) : (
              <Text style={styles.zoneLabel} numberOfLines={1}>
                {zone.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignSelf: 'center',
    position: 'relative',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  zone: {
    borderWidth: 2,
    borderColor: '#CCBBAA',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#AAA',
    textAlign: 'center',
  },
  filledOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
