export interface LetterDef {
  letter: string;
  color: string;
  word: string;
  wordEn: string;
  emoji: string;
  phonics: string;
}

export const LETTERS: LetterDef[] = [
  { letter: 'A', color: '#FFB5B5', word: 'Apel', wordEn: 'Apple', emoji: '🍎', phonics: 'ah' },
  { letter: 'B', color: '#B5D8FF', word: 'Bola', wordEn: 'Ball', emoji: '⚽', phonics: 'beh' },
  { letter: 'C', color: '#FFE8B5', word: 'Cangkir', wordEn: 'Cup', emoji: '☕', phonics: 'ceh' },
  { letter: 'D', color: '#B5FFD8', word: 'Domba', wordEn: 'Sheep', emoji: '🐑', phonics: 'deh' },
  { letter: 'E', color: '#D8B5FF', word: 'Elang', wordEn: 'Eagle', emoji: '🦅', phonics: 'eh' },
  { letter: 'F', color: '#FFB5E8', word: 'Flamingo', wordEn: 'Flamingo', emoji: '🦩', phonics: 'ef' },
  { letter: 'G', color: '#B5FFE8', word: 'Gajah', wordEn: 'Elephant', emoji: '🐘', phonics: 'geh' },
  { letter: 'H', color: '#FFF5B5', word: 'Harimau', wordEn: 'Tiger', emoji: '🐯', phonics: 'ha' },
  { letter: 'I', color: '#FFD8B5', word: 'Ikan', wordEn: 'Fish', emoji: '🐟', phonics: 'ih' },
  { letter: 'J', color: '#B5C8FF', word: 'Jeruk', wordEn: 'Orange', emoji: '🍊', phonics: 'jeh' },
  { letter: 'K', color: '#FFB5D8', word: 'Kucing', wordEn: 'Cat', emoji: '🐱', phonics: 'ka' },
  { letter: 'L', color: '#C8FFB5', word: 'Lebah', wordEn: 'Bee', emoji: '🐝', phonics: 'el' },
  { letter: 'M', color: '#E8B5FF', word: 'Matahari', wordEn: 'Sun', emoji: '☀️', phonics: 'em' },
  { letter: 'N', color: '#B5FFD0', word: 'Nanas', wordEn: 'Pineapple', emoji: '🍍', phonics: 'en' },
  { letter: 'O', color: '#FFE0B5', word: 'Onta', wordEn: 'Camel', emoji: '🐪', phonics: 'oh' },
  { letter: 'P', color: '#B5E8FF', word: 'Panda', wordEn: 'Panda', emoji: '🐼', phonics: 'peh' },
  { letter: 'Q', color: '#FFB5C8', word: 'Qurma', wordEn: 'Date Fruit', emoji: '🌴', phonics: 'ki' },
  { letter: 'R', color: '#D8FFB5', word: 'Rubah', wordEn: 'Fox', emoji: '🦊', phonics: 'er' },
  { letter: 'S', color: '#C8B5FF', word: 'Sapi', wordEn: 'Cow', emoji: '🐮', phonics: 'es' },
  { letter: 'T', color: '#B5FFE0', word: 'Tikus', wordEn: 'Mouse', emoji: '🐭', phonics: 'teh' },
  { letter: 'U', color: '#FFDAB5', word: 'Ular', wordEn: 'Snake', emoji: '🐍', phonics: 'uh' },
  { letter: 'V', color: '#B5D0FF', word: 'Vas', wordEn: 'Vase', emoji: '🏺', phonics: 'feh' },
  { letter: 'W', color: '#FFB5E0', word: 'Wortel', wordEn: 'Carrot', emoji: '🥕', phonics: 'weh' },
  { letter: 'X', color: '#E0FFB5', word: 'Xilofon', wordEn: 'Xylophone', emoji: '🎵', phonics: 'eks' },
  { letter: 'Y', color: '#FFE8C0', word: 'Yuyu', wordEn: 'Crab', emoji: '🦀', phonics: 'yeh' },
  { letter: 'Z', color: '#B5E0FF', word: 'Zebra', wordEn: 'Zebra', emoji: '🦓', phonics: 'zet' },
];

/**
 * Get a random subset of letters, ensuring no duplicates.
 */
export function getRandomLetters(count: number): LetterDef[] {
  const shuffled = [...LETTERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
