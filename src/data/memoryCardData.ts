export interface MemoryCard {
  id: string;
  emoji: string;
  color: string;
  category: 'animal' | 'fruit' | 'vehicle' | 'nature';
}

/** Unique card definitions (one per pair). At runtime each card is duplicated to form a pair. */
const ALL_CARDS: MemoryCard[] = [
  // --- Animals (6) ---
  { id: 'animal_dog', emoji: '🐶', color: '#FFD8B5', category: 'animal' },
  { id: 'animal_cat', emoji: '🐱', color: '#FFB5C2', category: 'animal' },
  { id: 'animal_rabbit', emoji: '🐰', color: '#FFE0EC', category: 'animal' },
  { id: 'animal_bear', emoji: '🐻', color: '#D2B48C', category: 'animal' },
  { id: 'animal_monkey', emoji: '🐵', color: '#FFDAB9', category: 'animal' },
  { id: 'animal_lion', emoji: '🦁', color: '#FFE4B5', category: 'animal' },

  // --- Fruits (6) ---
  { id: 'fruit_apple', emoji: '🍎', color: '#FFB5B5', category: 'fruit' },
  { id: 'fruit_banana', emoji: '🍌', color: '#FFF5B5', category: 'fruit' },
  { id: 'fruit_grape', emoji: '🍇', color: '#D8B5FF', category: 'fruit' },
  { id: 'fruit_watermelon', emoji: '🍉', color: '#B5FFD8', category: 'fruit' },
  { id: 'fruit_strawberry', emoji: '🍓', color: '#FFB5C2', category: 'fruit' },
  { id: 'fruit_orange', emoji: '🍊', color: '#FFD8B5', category: 'fruit' },

  // --- Vehicles (4) ---
  { id: 'vehicle_car', emoji: '🚗', color: '#B5D8FF', category: 'vehicle' },
  { id: 'vehicle_bus', emoji: '🚌', color: '#FFF5B5', category: 'vehicle' },
  { id: 'vehicle_rocket', emoji: '🚀', color: '#FFB5B5', category: 'vehicle' },
  { id: 'vehicle_boat', emoji: '⛵', color: '#B5FFE8', category: 'vehicle' },

  // --- Nature (4) ---
  { id: 'nature_sun', emoji: '☀️', color: '#FFF5B5', category: 'nature' },
  { id: 'nature_star', emoji: '⭐', color: '#FFE4B5', category: 'nature' },
  { id: 'nature_rainbow', emoji: '🌈', color: '#D8B5FF', category: 'nature' },
  { id: 'nature_flower', emoji: '🌻', color: '#FFB5C2', category: 'nature' },
];

// ---------- Level Configuration ----------

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LevelConfig {
  difficulty: Difficulty;
  rows: number;
  columns: number;
  /** Total number of cards on the board (rows * columns). Must be even. */
  totalCards: number;
  /** Number of unique pairs needed. */
  pairCount: number;
  /** Label shown in Indonesian */
  labelId: string;
  /** Label shown in English */
  labelEn: string;
}

export const LEVEL_CONFIGS: Record<Difficulty, LevelConfig> = {
  easy: {
    difficulty: 'easy',
    rows: 3,
    columns: 2,
    totalCards: 6,
    pairCount: 3,
    labelId: 'Mudah',
    labelEn: 'Easy',
  },
  medium: {
    difficulty: 'medium',
    rows: 3,
    columns: 4,
    totalCards: 12,
    pairCount: 6,
    labelId: 'Sedang',
    labelEn: 'Medium',
  },
  hard: {
    difficulty: 'hard',
    rows: 4,
    columns: 4,
    totalCards: 16,
    pairCount: 8,
    labelId: 'Sulit',
    labelEn: 'Hard',
  },
};

// ---------- Helpers ----------

/** Fisher-Yates shuffle (immutable). */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface BoardCard extends MemoryCard {
  /** Unique index on the board (so a pair shares the same `id` but different `boardIndex`). */
  boardIndex: number;
  /** The unique key combining id + copy number, e.g. "animal_dog_0". */
  uid: string;
}

/**
 * Build a shuffled board of `BoardCard` for the given difficulty.
 * Picks `pairCount` unique cards, duplicates them, shuffles, and assigns board indices.
 */
export function buildBoard(difficulty: Difficulty): BoardCard[] {
  const config = LEVEL_CONFIGS[difficulty];
  const picked = shuffle(ALL_CARDS).slice(0, config.pairCount);

  const doubled: BoardCard[] = picked.flatMap((card) => [
    { ...card, boardIndex: -1, uid: `${card.id}_0` },
    { ...card, boardIndex: -1, uid: `${card.id}_1` },
  ]);

  const shuffled = shuffle(doubled);
  return shuffled.map((card, index) => ({ ...card, boardIndex: index }));
}

/** Optimal moves for a level = number of pairs (best case: every flip is part of a match). */
export function optimalMoves(difficulty: Difficulty): number {
  return LEVEL_CONFIGS[difficulty].pairCount;
}

export { ALL_CARDS };
