import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { Skia, SkPath } from '@shopify/react-native-skia';
import { useLayout } from '../../hooks/useLayout';
import { useTracingLogic, Waypoint } from '../../hooks/useTracingLogic';
import { samplePathPoints, Point } from '../../utils/pathUtils';
import GuidePath from './GuidePath';
import GlitterTrail from './GlitterTrail';
import WaypointDot from './WaypointDot';
import DemoAnimation from './DemoAnimation';
import AccuracyMeter from './AccuracyMeter';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { S } from '../../constants/strings';

type BrushStyle = 'rainbow' | 'glitter' | 'fire' | 'water' | 'stars';

interface TracingCanvasProps {
  mode: 'letter' | 'shape' | 'character';
  target: string;
  guidePath: SkPath;
  waypoints: Waypoint[];
  toleranceRadius?: number;
  showGuide?: boolean;
  onComplete: (accuracy: number, stars: number) => void;
  onWaypointReached?: (index: number) => void;
  brushStyle?: BrushStyle;
}

export default function TracingCanvas({
  mode,
  target,
  guidePath,
  waypoints,
  toleranceRadius = 20,
  showGuide = true,
  onComplete,
  onWaypointReached,
  brushStyle = 'rainbow',
}: TracingCanvasProps) {
  const { width: screenWidth } = useLayout();
  const canvasSize = Math.min(screenWidth - SPACING.lg * 2, 400);

  const [phase, setPhase] = useState<'demo' | 'draw' | 'result'>('demo');
  const [showDemoPlaying, setShowDemoPlaying] = useState(true);

  // Convert SkPath to points for logic
  const guidePoints = useMemo(() => {
    // Sample points from the SkPath
    const numPoints = 100;
    const points: Point[] = [];
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      // Approximate: get point at parameter t along path
      // Use Skia's getPoint method
      try {
        const totalLength = guidePath.computeTightBounds();
        // Simple: interpolate bounds as fallback
        const bounds = guidePath.computeTightBounds();
        // For a real implementation, we'd use path.getPoint()
        // For now, extract points from path commands
      } catch {}
    }

    // Extract path points from Skia path by iterating commands
    const cmds = guidePath.toCmds();
    const extractedPoints: Point[] = [];

    for (const cmd of cmds) {
      // cmd format: [verb, ...args]
      // 0 = moveTo(x,y), 1 = lineTo(x,y), 2 = quadTo(x1,y1,x2,y2),
      // 3 = conicTo, 4 = cubicTo(x1,y1,x2,y2,x3,y3), 5 = close
      const verb = cmd[0];
      if (verb === 0 || verb === 1) {
        extractedPoints.push({ x: cmd[1], y: cmd[2] });
      } else if (verb === 2) {
        // Quad bezier - add intermediate points
        const prev = extractedPoints[extractedPoints.length - 1] || { x: 0, y: 0 };
        for (let t = 0.25; t <= 1; t += 0.25) {
          const x = (1 - t) * (1 - t) * prev.x + 2 * (1 - t) * t * cmd[1] + t * t * cmd[3];
          const y = (1 - t) * (1 - t) * prev.y + 2 * (1 - t) * t * cmd[2] + t * t * cmd[4];
          extractedPoints.push({ x, y });
        }
      } else if (verb === 4) {
        // Cubic bezier
        const prev = extractedPoints[extractedPoints.length - 1] || { x: 0, y: 0 };
        for (let t = 0.2; t <= 1; t += 0.2) {
          const mt = 1 - t;
          const x = mt * mt * mt * prev.x + 3 * mt * mt * t * cmd[1] +
                    3 * mt * t * t * cmd[3] + t * t * t * cmd[5];
          const y = mt * mt * mt * prev.y + 3 * mt * mt * t * cmd[2] +
                    3 * mt * t * t * cmd[4] + t * t * t * cmd[6];
          extractedPoints.push({ x, y });
        }
      }
    }

    return extractedPoints;
  }, [guidePath]);

  const {
    userPoints,
    reachedWaypoints,
    isDrawing,
    isComplete,
    result,
    startDrawing,
    addPoint,
    endDrawing,
    reset,
  } = useTracingLogic({
    guidePoints,
    waypoints,
    toleranceRadius,
    onWaypointReached,
    onComplete: (accuracy, stars) => {
      setPhase('result');
      onComplete(accuracy, stars);
    },
  });

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      'worklet';
      if (phase !== 'draw') return;
      runOnJS(startDrawing)({ x: e.x, y: e.y });
    })
    .onUpdate((e) => {
      'worklet';
      if (phase !== 'draw') return;
      runOnJS(addPoint)({ x: e.x, y: e.y });
    })
    .onEnd(() => {
      'worklet';
      if (phase !== 'draw') return;
      runOnJS(endDrawing)();
    })
    .minDistance(0);

  const handleDemoComplete = useCallback(() => {
    setShowDemoPlaying(false);
    setPhase('draw');
  }, []);

  const handleRetry = useCallback(() => {
    reset();
    setPhase('demo');
    setShowDemoPlaying(true);
  }, [reset]);

  const handleSkipDemo = useCallback(() => {
    setShowDemoPlaying(false);
    setPhase('draw');
  }, []);

  // Sampled guide points for demo animation
  const demoPoints = useMemo(
    () => (guidePoints.length > 1 ? samplePathPoints(guidePoints, 60) : guidePoints),
    [guidePoints]
  );

  return (
    <View style={styles.wrapper}>
      {/* Target label */}
      <Text style={styles.targetLabel}>{target}</Text>

      {/* Canvas area */}
      <GestureDetector gesture={panGesture}>
        <View style={[styles.canvasContainer, { width: canvasSize, height: canvasSize }]}>
          {/* Guide path (dashed) */}
          {showGuide && (
            <GuidePath
              path={guidePath}
              width={canvasSize}
              height={canvasSize}
              color="#D0D0D0"
              strokeWidth={4}
            />
          )}

          {/* Waypoint dots */}
          {waypoints.map((wp) => (
            <WaypointDot
              key={wp.order}
              x={wp.x}
              y={wp.y}
              order={wp.order}
              reached={reachedWaypoints.has(wp.order)}
            />
          ))}

          {/* Demo animation */}
          {phase === 'demo' && (
            <DemoAnimation
              guidePoints={demoPoints}
              playing={showDemoPlaying}
              onComplete={handleDemoComplete}
              duration={3000}
            />
          )}

          {/* User's drawing trail */}
          {userPoints.length > 1 && (
            <GlitterTrail
              points={userPoints}
              width={canvasSize}
              height={canvasSize}
              brushStyle={brushStyle}
              strokeWidth={8}
            />
          )}

          {/* Draw prompt overlay */}
          {phase === 'draw' && !isDrawing && userPoints.length === 0 && (
            <View style={styles.promptOverlay}>
              <Text style={styles.promptText}>{S.tracingStart.id}</Text>
              <Text style={styles.promptSubtext}>{S.tracingStart.en}</Text>
            </View>
          )}
        </View>
      </GestureDetector>

      {/* Demo skip button */}
      {phase === 'demo' && (
        <Pressable style={styles.skipButton} onPress={handleSkipDemo}>
          <Text style={styles.skipText}>Lewati Demo / Skip</Text>
        </Pressable>
      )}

      {/* Result */}
      {phase === 'result' && result && (
        <View style={styles.resultContainer}>
          <AccuracyMeter
            accuracy={result.accuracy}
            coverage={result.coverage}
            stars={result.stars}
            visible
          />
          <Pressable style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>{S.retry.id} / {S.retry.en}</Text>
          </Pressable>
        </View>
      )}

      {/* Phase indicator */}
      {phase === 'demo' && (
        <Text style={styles.phaseText}>{S.tracingDemo.id} / {S.tracingDemo.en}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  targetLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  canvasContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  promptOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  promptText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  promptSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  skipButton: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: RADIUS.full,
  },
  skipText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  resultContainer: {
    marginTop: SPACING.md,
    width: '100%',
  },
  retryButton: {
    marginTop: SPACING.md,
    alignSelf: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.blue,
    borderRadius: RADIUS.full,
    ...SHADOWS.small,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  phaseText: {
    marginTop: SPACING.sm,
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});
