import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GameHeader from '../components/GameHeader';
import TracingCanvas from '../components/tracing/TracingCanvas';
import TargetSelectionGrid from '../components/tracing/TargetSelectionGrid';
import TracingResultScreen from '../components/tracing/TracingResultScreen';
import ZooBookOverlay from '../components/ZooBookOverlay';
import { ANIMAL_PATHS, getAnimalPath } from '../data/animalPaths';
import { useProgress } from '../hooks/useProgress';
import { useZooCollection } from '../hooks/useZooCollection';
import { useLayout } from '../hooks/useLayout';
import { COLORS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';

export default function AnimalTracingScreen() {
  const { width } = useLayout();
  const { completeLevel, getStars } = useProgress('tracingFun');
  const { addAnimal, hasAnimal } = useZooCollection();

  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'trace' | 'result'>('select');
  const [resultData, setResultData] = useState({ accuracy: 0, stars: 0 });
  const [showZoo, setShowZoo] = useState(false);

  const canvasSize = Math.min(width - SPACING.lg * 2, 400);

  const animalPath = useMemo(() => {
    if (!selectedAnimal) return null;
    return getAnimalPath(selectedAnimal);
  }, [selectedAnimal]);

  const gridItems = ANIMAL_PATHS.map((ap) => ({
    id: ap.id,
    label: ap.name,
    emoji: ap.emoji,
    completed: getStars(`animal_${ap.id}`) > 0,
    stars: getStars(`animal_${ap.id}`),
  }));

  const handleSelect = useCallback((id: string) => {
    setSelectedAnimal(id);
    setPhase('trace');
  }, []);

  const handleComplete = useCallback(
    (accuracy: number, stars: number) => {
      setResultData({ accuracy, stars });
      setPhase('result');
      if (selectedAnimal) {
        completeLevel(`animal_${selectedAnimal}`, stars);
        // Add to zoo if got at least 1 star
        if (stars >= 1) {
          addAnimal(selectedAnimal);
        }
      }
    },
    [selectedAnimal, completeLevel, addAnimal]
  );

  const handleRetry = useCallback(() => {
    setPhase('trace');
  }, []);

  const handleNext = useCallback(() => {
    const currentIndex = ANIMAL_PATHS.findIndex((ap) => ap.id === selectedAnimal);
    if (currentIndex < ANIMAL_PATHS.length - 1) {
      setSelectedAnimal(ANIMAL_PATHS[currentIndex + 1].id);
      setPhase('trace');
    } else {
      setPhase('select');
      setSelectedAnimal(null);
    }
  }, [selectedAnimal]);

  if (phase === 'result') {
    return (
      <>
        <TracingResultScreen
          stars={resultData.stars}
          accuracy={resultData.accuracy}
          targetName={animalPath?.emoji || ''}
          onRetry={handleRetry}
          onNext={handleNext}
          onCollection={() => setShowZoo(true)}
        />
        <ZooBookOverlay visible={showZoo} onClose={() => setShowZoo(false)} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <GameHeader
        title={S.tracingAnimals.id}
        subtitle={S.tracingAnimals.en}
        color={COLORS.green}
      />

      {phase === 'select' && (
        <TargetSelectionGrid items={gridItems} onSelect={handleSelect} columns={3} />
      )}

      {phase === 'trace' && animalPath && (
        <TracingCanvas
          mode="character"
          target={animalPath.name}
          guidePath={animalPath.makePath(canvasSize)}
          waypoints={animalPath.getWaypoints(canvasSize)}
          onComplete={handleComplete}
          brushStyle="stars"
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
