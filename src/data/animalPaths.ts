import { Skia } from '@shopify/react-native-skia';
import type { Waypoint } from '../hooks/useTracingLogic';

export interface AnimalPathDef {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  tier: 1 | 2 | 3; // difficulty tier
  makePath: (size: number) => ReturnType<typeof Skia.Path.Make>;
  getWaypoints: (size: number) => Waypoint[];
}

function s(val: number, size: number): number {
  return (val / 200) * size;
}

export const ANIMAL_PATHS: AnimalPathDef[] = [
  {
    // Fish - simple oval with tail (Tier 1)
    id: 'fish',
    name: 'Ikan',
    nameEn: 'Fish',
    emoji: '🐟',
    tier: 1,
    makePath: (size) => {
      const p = Skia.Path.Make();
      // Body (oval)
      p.moveTo(s(50, size), s(100, size));
      p.cubicTo(
        s(50, size), s(60, size),
        s(120, size), s(60, size),
        s(130, size), s(100, size)
      );
      p.cubicTo(
        s(120, size), s(140, size),
        s(50, size), s(140, size),
        s(50, size), s(100, size)
      );
      // Tail
      p.moveTo(s(130, size), s(100, size));
      p.lineTo(s(170, size), s(70, size));
      p.lineTo(s(170, size), s(130, size));
      p.lineTo(s(130, size), s(100, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(50, size), y: s(100, size), order: 0 },
      { x: s(90, size), y: s(70, size), order: 1 },
      { x: s(130, size), y: s(100, size), order: 2 },
      { x: s(170, size), y: s(100, size), order: 3 },
    ],
  },
  {
    // Cat - simple cat face (Tier 1)
    id: 'cat',
    name: 'Kucing',
    nameEn: 'Cat',
    emoji: '🐱',
    tier: 1,
    makePath: (size) => {
      const p = Skia.Path.Make();
      // Head (circle)
      p.addCircle(s(100, size), s(110, size), s(55, size));
      // Left ear
      p.moveTo(s(55, size), s(70, size));
      p.lineTo(s(40, size), s(30, size));
      p.lineTo(s(80, size), s(55, size));
      // Right ear
      p.moveTo(s(145, size), s(70, size));
      p.lineTo(s(160, size), s(30, size));
      p.lineTo(s(120, size), s(55, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(55, size), order: 0 },
      { x: s(40, size), y: s(30, size), order: 1 },
      { x: s(160, size), y: s(30, size), order: 2 },
      { x: s(100, size), y: s(165, size), order: 3 },
    ],
  },
  {
    // Elephant - simplified body (Tier 2)
    id: 'elephant',
    name: 'Gajah',
    nameEn: 'Elephant',
    emoji: '🐘',
    tier: 2,
    makePath: (size) => {
      const p = Skia.Path.Make();
      // Body (large oval)
      p.moveTo(s(40, size), s(90, size));
      p.cubicTo(
        s(40, size), s(50, size),
        s(160, size), s(50, size),
        s(160, size), s(90, size)
      );
      p.cubicTo(
        s(160, size), s(130, size),
        s(40, size), s(130, size),
        s(40, size), s(90, size)
      );
      // Trunk
      p.moveTo(s(40, size), s(80, size));
      p.cubicTo(
        s(20, size), s(80, size),
        s(15, size), s(120, size),
        s(30, size), s(150, size)
      );
      // Legs
      p.moveTo(s(70, size), s(130, size));
      p.lineTo(s(70, size), s(170, size));
      p.moveTo(s(130, size), s(130, size));
      p.lineTo(s(130, size), s(170, size));
      return p;
    },
    getWaypoints: (size) => [
      { x: s(100, size), y: s(55, size), order: 0 },
      { x: s(160, size), y: s(90, size), order: 1 },
      { x: s(40, size), y: s(80, size), order: 2 },
      { x: s(30, size), y: s(150, size), order: 3 },
      { x: s(100, size), y: s(170, size), order: 4 },
    ],
  },
];

export function getAnimalPath(id: string): AnimalPathDef | undefined {
  return ANIMAL_PATHS.find((ap) => ap.id === id);
}

export function getAnimalsByTier(tier: 1 | 2 | 3): AnimalPathDef[] {
  return ANIMAL_PATHS.filter((ap) => ap.tier === tier);
}
