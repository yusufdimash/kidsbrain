import { useCallback, useRef, useState } from 'react';
import {
  Point,
  samplePathPoints,
  calculateAccuracy,
  calculateCoverage,
  isNearPoint,
  accuracyToStars,
  smoothPath,
} from '../utils/pathUtils';

export interface Waypoint {
  x: number;
  y: number;
  order: number;
}

interface UseTracingLogicOptions {
  guidePoints: Point[];
  waypoints: Waypoint[];
  toleranceRadius?: number;
  waypointRadius?: number;
  onWaypointReached?: (index: number) => void;
  onComplete?: (accuracy: number, stars: number) => void;
}

export function useTracingLogic({
  guidePoints,
  waypoints,
  toleranceRadius = 20,
  waypointRadius = 30,
  onWaypointReached,
  onComplete,
}: UseTracingLogicOptions) {
  const [userPoints, setUserPoints] = useState<Point[]>([]);
  const [reachedWaypoints, setReachedWaypoints] = useState<Set<number>>(new Set());
  const [isDrawing, setIsDrawing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<{ accuracy: number; coverage: number; stars: number } | null>(null);

  const guideSamplesRef = useRef<Point[]>([]);

  // Lazily compute guide samples
  const getGuideSamples = useCallback(() => {
    if (guideSamplesRef.current.length === 0 && guidePoints.length > 1) {
      guideSamplesRef.current = samplePathPoints(guidePoints, 200);
    }
    return guideSamplesRef.current;
  }, [guidePoints]);

  const startDrawing = useCallback((point: Point) => {
    setIsDrawing(true);
    setUserPoints([point]);
  }, []);

  const addPoint = useCallback((point: Point) => {
    if (!isDrawing || isComplete) return;

    setUserPoints((prev) => {
      const newPoints = [...prev, point];

      // Check waypoints
      for (const wp of waypoints) {
        if (!reachedWaypoints.has(wp.order) && isNearPoint(point, wp, waypointRadius)) {
          setReachedWaypoints((prev) => {
            const next = new Set(prev);
            next.add(wp.order);
            return next;
          });
          onWaypointReached?.(wp.order);
        }
      }

      return newPoints;
    });
  }, [isDrawing, isComplete, waypoints, reachedWaypoints, waypointRadius, onWaypointReached]);

  const endDrawing = useCallback(() => {
    setIsDrawing(false);

    if (userPoints.length < 10) return; // Too few points, ignore

    const guideSamples = getGuideSamples();
    if (guideSamples.length === 0) return;

    const smoothed = smoothPath(userPoints, 5);
    const accuracy = calculateAccuracy(smoothed, guideSamples, toleranceRadius);
    const coverage = calculateCoverage(smoothed, guideSamples, toleranceRadius + 5);
    const stars = accuracyToStars(accuracy, coverage);

    setResult({ accuracy, coverage, stars });
    setIsComplete(true);
    onComplete?.(accuracy, stars);
  }, [userPoints, toleranceRadius, getGuideSamples, onComplete]);

  const reset = useCallback(() => {
    setUserPoints([]);
    setReachedWaypoints(new Set());
    setIsDrawing(false);
    setIsComplete(false);
    setResult(null);
  }, []);

  return {
    userPoints,
    reachedWaypoints,
    isDrawing,
    isComplete,
    result,
    startDrawing,
    addPoint,
    endDrawing,
    reset,
  };
}
