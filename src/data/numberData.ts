export interface NumberDef {
  value: number;
  word: string;
  wordEn: string;
  color: string;
  emoji: string;
}

export const NUMBERS: NumberDef[] = [
  { value: 1, word: 'Satu', wordEn: 'One', color: '#FFB5B5', emoji: '🍎' },
  { value: 2, word: 'Dua', wordEn: 'Two', color: '#B5D8FF', emoji: '⭐' },
  { value: 3, word: 'Tiga', wordEn: 'Three', color: '#B5FFD8', emoji: '🌟' },
  { value: 4, word: 'Empat', wordEn: 'Four', color: '#FFF5B5', emoji: '🌸' },
  { value: 5, word: 'Lima', wordEn: 'Five', color: '#D8B5FF', emoji: '🐝' },
  { value: 6, word: 'Enam', wordEn: 'Six', color: '#FFD8B5', emoji: '🍓' },
  { value: 7, word: 'Tujuh', wordEn: 'Seven', color: '#B5FFE8', emoji: '🌻' },
  { value: 8, word: 'Delapan', wordEn: 'Eight', color: '#FFB5E8', emoji: '💜' },
  { value: 9, word: 'Sembilan', wordEn: 'Nine', color: '#C8FFB5', emoji: '🍀' },
  { value: 10, word: 'Sepuluh', wordEn: 'Ten', color: '#FFE0B5', emoji: '🌞' },
  { value: 11, word: 'Sebelas', wordEn: 'Eleven', color: '#B5C8FF', emoji: '🦋' },
  { value: 12, word: 'Dua Belas', wordEn: 'Twelve', color: '#FFB5D8', emoji: '🍒' },
  { value: 13, word: 'Tiga Belas', wordEn: 'Thirteen', color: '#E8B5FF', emoji: '🌺' },
  { value: 14, word: 'Empat Belas', wordEn: 'Fourteen', color: '#B5FFD0', emoji: '🍊' },
  { value: 15, word: 'Lima Belas', wordEn: 'Fifteen', color: '#FFDAB5', emoji: '🌈' },
  { value: 16, word: 'Enam Belas', wordEn: 'Sixteen', color: '#B5E8FF', emoji: '🔮' },
  { value: 17, word: 'Tujuh Belas', wordEn: 'Seventeen', color: '#FFB5C8', emoji: '🌷' },
  { value: 18, word: 'Delapan Belas', wordEn: 'Eighteen', color: '#D8FFB5', emoji: '🌼' },
  { value: 19, word: 'Sembilan Belas', wordEn: 'Nineteen', color: '#C8B5FF', emoji: '🦉' },
  { value: 20, word: 'Dua Puluh', wordEn: 'Twenty', color: '#FFE8C0', emoji: '🌟' },
];

/** Counting game emoji sets for variety */
export const COUNTING_EMOJIS = [
  '🍎', '⭐', '🌸', '🐝', '🍓',
  '🌻', '💜', '🍀', '🦋', '🍒',
  '🍊', '🌞', '🔮', '🌷', '🌼',
];

export function getRandomEmoji(): string {
  return COUNTING_EMOJIS[Math.floor(Math.random() * COUNTING_EMOJIS.length)];
}
