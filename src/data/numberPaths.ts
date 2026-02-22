import { Skia } from '@shopify/react-native-skia';
import type { Waypoint } from '../hooks/useTracingLogic';

export interface NumberPathDef {
  digit: number;
  makePath: (size: number) => ReturnType<typeof Skia.Path.Make>;
  getWaypoints: (size: number) => Waypoint[];
}

function s(val: number, size: number): number {
  return (val / 200) * size;
}

export const NUMBER_PATHS: NumberPathDef[] = [
  {
    digit: 0,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.addOval({
        x: s(55, size),
        y: s(40, size),
        width: s(90, size),
        height: s(120, size),
      });
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(40, size), order: 0 },
      { x: s(145, size), y: s(100, size), order: 1 },
      { x: s(100, size), y: s(160, size), order: 2 },
      { x: s(55, size), y: s(100, size), order: 3 },
    ],
  },
  {
    digit: 1,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(80, size), s(60, size));
      p.lineTo(s(100, size), s(40, size));
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
    digit: 2,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(55, size), s(70, size));
      p.cubicTo(
        s(55, size), s(30, size),
        s(145, size), s(30, size),
        s(145, size), s(70, size)
      );
      p.cubicTo(
        s(145, size), s(100, size),
        s(55, size), s(130, size),
        s(55, size), s(160, size)
      );
      p.lineTo(s(145, size), s(160, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(55, size), y: s(70, size), order: 0 },
      { x: s(145, size), y: s(70, size), order: 1 },
      { x: s(55, size), y: s(160, size), order: 2 },
      { x: s(145, size), y: s(160, size), order: 3 },
    ],
  },
  {
    digit: 3,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(55, size), s(50, size));
      p.cubicTo(
        s(55, size), s(30, size),
        s(145, size), s(30, size),
        s(145, size), s(65, size)
      );
      p.cubicTo(
        s(145, size), s(90, size),
        s(100, size), s(95, size),
        s(100, size), s(100, size)
      );
      p.cubicTo(
        s(100, size), s(105, size),
        s(145, size), s(110, size),
        s(145, size), s(135, size)
      );
      p.cubicTo(
        s(145, size), s(170, size),
        s(55, size), s(170, size),
        s(55, size), s(150, size)
      );
      return p;
    },
    getWaypoints: (size) => [
      { x: s(55, size), y: s(50, size), order: 0 },
      { x: s(145, size), y: s(65, size), order: 1 },
      { x: s(100, size), y: s(100, size), order: 2 },
      { x: s(145, size), y: s(135, size), order: 3 },
      { x: s(55, size), y: s(150, size), order: 4 },
    ],
  },
  {
    digit: 4,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(120, size), s(160, size));
      p.lineTo(s(120, size), s(40, size));
      p.lineTo(s(50, size), s(120, size));
      p.lineTo(s(155, size), s(120, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(120, size), y: s(40, size), order: 0 },
      { x: s(50, size), y: s(120, size), order: 1 },
      { x: s(155, size), y: s(120, size), order: 2 },
    ],
  },
  {
    digit: 5,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(140, size), s(40, size));
      p.lineTo(s(60, size), s(40, size));
      p.lineTo(s(55, size), s(95, size));
      p.cubicTo(
        s(80, size), s(80, size),
        s(150, size), s(80, size),
        s(150, size), s(120, size)
      );
      p.cubicTo(
        s(150, size), s(170, size),
        s(55, size), s(170, size),
        s(55, size), s(145, size)
      );
      return p;
    },
    getWaypoints: (size) => [
      { x: s(140, size), y: s(40, size), order: 0 },
      { x: s(60, size), y: s(40, size), order: 1 },
      { x: s(55, size), y: s(95, size), order: 2 },
      { x: s(150, size), y: s(120, size), order: 3 },
      { x: s(55, size), y: s(145, size), order: 4 },
    ],
  },
  {
    digit: 6,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(130, size), s(50, size));
      p.cubicTo(
        s(80, size), s(30, size),
        s(50, size), s(60, size),
        s(50, size), s(120, size)
      );
      p.addCircle(s(95, size), s(125, size), s(40, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(130, size), y: s(50, size), order: 0 },
      { x: s(50, size), y: s(90, size), order: 1 },
      { x: s(95, size), y: s(165, size), order: 2 },
      { x: s(135, size), y: s(125, size), order: 3 },
    ],
  },
  {
    digit: 7,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.moveTo(s(50, size), s(40, size));
      p.lineTo(s(150, size), s(40, size));
      p.lineTo(s(80, size), s(160, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(50, size), y: s(40, size), order: 0 },
      { x: s(150, size), y: s(40, size), order: 1 },
      { x: s(80, size), y: s(160, size), order: 2 },
    ],
  },
  {
    digit: 8,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.addCircle(s(100, size), s(70, size), s(30, size));
      p.addCircle(s(100, size), s(130, size), s(35, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(40, size), order: 0 },
      { x: s(130, size), y: s(70, size), order: 1 },
      { x: s(100, size), y: s(100, size), order: 2 },
      { x: s(135, size), y: s(130, size), order: 3 },
      { x: s(100, size), y: s(165, size), order: 4 },
    ],
  },
  {
    digit: 9,
    makePath: (size) => {
      const p = Skia.Path.Make();
      p.addCircle(s(100, size), s(75, size), s(35, size));
      p.moveTo(s(135, size), s(90, size));
      p.cubicTo(
        s(140, size), s(130, size),
        s(110, size), s(170, size),
        s(70, size), s(160, size)
      );
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(40, size), order: 0 },
      { x: s(65, size), y: s(75, size), order: 1 },
      { x: s(135, size), y: s(90, size), order: 2 },
      { x: s(70, size), y: s(160, size), order: 3 },
    ],
  },
];

export function getNumberPath(digit: number): NumberPathDef | undefined {
  return NUMBER_PATHS.find((np) => np.digit === digit);
}
