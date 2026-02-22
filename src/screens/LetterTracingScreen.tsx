import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import GameHeader from '../components/GameHeader';
import TracingCanvas from '../components/tracing/TracingCanvas';
import TargetSelectionGrid from '../components/tracing/TargetSelectionGrid';
import TracingResultScreen from '../components/tracing/TracingResultScreen';
import { LETTER_PATHS, getLetterPath } from '../data/letterPaths';
import { useProgress } from '../hooks/useProgress';
import { useLayout } from '../hooks/useLayout';
import { COLORS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function LetterTracingScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute();
  const { width } = useLayout();
  const { completeLevel, getStars } = useProgress('tracingFun');

  const initialLetter = (route.params as any)?.letter;
  const [selectedLetter, setSelectedLetter] = useState<string | null>(initialLetter || null);
  const [phase, setPhase] = useState<'select' | 'trace' | 'result'>('select');
  const [resultData, setResultData] = useState({ accuracy: 0, stars: 0 });

  const canvasSize = Math.min(width - SPACING.lg * 2, 400);

  const letterPath = useMemo(() => {
    if (!selectedLetter) return null;
    return getLetterPath(selectedLetter);
  }, [selectedLetter]);

  const gridItems = LETTER_PATHS.map((lp) => ({
    id: lp.letter,
    label: lp.letter,
    emoji: lp.letter,
    completed: getStars(`letter_${lp.letter}`) > 0,
    stars: getStars(`letter_${lp.letter}`),
  }));

  const handleSelect = useCallback((id: string) => {
    setSelectedLetter(id);
    setPhase('trace');
  }, []);

  const handleComplete = useCallback(
    (accuracy: number, stars: number) => {
      setResultData({ accuracy, stars });
      setPhase('result');
      if (selectedLetter) {
        completeLevel(`letter_${selectedLetter}`, stars);
      }
    },
    [selectedLetter, completeLevel]
  );

  const handleRetry = useCallback(() => {
    setPhase('trace');
  }, []);

  const handleNext = useCallback(() => {
    const currentIndex = LETTER_PATHS.findIndex((lp) => lp.letter === selectedLetter);
    if (currentIndex < LETTER_PATHS.length - 1) {
      setSelectedLetter(LETTER_PATHS[currentIndex + 1].letter);
      setPhase('trace');
    } else {
      setPhase('select');
      setSelectedLetter(null);
    }
  }, [selectedLetter]);

  if (phase === 'result') {
    return (
      <TracingResultScreen
        stars={resultData.stars}
        accuracy={resultData.accuracy}
        targetName={selectedLetter || ''}
        onRetry={handleRetry}
        onNext={handleNext}
      />
    );
  }

  return (
    <View style={styles.container}>
      <GameHeader
        title={S.tracingLetters.id}
        subtitle={S.tracingLetters.en}
        color={COLORS.pink}
      />

      {phase === 'select' && (
        <TargetSelectionGrid
          items={gridItems}
          onSelect={handleSelect}
          columns={4}
        />
      )}

      {phase === 'trace' && letterPath && (
        <TracingCanvas
          mode="letter"
          target={selectedLetter || ''}
          guidePath={letterPath.makePath(canvasSize)}
          waypoints={letterPath.getWaypoints(canvasSize)}
          onComplete={handleComplete}
          brushStyle="rainbow"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
