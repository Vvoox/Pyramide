/**
 * Level data for One Line Challenge.
 *
 * Every level is an Eulerian-path puzzle: the player must trace every edge
 * exactly once in a single continuous stroke.
 *
 * Math rule enforced when designing levels:
 *   – A graph has an Eulerian CIRCUIT  when every node has even degree.
 *   – A graph has an Eulerian PATH     when exactly two nodes have odd degree
 *     (the player must start at one of them).
 *
 * Node coordinates are normalised to [0, 1]. The board renderer scales them
 * to pixel positions based on the actual board size at runtime.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface LevelNode {
  id: string;
  x: number; // 0–1 normalised
  y: number; // 0–1 normalised
}

export interface LevelEdge {
  from: string;
  to: string;
}

export interface Level {
  id: number;
  name: string;
  difficulty: Difficulty;
  nodes: LevelNode[];
  edges: LevelEdge[];
  /**
   * If defined the player MUST start from this node.
   * Required when the graph has exactly two odd-degree nodes (Eulerian path).
   * Leave undefined for Eulerian circuits where any start node is valid.
   */
  startNode?: string;
}

// ---------------------------------------------------------------------------
// EASY  (3 levels)  — simple shapes, Eulerian circuits or short paths
// ---------------------------------------------------------------------------

const level1: Level = {
  id: 1,
  name: 'Triangle',
  difficulty: 'easy',
  //   A(top)
  //  / \
  // B - C
  // All nodes deg 2 → Eulerian circuit (any start)
  nodes: [
    { id: 'A', x: 0.50, y: 0.15 },
    { id: 'B', x: 0.15, y: 0.82 },
    { id: 'C', x: 0.85, y: 0.82 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'A', to: 'C' },
  ],
};

const level2: Level = {
  id: 2,
  name: 'Square',
  difficulty: 'easy',
  // A - B
  // |   |
  // D - C
  // All nodes deg 2 → Eulerian circuit
  nodes: [
    { id: 'A', x: 0.18, y: 0.18 },
    { id: 'B', x: 0.82, y: 0.18 },
    { id: 'C', x: 0.82, y: 0.82 },
    { id: 'D', x: 0.18, y: 0.82 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'A' },
  ],
};

const level3: Level = {
  id: 3,
  name: 'Diamond',
  difficulty: 'easy',
  //    A
  //   / \
  //  B - C
  //   \ /
  //    D
  // B and C have deg 3 (odd) → Eulerian path from B → C
  nodes: [
    { id: 'A', x: 0.50, y: 0.15 },
    { id: 'B', x: 0.15, y: 0.50 },
    { id: 'C', x: 0.85, y: 0.50 },
    { id: 'D', x: 0.50, y: 0.85 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
    { from: 'C', to: 'D' },
    { from: 'B', to: 'C' },
  ],
  startNode: 'B',
};

// ---------------------------------------------------------------------------
// MEDIUM  (4 levels)
// ---------------------------------------------------------------------------

const level4: Level = {
  id: 4,
  name: 'House',
  difficulty: 'medium',
  //     E (apex)
  //    / \
  //   A - B  (roof-wall join)
  //   |   |
  //   D - C  (floor)
  // A and B deg 3 (odd) → Eulerian path from A → B
  nodes: [
    { id: 'E', x: 0.50, y: 0.10 },
    { id: 'A', x: 0.18, y: 0.36 },
    { id: 'B', x: 0.82, y: 0.36 },
    { id: 'C', x: 0.82, y: 0.78 },
    { id: 'D', x: 0.18, y: 0.78 },
  ],
  edges: [
    { from: 'A', to: 'E' },
    { from: 'B', to: 'E' },
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'A' },
  ],
  startNode: 'A',
};

const level5: Level = {
  id: 5,
  name: 'Pentagon',
  difficulty: 'medium',
  // Regular pentagon with one internal chord (A–C)
  // A and C deg 3 (odd) → Eulerian path from A → C
  nodes: [
    { id: 'A', x: 0.50, y: 0.12 },
    { id: 'B', x: 0.88, y: 0.40 },
    { id: 'C', x: 0.73, y: 0.85 },
    { id: 'D', x: 0.27, y: 0.85 },
    { id: 'E', x: 0.12, y: 0.40 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'A' },
    { from: 'A', to: 'C' }, // internal chord
  ],
  startNode: 'A',
};

const level6: Level = {
  id: 6,
  name: 'Ladder',
  difficulty: 'medium',
  // A - B - C
  // |   |   |
  // D - E - F
  // B and E deg 3 (odd) → Eulerian path from B → E
  nodes: [
    { id: 'A', x: 0.14, y: 0.26 },
    { id: 'B', x: 0.50, y: 0.26 },
    { id: 'C', x: 0.86, y: 0.26 },
    { id: 'D', x: 0.14, y: 0.74 },
    { id: 'E', x: 0.50, y: 0.74 },
    { id: 'F', x: 0.86, y: 0.74 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
    { from: 'A', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
  ],
  startNode: 'B',
};

const level7: Level = {
  id: 7,
  name: 'Kite',
  difficulty: 'medium',
  // Diamond with center + two diagonal chords
  //    A (top)
  //   / \
  //  D - B   (with center E connected to A and C)
  //   \ /
  //    C (bottom)
  // A and C deg 3 (odd) → Eulerian path from A → C
  nodes: [
    { id: 'A', x: 0.50, y: 0.10 },
    { id: 'B', x: 0.88, y: 0.50 },
    { id: 'C', x: 0.50, y: 0.90 },
    { id: 'D', x: 0.12, y: 0.50 },
    { id: 'E', x: 0.50, y: 0.50 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'A' },
    { from: 'A', to: 'E' }, // internal chord A→E
    { from: 'C', to: 'E' }, // internal chord C→E
  ],
  startNode: 'A',
};

// ---------------------------------------------------------------------------
// HARD  (3 levels)
// ---------------------------------------------------------------------------

const level8: Level = {
  id: 8,
  name: 'Hexagon',
  difficulty: 'hard',
  // Regular hexagon + 2 chords: A–C and C–E
  // A and E deg 3 (odd) → Eulerian path from A → E
  nodes: [
    { id: 'A', x: 0.50, y: 0.10 },
    { id: 'B', x: 0.86, y: 0.30 },
    { id: 'C', x: 0.86, y: 0.70 },
    { id: 'D', x: 0.50, y: 0.90 },
    { id: 'E', x: 0.14, y: 0.70 },
    { id: 'F', x: 0.14, y: 0.30 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
    { from: 'F', to: 'A' },
    { from: 'A', to: 'C' }, // chord
    { from: 'C', to: 'E' }, // chord
  ],
  startNode: 'A',
};

const level9: Level = {
  id: 9,
  name: 'Web',
  difficulty: 'hard',
  // 8-node asymmetric grid with diagonal
  // B and E are odd-degree → Eulerian path from B → E
  //
  // A - B - C
  // |   |   |
  // D - E - F
  // |       |
  // G ----- H
  //  (D-F diagonal added)
  nodes: [
    { id: 'A', x: 0.14, y: 0.14 },
    { id: 'B', x: 0.50, y: 0.14 },
    { id: 'C', x: 0.86, y: 0.14 },
    { id: 'D', x: 0.14, y: 0.50 },
    { id: 'E', x: 0.50, y: 0.50 },
    { id: 'F', x: 0.86, y: 0.50 },
    { id: 'G', x: 0.14, y: 0.86 },
    { id: 'H', x: 0.86, y: 0.86 },
  ],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'A', to: 'D' },
    { from: 'B', to: 'E' },
    { from: 'C', to: 'F' },
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
    { from: 'D', to: 'G' },
    { from: 'F', to: 'H' },
    { from: 'G', to: 'H' },
    { from: 'D', to: 'F' }, // diagonal
  ],
  startNode: 'B',
};

const level10: Level = {
  id: 10,
  name: 'The Grid',
  difficulty: 'hard',
  // Full 3×3 grid (9 nodes, 12 grid edges) + one extra diagonal B–D
  // F and H are odd-degree → Eulerian path from F → H
  //
  // A - B - C
  // |   |   |
  // D - E - F
  // |   |   |
  // G - H - I
  //
  // Extra edge: B–D
  nodes: [
    { id: 'A', x: 0.14, y: 0.14 },
    { id: 'B', x: 0.50, y: 0.14 },
    { id: 'C', x: 0.86, y: 0.14 },
    { id: 'D', x: 0.14, y: 0.50 },
    { id: 'E', x: 0.50, y: 0.50 },
    { id: 'F', x: 0.86, y: 0.50 },
    { id: 'G', x: 0.14, y: 0.86 },
    { id: 'H', x: 0.50, y: 0.86 },
    { id: 'I', x: 0.86, y: 0.86 },
  ],
  edges: [
    // Top row
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    // Middle row
    { from: 'D', to: 'E' },
    { from: 'E', to: 'F' },
    // Bottom row
    { from: 'G', to: 'H' },
    { from: 'H', to: 'I' },
    // Left column
    { from: 'A', to: 'D' },
    { from: 'D', to: 'G' },
    // Center column
    { from: 'B', to: 'E' },
    { from: 'E', to: 'H' },
    // Right column
    { from: 'C', to: 'F' },
    { from: 'F', to: 'I' },
    // Extra diagonal that makes the puzzle non-trivial
    { from: 'B', to: 'D' },
  ],
  startNode: 'F',
};

export const LEVELS: Level[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
];

export function getLevelById(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}
