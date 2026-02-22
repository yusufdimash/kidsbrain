export interface PatternLevel {
  id: string;
  sequence: string[]; // emoji sequence with one '?' placeholder
  answer: string; // correct emoji
  options: string[]; // 3-4 options including the answer
  difficulty: 'easy' | 'medium' | 'hard';
}

// ── Easy: Simple AB repeating patterns (levels 1-5) ──────────────────────────
// Children learn to recognise the most basic alternating pattern.

const easyLevels: PatternLevel[] = [
  {
    id: 'easy-1',
    sequence: ['🍎', '🍊', '🍎', '🍊', '?'],
    answer: '🍎',
    options: ['🍎', '🍊', '🍇'],
    difficulty: 'easy',
  },
  {
    id: 'easy-2',
    sequence: ['⭐', '🌙', '⭐', '🌙', '?'],
    answer: '⭐',
    options: ['🌙', '⭐', '☀️'],
    difficulty: 'easy',
  },
  {
    id: 'easy-3',
    sequence: ['🐶', '🐱', '🐶', '🐱', '?'],
    answer: '🐶',
    options: ['🐱', '🐶', '🐰'],
    difficulty: 'easy',
  },
  {
    id: 'easy-4',
    sequence: ['🔴', '🔵', '🔴', '🔵', '?'],
    answer: '🔴',
    options: ['🔵', '🟢', '🔴'],
    difficulty: 'easy',
  },
  {
    id: 'easy-5',
    sequence: ['🌸', '🌻', '🌸', '🌻', '?'],
    answer: '🌸',
    options: ['🌻', '🌸', '🌹'],
    difficulty: 'easy',
  },
];

// ── Medium: ABC repeating patterns & slightly longer sequences (levels 6-10) ─
// Introduces a third element and tests recognition at different positions.

const mediumLevels: PatternLevel[] = [
  {
    id: 'med-1',
    sequence: ['🔴', '🔵', '🟢', '🔴', '🔵', '?'],
    answer: '🟢',
    options: ['🔴', '🟢', '🔵', '🟡'],
    difficulty: 'medium',
  },
  {
    id: 'med-2',
    sequence: ['🍎', '🍌', '🍇', '🍎', '🍌', '?'],
    answer: '🍇',
    options: ['🍎', '🍌', '🍇', '🍊'],
    difficulty: 'medium',
  },
  {
    id: 'med-3',
    sequence: ['🐶', '🐱', '🐰', '🐶', '?', '🐰'],
    answer: '🐱',
    options: ['🐶', '🐱', '🐰', '🐸'],
    difficulty: 'medium',
  },
  {
    id: 'med-4',
    sequence: ['🟡', '🟡', '🔵', '🟡', '🟡', '?'],
    answer: '🔵',
    options: ['🟡', '🔵', '🔴', '🟢'],
    difficulty: 'medium',
  },
  {
    id: 'med-5',
    sequence: ['⬛', '⬜', '⬛', '⬜', '⬛', '?'],
    answer: '⬜',
    options: ['⬛', '⬜', '🟫', '🟦'],
    difficulty: 'medium',
  },
];

// ── Hard: AAB, ABBA, and growing patterns (levels 11-15) ─────────────────────
// Tests more complex structural awareness.

const hardLevels: PatternLevel[] = [
  {
    id: 'hard-1',
    sequence: ['🐱', '🐱', '🐶', '🐱', '🐱', '?'],
    answer: '🐶',
    options: ['🐱', '🐶', '🐰', '🐸'],
    difficulty: 'hard',
  },
  {
    id: 'hard-2',
    sequence: ['🔴', '🔵', '🔵', '🔴', '🔵', '?'],
    answer: '🔵',
    options: ['🔴', '🔵', '🟢', '🟡'],
    difficulty: 'hard',
  },
  {
    id: 'hard-3',
    sequence: ['🌟', '🌟', '🌙', '🌙', '🌟', '?'],
    answer: '🌟',
    options: ['🌟', '🌙', '☀️', '💫'],
    difficulty: 'hard',
  },
  {
    id: 'hard-4',
    sequence: ['🍎', '🍊', '🍊', '🍎', '?', '🍊'],
    answer: '🍊',
    options: ['🍎', '🍊', '🍇', '🍌'],
    difficulty: 'hard',
  },
  {
    id: 'hard-5',
    sequence: ['🔵', '🔴', '🟢', '🔵', '?', '🟢'],
    answer: '🔴',
    options: ['🔵', '🔴', '🟢', '🟡'],
    difficulty: 'hard',
  },
];

export const PATTERN_LEVELS: PatternLevel[] = [
  ...easyLevels,
  ...mediumLevels,
  ...hardLevels,
];

export function getLevelsByDifficulty(
  difficulty: PatternLevel['difficulty']
): PatternLevel[] {
  return PATTERN_LEVELS.filter((l) => l.difficulty === difficulty);
}

export const DIFFICULTIES: PatternLevel['difficulty'][] = [
  'easy',
  'medium',
  'hard',
];
