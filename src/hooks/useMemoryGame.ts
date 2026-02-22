import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BoardCard,
  buildBoard,
  Difficulty,
  LEVEL_CONFIGS,
  optimalMoves,
} from '../data/memoryCardData';

export interface MemoryGameState {
  /** All cards currently on the board. */
  cards: BoardCard[];
  /** Board indices of the cards currently face-up (0, 1, or 2). */
  flippedIndices: number[];
  /** Set of card `id` values that have been matched (both copies share the same id). */
  matchedIds: Set<string>;
  /** Total number of "moves" (a move = flipping the second card of a pair attempt). */
  moves: number;
  /** Whether all pairs have been found. */
  isWon: boolean;
  /** Star rating (1-3) once won; 0 while playing. */
  stars: number;
  /** Flip a card at the given board index. */
  flipCard: (boardIndex: number) => void;
  /** Reset the game for the given difficulty (or re-use current). */
  resetGame: (difficulty?: Difficulty) => void;
}

/**
 * Core game-logic hook for the Memory Magic module.
 *
 * Star rating formula (computed once the game is won):
 *   - 3 stars: total moves < 1.2 * optimal
 *   - 2 stars: total moves < 1.5 * optimal
 *   - 1 star : completed (any move count)
 *
 * "optimal" = number of pairs (each pair found on the first try = 1 move per pair).
 */
export function useMemoryGame(initialDifficulty: Difficulty): MemoryGameState {
  const [cards, setCards] = useState<BoardCard[]>(() =>
    buildBoard(initialDifficulty)
  );
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [stars, setStars] = useState(0);
  const [difficulty, setDifficulty] = useState(initialDifficulty);

  // Prevent rapid tapping while a mismatch is being resolved.
  const lockRef = useRef(false);

  // ----- Star calculation -----
  const computeStars = useCallback(
    (totalMoves: number): number => {
      const optimal = optimalMoves(difficulty);
      if (totalMoves <= optimal * 1.2) return 3;
      if (totalMoves <= optimal * 1.5) return 2;
      return 1;
    },
    [difficulty]
  );

  // ----- Win detection -----
  useEffect(() => {
    if (cards.length === 0) return;
    const pairCount = LEVEL_CONFIGS[difficulty].pairCount;
    if (matchedIds.size === pairCount) {
      setIsWon(true);
      setStars(computeStars(moves));
    }
  }, [matchedIds, cards.length, difficulty, moves, computeStars]);

  // ----- Flip logic -----
  const flipCard = useCallback(
    (boardIndex: number) => {
      if (lockRef.current) return;
      if (isWon) return;

      // Ignore if already flipped or already matched.
      const card = cards[boardIndex];
      if (!card) return;
      if (matchedIds.has(card.id)) return;

      setFlippedIndices((prev) => {
        if (prev.includes(boardIndex)) return prev; // already face-up
        if (prev.length >= 2) return prev; // two already flipped, waiting for resolve

        const next = [...prev, boardIndex];

        if (next.length === 2) {
          // This is the second flip -- counts as a "move".
          setMoves((m) => m + 1);

          const first = cards[next[0]];
          const second = cards[next[1]];

          if (first.id === second.id) {
            // Match!
            setMatchedIds((prevMatched) => {
              const updated = new Set(prevMatched);
              updated.add(first.id);
              return updated;
            });
            // Clear flipped after a short delay so the player sees both cards.
            setTimeout(() => {
              setFlippedIndices([]);
            }, 400);
          } else {
            // Mismatch -- flip back after a brief pause.
            lockRef.current = true;
            setTimeout(() => {
              setFlippedIndices([]);
              lockRef.current = false;
            }, 800);
          }
        }

        return next;
      });
    },
    [cards, matchedIds, isWon]
  );

  // ----- Reset -----
  const resetGame = useCallback(
    (newDifficulty?: Difficulty) => {
      const diff = newDifficulty ?? difficulty;
      setDifficulty(diff);
      setCards(buildBoard(diff));
      setFlippedIndices([]);
      setMatchedIds(new Set());
      setMoves(0);
      setIsWon(false);
      setStars(0);
      lockRef.current = false;
    },
    [difficulty]
  );

  return {
    cards,
    flippedIndices,
    matchedIds,
    moves,
    isWon,
    stars,
    flipCard,
    resetGame,
  };
}
