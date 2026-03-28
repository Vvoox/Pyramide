/**
 * useGameState – the central hook that owns all runtime game logic.
 *
 * Responsibilities:
 *   • Tracks the PathState (idle / drawing / win / fail)
 *   • Converts raw touch coordinates to board-relative pixel coords
 *   • Snaps the finger to nearby nodes and calls PathTracker helpers
 *   • Exposes handlers for the PuzzleBoard's PanResponder
 *   • Triggers win/fail callbacks and drives the fail animation
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

import { Level } from '../game/levels';
import {
  PathState,
  GameStatus,
  createInitialState,
  applyTouchStart,
  applyNodeSnap,
  applyTouchEnd,
  applyTouchMove,
} from '../game/pathTracker';
import { findClosestNode, Point } from '../utils/geometry';
import { LAYOUT } from '../constants/layout';

export interface GameHandlers {
  /** Called by PanResponder on grant (finger down). `x` / `y` are board-local pixels. */
  onTouchStart: (x: number, y: number) => void;
  /** Called on every PanResponder move event. */
  onTouchMove: (x: number, y: number) => void;
  /** Called on finger release. */
  onTouchEnd: () => void;
  /** Reset the level to its initial idle state. */
  resetLevel: () => void;
}

export interface UseGameStateReturn {
  gameState: PathState;
  handlers: GameHandlers;
  failAnim: Animated.Value; // 0→1 shake animation for fail feedback
}

export function useGameState(
  level: Level,
  boardSize: number,
  onWin?: () => void,
  onFail?: () => void,
): UseGameStateReturn {
  const [gameState, setGameState] = useState<PathState>(createInitialState);

  // Refs mirror the latest PathState so PanResponder callbacks never see stale values.
  const stateRef = useRef<PathState>(gameState);
  const lastSnappedNodeRef = useRef<string | null>(null);

  const failAnim = useRef(new Animated.Value(0)).current;

  /** Sync ref whenever React state updates. */
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  /** Kick off the fail shake animation and notify parent. */
  const triggerFail = useCallback(() => {
    failAnim.setValue(0);
    Animated.sequence([
      Animated.timing(failAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      // Auto-reset after brief delay so the player sees the fail state
      setTimeout(() => {
        const fresh = createInitialState();
        stateRef.current = fresh;
        setGameState(fresh);
        lastSnappedNodeRef.current = null;
        failAnim.setValue(0);
      }, 600);
    });
    onFail?.();
  }, [failAnim, onFail]);

  const commitState = useCallback(
    (next: PathState) => {
      stateRef.current = next;
      setGameState(next);

      if (next.status === 'win') {
        onWin?.();
      } else if (next.status === 'fail') {
        triggerFail();
      }
    },
    [onWin, triggerFail],
  );

  const onTouchStart = useCallback(
    (x: number, y: number) => {
      const current = stateRef.current;
      // Only accept a new start if idle or previously failed/won
      if (current.status === 'drawing') return;

      const snapped = findClosestNode(
        { x, y },
        level.nodes,
        boardSize,
        LAYOUT.snapRadius,
      );
      if (!snapped) return;

      lastSnappedNodeRef.current = snapped.id;
      const next = applyTouchStart(current, level, snapped.id);
      commitState(next);
    },
    [level, boardSize, commitState],
  );

  const onTouchMove = useCallback(
    (x: number, y: number) => {
      const current = stateRef.current;
      if (current.status !== 'drawing') return;

      const currentNodeId = current.pathNodeIds[current.pathNodeIds.length - 1];

      // Update the raw touch position for the active-line rendering
      const withTouch = applyTouchMove(current, { x, y });

      // Check if the finger is snapping onto a NEW node
      const snapped = findClosestNode(
        { x, y },
        level.nodes,
        boardSize,
        LAYOUT.snapRadius,
        currentNodeId, // exclude the node we are already on
      );

      if (snapped && snapped.id !== lastSnappedNodeRef.current) {
        lastSnappedNodeRef.current = snapped.id;
        const afterSnap = applyNodeSnap(withTouch, level, snapped.id);
        commitState(afterSnap);
        return;
      }

      // No new snap – just update the touch position for the live line
      stateRef.current = withTouch;
      setGameState(withTouch);
    },
    [level, boardSize, commitState],
  );

  const onTouchEnd = useCallback(() => {
    const current = stateRef.current;
    if (current.status !== 'drawing') return;
    const next = applyTouchEnd(current, level);
    lastSnappedNodeRef.current = null;
    commitState(next);
  }, [level, commitState]);

  const resetLevel = useCallback(() => {
    const fresh = createInitialState();
    stateRef.current = fresh;
    setGameState(fresh);
    lastSnappedNodeRef.current = null;
    failAnim.setValue(0);
  }, [failAnim]);

  return {
    gameState,
    handlers: { onTouchStart, onTouchMove, onTouchEnd, resetLevel },
    failAnim,
  };
}

export type { GameStatus };
