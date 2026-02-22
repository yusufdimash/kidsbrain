import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path, Text as SvgText, G } from 'react-native-svg';
import { COLORS, RADIUS } from '../../constants/theme';

// ---------- Zone types ----------

export interface Zone {
  id: string;
  label: string;
  path: string;
  labelCenter: { x: number; y: number };
  decorLines?: string[];
}

export interface PictureTemplate {
  id: string;
  nameId: string;
  nameEn: string;
  emoji: string;
  viewBox: { width: number; height: number };
  zones: Zone[];
}

// ---------- Predefined pictures ----------

export const PICTURES: PictureTemplate[] = [
  // ===== HOUSE =====
  {
    id: 'house',
    nameId: 'Rumah',
    nameEn: 'House',
    emoji: '\u{1F3E0}',
    viewBox: { width: 260, height: 260 },
    zones: [
      {
        id: 'roof',
        label: 'Atap',
        path: 'M 130 10 L 245 95 L 15 95 Z',
        labelCenter: { x: 130, y: 65 },
      },
      {
        id: 'wallLeft',
        label: 'Dinding',
        path: 'M 30 95 L 125 95 L 125 210 L 30 210 Z',
        labelCenter: { x: 77, y: 152 },
      },
      {
        id: 'wallRight',
        label: 'Dinding',
        path: 'M 135 95 L 230 95 L 230 210 L 135 210 Z',
        labelCenter: { x: 182, y: 152 },
      },
      {
        id: 'door',
        label: 'Pintu',
        path: 'M 105 210 L 105 145 A 25 25 0 0 1 155 145 L 155 210 Z',
        labelCenter: { x: 130, y: 180 },
      },
      {
        id: 'window',
        label: 'Jendela',
        path: 'M 160 110 L 210 110 L 210 160 L 160 160 Z',
        labelCenter: { x: 185, y: 138 },
        decorLines: [
          'M 185 110 L 185 160',
          'M 160 135 L 210 135',
        ],
      },
      {
        id: 'ground',
        label: 'Tanah',
        path: 'M 0 210 Q 65 200 130 210 Q 195 220 260 210 L 260 260 L 0 260 Z',
        labelCenter: { x: 130, y: 240 },
      },
    ],
  },

  // ===== FLOWER =====
  {
    id: 'flower',
    nameId: 'Bunga',
    nameEn: 'Flower',
    emoji: '\u{1F33B}',
    viewBox: { width: 260, height: 280 },
    zones: [
      {
        id: 'petalTop',
        label: 'Kelopak',
        path: 'M 130 20 C 150 20 160 40 160 55 C 160 70 150 80 130 80 C 110 80 100 70 100 55 C 100 40 110 20 130 20 Z',
        labelCenter: { x: 130, y: 50 },
      },
      {
        id: 'petalRight',
        label: 'Kelopak',
        path: 'M 175 60 C 185 45 205 45 215 60 C 225 75 220 95 205 100 C 190 105 170 100 160 85 C 155 75 165 55 175 60 Z',
        labelCenter: { x: 190, y: 75 },
      },
      {
        id: 'petalBottomRight',
        label: 'Kelopak',
        path: 'M 160 115 C 175 110 190 120 195 135 C 200 150 190 170 175 170 C 160 170 145 155 145 140 C 145 125 150 115 160 115 Z',
        labelCenter: { x: 170, y: 143 },
      },
      {
        id: 'petalBottomLeft',
        label: 'Kelopak',
        path: 'M 100 115 C 85 110 70 120 65 135 C 60 150 70 170 85 170 C 100 170 115 155 115 140 C 115 125 110 115 100 115 Z',
        labelCenter: { x: 90, y: 143 },
      },
      {
        id: 'petalLeft',
        label: 'Kelopak',
        path: 'M 85 60 C 75 45 55 45 45 60 C 35 75 40 95 55 100 C 70 105 90 100 100 85 C 105 75 95 55 85 60 Z',
        labelCenter: { x: 70, y: 75 },
      },
      {
        id: 'center',
        label: 'Tengah',
        path: 'M 155 95 A 25 25 0 1 1 105 95 A 25 25 0 1 1 155 95 Z',
        labelCenter: { x: 130, y: 98 },
      },
      {
        id: 'stem',
        label: 'Batang',
        path: 'M 125 120 C 125 160 120 200 118 240 L 118 270 L 142 270 L 142 240 C 140 200 135 160 135 120 Z',
        labelCenter: { x: 130, y: 200 },
        decorLines: [
          'M 135 180 C 155 170 170 175 175 185',
          'M 125 210 C 105 200 90 205 85 215',
        ],
      },
    ],
  },

  // ===== FISH =====
  {
    id: 'fish',
    nameId: 'Ikan',
    nameEn: 'Fish',
    emoji: '\u{1F41F}',
    viewBox: { width: 280, height: 200 },
    zones: [
      {
        id: 'body',
        label: 'Badan',
        path: 'M 80 100 C 80 55 120 30 170 30 C 220 30 245 60 245 100 C 245 140 220 170 170 170 C 120 170 80 145 80 100 Z',
        labelCenter: { x: 170, y: 100 },
      },
      {
        id: 'tail',
        label: 'Ekor',
        path: 'M 80 100 L 25 45 C 40 70 45 85 45 100 C 45 115 40 130 25 155 Z',
        labelCenter: { x: 52, y: 100 },
      },
      {
        id: 'finTop',
        label: 'Sirip',
        path: 'M 150 35 L 170 5 L 195 10 L 185 35 Z',
        labelCenter: { x: 175, y: 22 },
      },
      {
        id: 'eye',
        label: 'Mata',
        path: 'M 222 85 A 12 12 0 1 1 198 85 A 12 12 0 1 1 222 85 Z',
        labelCenter: { x: 210, y: 88 },
      },
      {
        id: 'stripe',
        label: 'Garis',
        path: 'M 120 130 C 140 140 170 145 200 135 L 200 150 C 170 162 140 158 120 148 Z',
        labelCenter: { x: 160, y: 142 },
      },
    ],
  },

  // ===== TREE =====
  {
    id: 'tree',
    nameId: 'Pohon',
    nameEn: 'Tree',
    emoji: '\u{1F333}',
    viewBox: { width: 240, height: 300 },
    zones: [
      {
        id: 'crownTop',
        label: 'Daun',
        path: 'M 120 15 C 145 10 170 20 180 40 C 190 30 210 40 205 60 C 220 65 220 90 200 95 C 195 105 175 110 160 105 C 145 115 120 115 105 105 C 85 110 65 105 55 95 C 35 90 30 70 45 60 C 35 40 55 30 70 40 C 80 20 100 10 120 15 Z',
        labelCenter: { x: 120, y: 65 },
      },
      {
        id: 'crownBottom',
        label: 'Daun',
        path: 'M 55 95 C 35 100 15 115 20 135 C 10 145 15 165 35 170 C 40 180 60 185 80 180 C 95 190 120 192 140 185 C 160 190 180 185 195 175 C 210 180 225 170 225 155 C 235 145 230 125 215 120 C 220 105 205 95 190 98 C 180 90 160 90 150 95 L 105 95 C 90 88 70 88 55 95 Z',
        labelCenter: { x: 120, y: 140 },
      },
      {
        id: 'trunk',
        label: 'Batang',
        path: 'M 100 175 L 105 255 L 135 255 L 140 175 Z',
        labelCenter: { x: 120, y: 218 },
        decorLines: [
          'M 112 190 L 110 240',
          'M 128 195 L 130 245',
        ],
      },
      {
        id: 'ground',
        label: 'Tanah',
        path: 'M 10 255 Q 60 248 120 255 Q 180 262 230 255 L 230 290 L 10 290 Z',
        labelCenter: { x: 120, y: 275 },
        decorLines: [
          'M 40 260 L 38 250',
          'M 45 260 L 47 248',
          'M 80 258 L 78 247',
          'M 85 258 L 87 246',
          'M 155 260 L 153 249',
          'M 160 260 L 162 247',
          'M 200 258 L 198 248',
          'M 205 258 L 207 246',
        ],
      },
    ],
  },
];

// ---------- Component ----------

interface ColoringCanvasProps {
  picture: PictureTemplate;
  selectedColor: string;
  onZoneFill: (zoneId: string) => void;
  filledZones: Record<string, string>;
}

const MAX_CANVAS_WIDTH = 400;

export default function ColoringCanvas({
  picture,
  selectedColor,
  onZoneFill,
  filledZones,
}: ColoringCanvasProps) {
  const { width: screenWidth } = useWindowDimensions();
  const { viewBox, zones } = picture;

  const canvasWidth = Math.min(screenWidth - 32, MAX_CANVAS_WIDTH);
  const scale = canvasWidth / viewBox.width;
  const canvasHeight = viewBox.height * scale;

  return (
    <View style={[styles.canvas, { width: canvasWidth, height: canvasHeight }]}>
      <Svg
        width={canvasWidth}
        height={canvasHeight}
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      >
        {zones.map((zone) => {
          const filled = !!filledZones[zone.id];
          const fillColor = filledZones[zone.id];
          const lc = zone.labelCenter;

          return (
            <G key={zone.id}>
              <Path
                d={zone.path}
                fill={filled ? fillColor : 'rgba(255,255,255,0.6)'}
                stroke={filled ? fillColor : '#CCBBAA'}
                strokeWidth={2}
                strokeDasharray={filled ? undefined : '8 5'}
                onPressIn={() => onZoneFill(zone.id)}
              />
              {zone.decorLines?.map((d, i) => (
                <Path
                  key={`${zone.id}-decor-${i}`}
                  d={d}
                  fill="none"
                  stroke={filled ? 'rgba(0,0,0,0.15)' : '#CCBBAA'}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  pointerEvents="none"
                />
              ))}
              {!filled && (
                <SvgText
                  x={lc.x}
                  y={lc.y}
                  textAnchor="middle"
                  alignmentBaseline="central"
                  fontSize={11}
                  fontWeight="600"
                  fill="#AAA"
                  pointerEvents="none"
                >
                  {zone.label}
                </SvgText>
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignSelf: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
});
