export interface ShapeDef {
  id: string;
  name: string; // Indonesian
  nameEn: string;
  emoji: string;
  color: string;
  sides: number; // 0 for circle/oval
  funFact: { id: string; en: string };
}

export const SHAPES: ShapeDef[] = [
  {
    id: 'circle',
    name: 'Lingkaran',
    nameEn: 'Circle',
    emoji: '⭕',
    color: '#FF6B6B',
    sides: 0,
    funFact: {
      id: 'Roda sepeda berbentuk lingkaran!',
      en: 'Bicycle wheels are shaped like circles!',
    },
  },
  {
    id: 'square',
    name: 'Persegi',
    nameEn: 'Square',
    emoji: '🟧',
    color: '#4D96FF',
    sides: 4,
    funFact: {
      id: 'Jendela banyak yang berbentuk persegi!',
      en: 'Many windows are shaped like squares!',
    },
  },
  {
    id: 'triangle',
    name: 'Segitiga',
    nameEn: 'Triangle',
    emoji: '🔺',
    color: '#6BCB77',
    sides: 3,
    funFact: {
      id: 'Atap rumah sering berbentuk segitiga!',
      en: 'House roofs are often shaped like triangles!',
    },
  },
  {
    id: 'rectangle',
    name: 'Persegi Panjang',
    nameEn: 'Rectangle',
    emoji: '🟩',
    color: '#FF9F43',
    sides: 4,
    funFact: {
      id: 'Pintu berbentuk persegi panjang!',
      en: 'Doors are shaped like rectangles!',
    },
  },
  {
    id: 'star',
    name: 'Bintang',
    nameEn: 'Star',
    emoji: '⭐',
    color: '#FFD93D',
    sides: 5,
    funFact: {
      id: 'Bintang di langit bersinar terang!',
      en: 'Stars in the sky shine bright!',
    },
  },
  {
    id: 'heart',
    name: 'Hati',
    nameEn: 'Heart',
    emoji: '❤️',
    color: '#FF6B8A',
    sides: 0,
    funFact: {
      id: 'Bentuk hati artinya cinta!',
      en: 'Heart shape means love!',
    },
  },
  {
    id: 'diamond',
    name: 'Belah Ketupat',
    nameEn: 'Diamond',
    emoji: '🔷',
    color: '#A855F7',
    sides: 4,
    funFact: {
      id: 'Ketupat dimakan saat Lebaran!',
      en: 'Diamond shapes are on playing cards!',
    },
  },
  {
    id: 'oval',
    name: 'Oval',
    nameEn: 'Oval',
    emoji: '🥚',
    color: '#00D2D3',
    sides: 0,
    funFact: {
      id: 'Telur berbentuk oval!',
      en: 'Eggs are shaped like ovals!',
    },
  },
  {
    id: 'hexagon',
    name: 'Segi Enam',
    nameEn: 'Hexagon',
    emoji: '🔶',
    color: '#FF8FD8',
    sides: 6,
    funFact: {
      id: 'Sarang lebah berbentuk segi enam!',
      en: 'Honeycomb cells are hexagons!',
    },
  },
  {
    id: 'pentagon',
    name: 'Segi Lima',
    nameEn: 'Pentagon',
    emoji: '⬠',
    color: '#54A0FF',
    sides: 5,
    funFact: {
      id: 'Ada gedung terkenal bernama Pentagon!',
      en: 'There is a famous building called the Pentagon!',
    },
  },
];

/** Fisher-Yates shuffle (immutable). */
export function shuffleShapes<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
