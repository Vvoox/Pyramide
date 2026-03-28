/**
 * PuzzleBoard – the interactive game canvas.
 *
 * Renders the SVG puzzle (edges + nodes + active path) and captures
 * all touch input via PanResponder, translating it into game events.
 *
 * Layout:
 *   ┌──────────────────────────────┐
 *   │  Transparent touch overlay   │  ← PanResponder lives here
 *   │  ┌────────────────────────┐  │
 *   │  │  SVG canvas            │  │
 *   │  │  • background edges    │  │
 *   │  │  • visited edges       │  │
 *   │  │  • drawn path polyline │  │
 *   │  │  • active-line dash    │  │
 *   │  │  • nodes               │  │
 *   │  └────────────────────────┘  │
 *   └──────────────────────────────┘
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { Level } from '../game/levels';
import { PathState } from '../game/pathTracker';
import { GameHandlers } from '../hooks/useGameState';
import { edgeKey, toPixel } from '../utils/geometry';
import { COLORS } from '../constants/colors';
import { LAYOUT } from '../constants/layout';

import { EdgeView } from './EdgeView';
import { NodeView, NodeState } from './NodeView';

interface Props {
  level: Level;
  boardSize: number;
  gameState: PathState;
  handlers: GameHandlers;
  failAnim: Animated.Value;
}

export function PuzzleBoard({
  level,
  boardSize,
  gameState,
  handlers,
  failAnim,
}: Props) {
  // Page-level offset of the board so we can convert gestureState coords.
  const boardOrigin = useRef({ x: 0, y: 0 });

  const onLayout = useCallback(() => {
    boardViewRef.current?.measureInWindow((x, y) => {
      boardOrigin.current = { x, y };
    });
  }, []);

  const boardViewRef = useRef<View>(null);

  // ------------------------------------------------------------------
  // PanResponder – translate raw page coords to board-local coords
  // ------------------------------------------------------------------
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          const bx = evt.nativeEvent.pageX - boardOrigin.current.x;
          const by = evt.nativeEvent.pageY - boardOrigin.current.y;
          handlers.onTouchStart(bx, by);
        },
        onPanResponderMove: (evt) => {
          const bx = evt.nativeEvent.pageX - boardOrigin.current.x;
          const by = evt.nativeEvent.pageY - boardOrigin.current.y;
          handlers.onTouchMove(bx, by);
        },
        onPanResponderRelease: () => {
          handlers.onTouchEnd();
        },
        onPanResponderTerminate: () => {
          handlers.onTouchEnd();
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handlers],
  );

  // ------------------------------------------------------------------
  // Derived visual state
  // ------------------------------------------------------------------
  const { pathNodeIds, visitedEdges, touchPoint, status } = gameState;

  /** Determine the display state of each node. */
  const nodeStates = useMemo<Record<string, NodeState>>(() => {
    const map: Record<string, NodeState> = {};
    const currentNodeId = pathNodeIds[pathNodeIds.length - 1] ?? null;

    for (const node of level.nodes) {
      if (node.id === currentNodeId) {
        map[node.id] = 'current';
      } else if (pathNodeIds.includes(node.id)) {
        map[node.id] = 'visited';
      } else if (level.startNode === node.id && status === 'idle') {
        map[node.id] = 'start';
      } else {
        map[node.id] = 'default';
      }
    }
    return map;
  }, [level.nodes, level.startNode, pathNodeIds, status]);

  /** Build the SVG points string for the traced path polyline. */
  const pathPoints = useMemo<string>(() => {
    if (pathNodeIds.length === 0) return '';
    const pts = pathNodeIds.map((id) => {
      const node = level.nodes.find((n) => n.id === id)!;
      return `${toPixel(node.x, boardSize)},${toPixel(node.y, boardSize)}`;
    });
    if (touchPoint) {
      pts.push(`${touchPoint.x},${touchPoint.y}`);
    }
    return pts.join(' ');
  }, [pathNodeIds, touchPoint, level.nodes, boardSize]);

  /** Shake transform interpolated from the failAnim value. */
  const shakeTranslate = failAnim.interpolate({
    inputRange: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
    outputRange: [0, -8, 8, -6, 6, -3, 0],
  });

  const isFailing = status === 'fail';

  return (
    <Animated.View
      ref={boardViewRef as React.RefObject<Animated.AnimatedComponent<typeof View>>}
      style={[
        styles.board,
        {
          width: boardSize,
          height: boardSize,
          transform: [{ translateX: shakeTranslate }],
          borderColor: isFailing ? COLORS.error : COLORS.cardBorder,
        },
      ]}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <Svg width={boardSize} height={boardSize}>
        {/* ── Background edges (unvisited, dimmed) ── */}
        {level.edges.map((edge) => {
          const key = edgeKey(edge.from, edge.to);
          const isVisited = visitedEdges.has(key);
          return (
            <EdgeView
              key={key}
              edge={edge}
              nodes={level.nodes}
              boardSize={boardSize}
              isVisited={isVisited}
            />
          );
        })}

        {/* ── Drawn path polyline (on top of edges) ── */}
        {pathPoints.length > 0 && pathNodeIds.length >= 1 && (
          <Polyline
            points={pathPoints}
            fill="none"
            stroke={isFailing ? COLORS.error : COLORS.primary}
            strokeWidth={LAYOUT.pathWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={isFailing ? 0.7 : 1}
          />
        )}

        {/* ── Live touch indicator dot ── */}
        {touchPoint && status === 'drawing' && (
          <Circle
            cx={touchPoint.x}
            cy={touchPoint.y}
            r={7}
            fill={COLORS.primaryLight}
            opacity={0.6}
          />
        )}

        {/* ── Nodes (rendered last so they sit above lines) ── */}
        {level.nodes.map((node) => (
          <NodeView
            key={node.id}
            node={node}
            boardSize={boardSize}
            state={nodeStates[node.id] ?? 'default'}
          />
        ))}
      </Svg>

      {/* Transparent touch capture overlay – same size as SVG */}
      <View style={[StyleSheet.absoluteFill, styles.touchOverlay]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  board: {
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  touchOverlay: {
    // Transparent; only captures touches via PanResponder on the parent View
    backgroundColor: 'transparent',
  },
});
