/**
 * Utility functions for path sampling and accuracy calculation
 * Used by the TracingCanvas engine
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Sample points along an SVG-like path string at regular intervals.
 * For Skia paths, we approximate by walking along line segments.
 */
export function samplePathPoints(
  pathPoints: Point[],
  numSamples: number = 200
): Point[] {
  if (pathPoints.length < 2) return pathPoints;

  // Calculate total path length
  let totalLength = 0;
  const segmentLengths: number[] = [];
  for (let i = 1; i < pathPoints.length; i++) {
    const dx = pathPoints[i].x - pathPoints[i - 1].x;
    const dy = pathPoints[i].y - pathPoints[i - 1].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segmentLengths.push(len);
    totalLength += len;
  }

  if (totalLength === 0) return [pathPoints[0]];

  const step = totalLength / (numSamples - 1);
  const samples: Point[] = [{ ...pathPoints[0] }];

  let currentDist = 0;
  let segIndex = 0;
  let segProgress = 0; // how far along current segment

  for (let i = 1; i < numSamples; i++) {
    const targetDist = i * step;

    while (segIndex < segmentLengths.length) {
      const remainInSeg = segmentLengths[segIndex] - segProgress;
      const needed = targetDist - currentDist;

      if (needed <= remainInSeg) {
        // Target is within this segment
        const t = (segProgress + needed) / segmentLengths[segIndex];
        const p0 = pathPoints[segIndex];
        const p1 = pathPoints[segIndex + 1];
        samples.push({
          x: p0.x + (p1.x - p0.x) * t,
          y: p0.y + (p1.y - p0.y) * t,
        });
        segProgress += needed;
        currentDist = targetDist;
        break;
      } else {
        // Move to next segment
        currentDist += remainInSeg;
        segIndex++;
        segProgress = 0;
      }
    }

    // If we've exhausted segments, use last point
    if (segIndex >= segmentLengths.length) {
      samples.push({ ...pathPoints[pathPoints.length - 1] });
    }
  }

  return samples;
}

/**
 * Calculate the minimum distance from a point to the nearest sample point
 */
export function minDistanceToPath(
  point: Point,
  pathSamples: Point[]
): number {
  let minDist = Infinity;
  for (const sample of pathSamples) {
    const dx = point.x - sample.x;
    const dy = point.y - sample.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist) {
      minDist = dist;
    }
  }
  return minDist;
}

/**
 * Calculate tracing accuracy.
 * For each user point, check if it's within tolerance of the guide path.
 * Returns 0-100 percentage.
 */
export function calculateAccuracy(
  userPoints: Point[],
  guideSamples: Point[],
  toleranceRadius: number = 20
): number {
  if (userPoints.length === 0) return 0;

  let accurateCount = 0;
  for (const point of userPoints) {
    const dist = minDistanceToPath(point, guideSamples);
    if (dist <= toleranceRadius) {
      accurateCount++;
    }
  }

  return (accurateCount / userPoints.length) * 100;
}

/**
 * Calculate path coverage - how much of the guide path was traced.
 * For each guide sample, check if any user point is within tolerance.
 */
export function calculateCoverage(
  userPoints: Point[],
  guideSamples: Point[],
  toleranceRadius: number = 25
): number {
  if (guideSamples.length === 0) return 0;

  let coveredCount = 0;
  for (const sample of guideSamples) {
    let covered = false;
    for (const point of userPoints) {
      const dx = point.x - sample.x;
      const dy = point.y - sample.y;
      if (Math.sqrt(dx * dx + dy * dy) <= toleranceRadius) {
        covered = true;
        break;
      }
    }
    if (covered) coveredCount++;
  }

  return (coveredCount / guideSamples.length) * 100;
}

/**
 * Check if a point is near a waypoint
 */
export function isNearPoint(
  point: Point,
  target: Point,
  radius: number
): boolean {
  const dx = point.x - target.x;
  const dy = point.y - target.y;
  return Math.sqrt(dx * dx + dy * dy) <= radius;
}

/**
 * Convert accuracy percentage to star rating (1-3)
 */
export function accuracyToStars(accuracy: number, coverage: number): number {
  const combined = accuracy * 0.6 + coverage * 0.4;
  if (combined >= 80) return 3;
  if (combined >= 55) return 2;
  return 1;
}

/**
 * Smooth a path by averaging adjacent points (simple moving average)
 */
export function smoothPath(points: Point[], windowSize: number = 3): Point[] {
  if (points.length < windowSize) return points;

  const half = Math.floor(windowSize / 2);
  return points.map((_, i) => {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let j = Math.max(0, i - half); j <= Math.min(points.length - 1, i + half); j++) {
      sumX += points[j].x;
      sumY += points[j].y;
      count++;
    }
    return { x: sumX / count, y: sumY / count };
  });
}
