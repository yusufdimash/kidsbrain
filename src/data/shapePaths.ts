import { Skia } from '@shopify/react-native-skia';
import type { Waypoint } from '../hooks/useTracingLogic';

export interface ShapePathDef {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  makePath: (size: number) => ReturnType<typeof Skia.Path.Make>;
  getWaypoints: (size: number) => Waypoint[];
}

function s(val: number, size: number): number {
  return (val / 200) * size;
}

export const SHAPE_PATHS: ShapePathDef[] = [
  {
    id: 'circle',
    name: 'Lingkaran',
    nameEn: 'Circle',
    emoji: '⭕',
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.addCircle(s(100, size), s(100, size), s(60, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(40, size), order: 0 },
      { x: s(160, size), y: s(100, size), order: 1 },
      { x: s(100, size), y: s(160, size), order: 2 },
      { x: s(40, size), y: s(100, size), order: 3 },
    ],
  },
  {
    id: 'square',
    name: 'Persegi',
    nameEn: 'Square',
    emoji: '🟦',
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(45, size), s(45, size));
      p.lineTo(s(155, size), s(45, size));
      p.lineTo(s(155, size), s(155, size));
      p.lineTo(s(45, size), s(155, size));
      p.close();
      return p;
    },
    getWaypoints: (size) => [
      { x: s(45, size), y: s(45, size), order: 0 },
      { x: s(155, size), y: s(45, size), order: 1 },
      { x: s(155, size), y: s(155, size), order: 2 },
      { x: s(45, size), y: s(155, size), order: 3 },
    ],
  },
  {
    id: 'triangle',
    name: 'Segitiga',
    nameEn: 'Triangle',
    emoji: '🔺',
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(100, size), s(35, size));
      p.lineTo(s(165, size), s(160, size));
      p.lineTo(s(35, size), s(160, size));
      p.close();
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(35, size), order: 0 },
      { x: s(165, size), y: s(160, size), order: 1 },
      { x: s(35, size), y: s(160, size), order: 2 },
    ],
  },
];

export function getShapePath(id: string): ShapePathDef | undefined {
  return SHAPE_PATHS.find((sp) => sp.id === id);
}
