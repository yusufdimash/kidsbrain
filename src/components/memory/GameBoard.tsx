import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { BoardCard } from '../../data/memoryCardData';
import { SPACING } from '../../constants/theme';
import FlipCard from './FlipCard';

interface GameBoardProps {
  cards: BoardCard[];
  flippedIndices: number[];
  matchedIds: Set<string>;
  onFlipCard: (boardIndex: number) => void;
  columns: number;
}

export default function GameBoard({
  cards,
  flippedIndices,
  matchedIds,
  onFlipCard,
  columns,
}: GameBoardProps) {
  const { width: screenWidth } = useWindowDimensions();

  // Calculate card size: account for outer padding + gaps between cards.
  const horizontalPadding = SPACING.md * 2; // left + right
  const totalGapWidth = SPACING.sm * (columns - 1);
  const cardSize = Math.floor(
    (screenWidth - horizontalPadding - totalGapWidth) / columns
  );

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { maxWidth: screenWidth - horizontalPadding }]}>
        {cards.map((card) => {
          const isFlipped = flippedIndices.includes(card.boardIndex);
          const isMatched = matchedIds.has(card.id);

          return (
            <View
              key={card.uid}
              style={[
                styles.cardWrapper,
                {
                  width: cardSize,
                  height: cardSize,
                  marginRight:
                    (card.boardIndex + 1) % columns === 0 ? 0 : SPACING.sm,
                  marginBottom: SPACING.sm,
                },
              ]}
            >
              <FlipCard
                card={card}
                isFlipped={isFlipped}
                isMatched={isMatched}
                onPress={onFlipCard}
                size={cardSize}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardWrapper: {
    // Individual width/height set dynamically.
  },
});
