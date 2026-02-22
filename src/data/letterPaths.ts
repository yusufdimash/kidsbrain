import { Skia } from '@shopify/react-native-skia';
import type { Waypoint } from '../hooks/useTracingLogic';

export interface LetterPathDef {
  letter: string;
  makePath: (size: number) => ReturnType<typeof Skia.Path.Make>;
  getWaypoints: (size: number) => Waypoint[];
}

// Helper: scale coordinates to canvas size (paths designed on 200x200 grid)
function s(val: number, size: number): number {
  return (val / 200) * size;
}

export const LETTER_PATHS: LetterPathDef[] = [
  {
    // I - simple vertical stroke
    letter: 'I',
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(100, size), s(40, size));
      p.lineTo(s(100, size), s(160, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(40, size), order: 0 },
      { x: s(100, size), y: s(100, size), order: 1 },
      { x: s(100, size), y: s(160, size), order: 2 },
    ],
  },
  {
    // L - vertical then horizontal
    letter: 'L',
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(60, size), s(40, size));
      p.lineTo(s(60, size), s(160, size));
      p.lineTo(s(150, size), s(160, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(60, size), y: s(40, size), order: 0 },
      { x: s(60, size), y: s(160, size), order: 1 },
      { x: s(150, size), y: s(160, size), order: 2 },
    ],
  },
  {
    // O - circle
    letter: 'O',
    makePath: (size) => {
      const p = Skia.Path.Make();
      const cx = s(100, size);
      const cy = s(100, size);
      const r = s(55, size);
      p.addCircle(cx, cy, r);
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(45, size), order: 0 },
      { x: s(155, size), y: s(100, size), order: 1 },
      { x: s(100, size), y: s(155, size), order: 2 },
      { x: s(45, size), y: s(100, size), order: 3 },
    ],
  },
  {
    // C - arc (open circle)
    letter: 'C',
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(150, size), s(60, size));
      p.cubicTo(
        s(80, size), s(20, size),
        s(30, size), s(70, size),
        s(40, size), s(100, size)
      );
      p.cubicTo(
        s(30, size), s(130, size),
        s(80, size), s(180, size),
        s(150, size), s(140, size)
      );
      return p;
    },
    getWaypoints: (size) => [
      { x: s(150, size), y: s(60, size), order: 0 },
      { x: s(40, size), y: s(100, size), order: 1 },
      { x: s(150, size), y: s(140, size), order: 2 },
    ],
  },
  {
    // A - two diagonal strokes + horizontal bar
    letter: 'A',
    makePath: (size) => {
      const p = Skia.Path.Make();
      // Left stroke
      p.moveTo(s(100, size), s(40, size));
      p.lineTo(s(45, size), s(160, size));
      // Right stroke
      p.moveTo(s(100, size), s(40, size));
      p.lineTo(s(155, size), s(160, size));
      // Cross bar
      p.moveTo(s(65, size), s(115, size));
      p.lineTo(s(135, size), s(115, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(40, size), order: 0 },
      { x: s(45, size), y: s(160, size), order: 1 },
      { x: s(155, size), y: s(160, size), order: 2 },
      { x: s(100, size), y: s(115, size), order: 3 },
    ],
  },
  {
    // S - S-curve
    letter: 'S',
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(140, size), s(55, size));
      p.cubicTo(
        s(140, size), s(25, size),
        s(50, size), s(25, size),
        s(55, size), s(65, size)
      );
      p.cubicTo(
        s(55, size), s(95, size),
        s(150, size), s(95, size),
        s(150, size), s(130, size)
      );
      p.cubicTo(
        s(150, size), s(170, size),
        s(55, size), s(170, size),
        s(60, size), s(145, size)
      );
      return p;
    },
    getWaypoints: (size) => [
      { x: s(140, size), y: s(55, size), order: 0 },
      { x: s(55, size), y: s(65, size), order: 1 },
      { x: s(150, size), y: s(130, size), order: 2 },
      { x: s(60, size), y: s(145, size), order: 3 },
    ],
  },
];

export function getLetterPath(letter: string): LetterPathDef | undefined {
  return LETTER_PATHS.find((lp) => lp.letter === letter);
}
