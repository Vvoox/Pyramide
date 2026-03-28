/**
 * Pure validation helpers for the One Line Challenge game.
 * No React dependencies – these are plain functions that can be unit-tested.
 */

import { Level } from './levels';
import { edgeKey } from '../utils/geometry';

/** True if an edge exists between the two node IDs in the given level. */
export function edgeExists(level: Level, fromId: string, toId: string): boolean {
  const key = edgeKey(fromId, toId);
  return level.edges.some((e) => edgeKey(e.from, e.to) === key);
}

/** True when every required edge has been visited exactly once. */
export function isLevelComplete(level: Level, visitedEdges: Set<string>): boolean {
  if (visitedEdges.size !== level.edges.length) return false;
  return level.edges.every((e) => visitedEdges.has(edgeKey(e.from, e.to)));
}

/**
 * Validate a proposed move from `fromId` to `toId`.
 *
 * Returns:
 *   'valid'           – the move is legal and the edge has not been visited
 *   'already-visited' – the edge exists but has already been traced
 *   'no-edge'         – no edge connects these two nodes in the level
 */
export type MoveResult = 'valid' | 'already-visited' | 'no-edge';

export function validateMove(
  level: Level,
  fromId: string,
  toId: string,
  visitedEdges: Set<string>,
): MoveResult {
  const key = edgeKey(fromId, toId);
  if (!edgeExists(level, fromId, toId)) return 'no-edge';
  if (visitedEdges.has(key)) return 'already-visited';
  return 'valid';
}

/**
 * Check whether the player is allowed to start from a given node.
 * For Eulerian path levels a specific start node is required.
 * For Eulerian circuit levels any node is a valid start.
 */
export function isValidStart(level: Level, nodeId: string): boolean {
  if (!level.startNode) return true; // circuit – any node is fine
  return level.startNode === nodeId;
}

/**
 * Compute the canonical edge key exposed for use outside this module.
 * Re-exported here so consumers have a single import.
 */
export { edgeKey };
