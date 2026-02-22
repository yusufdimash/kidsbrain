import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GameHeader from '../components/GameHeader';
import TracingCanvas from '../components/tracing/TracingCanvas';
import TargetSelectionGrid from '../components/tracing/TargetSelectionGrid';
import TracingResultScreen from '../components/tracing/TracingResultScreen';
import { SHAPE_PATHS, getShapePath } from '../data/shapePaths';
import { useProgress } from '../hooks/useProgress';
import { useLayout } from '../hooks/useLayout';
import { COLORS, SPACING } from '../constants/theme';
import { S } from '../constants/strings';

export default function ShapeTracingScreen() {
  const { width } = useLayout();
  const { completeLevel, getStars } = useProgress('tracingFun');

  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [phase, setPhase] = useState<'select' | 'trace' | 'result'>('select');
  const [resultData, setResultData] = useState({ accuracy: 0, stars: 0 });

  const canvasSize = Math.min(width - SPACING.lg * 2, 400);

  const shapePath = useMemo(() => {
    if (!selectedShape) return null;
    return getShapePath(selectedShape);
  }, [selectedShape]);

  const gridItems = SHAPE_PATHS.map((sp) => ({
    id: sp.id,
    label: sp.name,
    emoji: sp.emoji,
    completed: getStars(`shape_${sp.id}`) > 0,
    stars: getStars(`shape_${sp.id}`),
  }));

  const handleSelect = useCallback((id: string) => {
    setSelectedShape(id);
    setPhase('trace');
  }, []);

  const handleComplete = useCallback(
    (accuracy: number, stars: number) => {
      setResultData({ accuracy, stars });
      setPhase('result');
      if (selectedShape) {
        completeLevel(`shape_${selectedShape}`, stars);
      }
    },
    [selectedShape, completeLevel]
  );

  const handleRetry = useCallback(() => {
    setPhase('trace');
  }, []);

  const handleNext = useCallback(() => {
    const currentIndex = SHAPE_PATHS.findIndex((sp) => sp.id === selectedShape);
    if (currentIndex < SHAPE_PATHS.length - 1) {
      setSelectedShape(SHAPE_PATHS[currentIndex + 1].id);
      setPhase('trace');
    } else {
      setPhase('select');
      setSelectedShape(null);
    }
  }, [selectedShape]);

  if (phase === 'result') {
    return (
      <TracingResultScreen
        stars={resultData.stars}
        accuracy={resultData.accuracy}
        targetName={shapePath?.emoji || ''}
        onRetry={handleRetry}
        onNext={handleNext}
      />
    );
  }

  return (
    <View style={styles.container}>
      <GameHeader
        title={S.tracingShapes.id}
        subtitle={S.tracingShapes.en}
        color={COLORS.blue}
      />

      {phase === 'select' && (
        <TargetSelectionGrid items={gridItems} onSelect={handleSelect} columns={3} />
      )}

      {phase === 'trace' && shapePath && (
        <TracingCanvas
          mode="shape"
          target={shapePath.name}
          guidePath={shapePath.makePath(canvasSize)}
          waypoints={shapePath.getWaypoints(canvasSize)}
          onComplete={handleComplete}
          brushStyle="glitter"
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
