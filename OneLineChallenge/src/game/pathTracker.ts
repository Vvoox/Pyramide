/**
 * PathTracker – a plain-object state container for in-progress puzzle paths.
 *
 * It is intentionally framework-agnostic (no React) so the logic is easy
 * to reason about and unit-test. The `useGameState` hook wraps it in React
 * state and handles re-rendering.
 */

import { Level } from './levels';
import { validateMove, isLevelComplete, isValidStart, edgeKey } from './validation';
import { Point } from '../utils/geometry';

export type GameStatus = 'idle' | 'drawing' | 'win' | 'fail';

export interface PathState {
  status: GameStatus;
  /** Ordered list of node IDs visited so far (including start node). */
  pathNodeIds: string[];
  /** Set of canonical edge keys that have been traversed. */
  visitedEdges: Set<string>;
  /** Raw touch position of the finger (used to draw the in-progress segment). */
  touchPoint: Point | null;
  /** Optional human-readable reason for a fail. */
  failReason?: string;
}

export function createInitialState(): PathState {
  return {
    status: 'idle',
    pathNodeIds: [],
    visitedEdges: new Set(),
    touchPoint: null,
  };
}

/**
 * Returns a fresh copy of the state after the player puts their finger down.
 * Only starts the path if the touched node is a valid starting position.
 */
export function applyTouchStart(
  state: PathState,
  level: Level,
  nodeId: string,
): PathState {
  if (!isValidStart(level, nodeId)) {
    return {
      ...state,
      status: 'fail',
      failReason: level.startNode
        ? `Start from the highlighted node`
        : 'Touch a node to begin',
    };
  }

  return {
    status: 'drawing',
    pathNodeIds: [nodeId],
    visitedEdges: new Set(),
    touchPoint: null,
  };
}

/**
 * Returns the new state when the player's finger snaps onto a new node.
 * Validates the edge and advances the path, or triggers a fail.
 */
export function applyNodeSnap(
  state: PathState,
  level: Level,
  targetNodeId: string,
): PathState {
  if (state.status !== 'drawing') return state;

  const currentNodeId = state.pathNodeIds[state.pathNodeIds.length - 1];
  if (currentNodeId === targetNodeId) return state; // same node, ignore

  const moveResult = validateMove(level, currentNodeId, targetNodeId, state.visitedEdges);

  if (moveResult !== 'valid') {
    const reason =
      moveResult === 'already-visited'
        ? 'Already traced that edge!'
        : 'No connection between those nodes';
    return { ...state, status: 'fail', failReason: reason };
  }

  const newVisited = new Set(state.visitedEdges);
  newVisited.add(edgeKey(currentNodeId, targetNodeId));

  const newPathNodeIds = [...state.pathNodeIds, targetNodeId];

  const won = isLevelComplete(level, newVisited);

  return {
    status: won ? 'win' : 'drawing',
    pathNodeIds: newPathNodeIds,
    visitedEdges: newVisited,
    touchPoint: null,
  };
}

/**
 * Returns the new state when the player lifts their finger.
 * If the level is not yet complete, trigger a fail.
 */
export function applyTouchEnd(state: PathState, level: Level): PathState {
  if (state.status === 'win' || state.status === 'idle') return state;
  if (state.status !== 'drawing') return state;

  const complete = isLevelComplete(level, state.visitedEdges);
  if (complete) {
    return { ...state, status: 'win', touchPoint: null };
  }

  return {
    ...state,
    status: 'fail',
    touchPoint: null,
    failReason: 'Complete the puzzle without lifting your finger',
  };
}

/** Updates only the raw touch position – does not change game status. */
export function applyTouchMove(state: PathState, point: Point): PathState {
  if (state.status !== 'drawing') return state;
  return { ...state, touchPoint: point };
}
