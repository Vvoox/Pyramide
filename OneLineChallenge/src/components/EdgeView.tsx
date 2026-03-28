/**
 * EdgeView – renders a single edge between two nodes as an SVG line.
 * Visited edges are drawn in the accent colour; unvisited are dimmed.
 */

import React from 'react';
import { Line } from 'react-native-svg';

import { LevelEdge, LevelNode } from '../game/levels';
import { COLORS } from '../constants/colors';
import { LAYOUT } from '../constants/layout';
import { toPixel } from '../utils/geometry';

interface Props {
  edge: LevelEdge;
  nodes: LevelNode[];
  boardSize: number;
  isVisited: boolean;
}

export const EdgeView = React.memo(function EdgeView({
  edge,
  nodes,
  boardSize,
  isVisited,
}: Props) {
  const fromNode = nodes.find((n) => n.id === edge.from);
  const toNode = nodes.find((n) => n.id === edge.to);

  if (!fromNode || !toNode) return null;

  const x1 = toPixel(fromNode.x, boardSize);
  const y1 = toPixel(fromNode.y, boardSize);
  const x2 = toPixel(toNode.x, boardSize);
  const y2 = toPixel(toNode.y, boardSize);

  return (
    <Line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isVisited ? COLORS.edgeVisited : COLORS.edgeDefault}
      strokeWidth={isVisited ? LAYOUT.edgeActiveWidth : LAYOUT.edgeWidth}
      strokeLinecap="round"
    />
  );
});
