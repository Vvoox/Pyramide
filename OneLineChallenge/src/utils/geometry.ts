/**
 * Geometry utilities for the puzzle board.
 */

export interface Point {
  x: number;
  y: number;
}

/** Euclidean distance between two points. */
export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Convert a normalised node position (0–1) to pixel coords on the board.
 * @param normalised  The node's x or y in the 0–1 range.
 * @param boardSize   The pixel size of the board.
 */
export function toPixel(normalised: number, boardSize: number): number {
  return normalised * boardSize;
}

/**
 * Generate a canonical edge key from two node IDs.
 * The key is always ordered alphabetically so A-B === B-A.
 */
export function edgeKey(fromId: string, toId: string): string {
  return [fromId, toId].sort().join('--');
}

/**
 * Find the closest node to a point, returning null if none is within the snap radius.
 */
export function findClosestNode<T extends { id: string; x: number; y: number }>(
  touchPoint: Point,
  nodes: T[],
  boardSize: number,
  snapRadius: number,
  excludeId?: string,
): T | null {
  let closest: T | null = null;
  let minDist = snapRadius;

  for (const node of nodes) {
    if (node.id === excludeId) continue;
    const px = toPixel(node.x, boardSize);
    const py = toPixel(node.y, boardSize);
    const d = distance(touchPoint, { x: px, y: py });
    if (d < minDist) {
      minDist = d;
      closest = node;
    }
  }

  return closest;
}
