/**
 * NodeView – renders a single puzzle node as an SVG circle.
 *
 * Node states (driven by the parent board):
 *   default   – untouched node
 *   start     – the required starting node (highlighted to guide the player)
 *   current   – the node where the player's finger currently is
 *   visited   – already included in the drawn path
 */

import React from 'react';
import { Circle, G, Text as SvgText } from 'react-native-svg';

import { LevelNode } from '../game/levels';
import { COLORS } from '../constants/colors';
import { LAYOUT } from '../constants/layout';
import { toPixel } from '../utils/geometry';

export type NodeState = 'default' | 'start' | 'current' | 'visited';

interface Props {
  node: LevelNode;
  boardSize: number;
  state: NodeState;
  showLabel?: boolean;
}

const STATE_COLORS: Record<NodeState, { fill: string; stroke: string }> = {
  default: { fill: COLORS.nodeDefault, stroke: COLORS.nodeDefaultBorder },
  start: { fill: COLORS.nodeStart, stroke: COLORS.nodeStartBorder },
  current: { fill: COLORS.nodeCurrent, stroke: COLORS.nodeCurrentBorder },
  visited: { fill: COLORS.nodeVisited, stroke: COLORS.nodeVisitedBorder },
};

export const NodeView = React.memo(function NodeView({
  node,
  boardSize,
  state,
  showLabel = false,
}: Props) {
  const cx = toPixel(node.x, boardSize);
  const cy = toPixel(node.y, boardSize);
  const { fill, stroke } = STATE_COLORS[state];

  const r = LAYOUT.nodeRadius;
  // Slightly larger outer glow ring for active / current nodes
  const glowVisible = state === 'current' || state === 'start';

  return (
    <G>
      {/* Outer glow ring */}
      {glowVisible && (
        <Circle
          cx={cx}
          cy={cy}
          r={r + 7}
          fill={fill}
          fillOpacity={0.22}
          stroke="none"
        />
      )}
      {/* Main node circle */}
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={2.5}
      />
      {/* Optional node ID label (useful for debugging) */}
      {showLabel && (
        <SvgText
          x={cx}
          y={cy + 1}
          fontSize={10}
          fontWeight="bold"
          fill={COLORS.white}
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {node.id}
        </SvgText>
      )}
    </G>
  );
});
