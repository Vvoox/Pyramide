/**
 * Design system color tokens for One Line Challenge.
 * Dark minimalist palette with vibrant accents.
 */
export const COLORS = {
  // Backgrounds
  background: '#0f0f23',
  surface: '#16163a',
  card: '#1e1e42',
  cardBorder: '#2a2a55',

  // Brand / interactive
  primary: '#6c63ff',
  primaryLight: '#9b95ff',
  primaryDim: '#3d3899',
  secondary: '#ff6584',
  accent: '#38ef7d',
  accentDim: '#1fa84d',

  // Node states
  nodeDefault: '#3a3a60',
  nodeDefaultBorder: '#5a5a8a',
  nodeActive: '#6c63ff',
  nodeActiveBorder: '#9b95ff',
  nodeVisited: '#38ef7d',
  nodeVisitedBorder: '#5fff9a',
  nodeStart: '#ff6584',
  nodeStartBorder: '#ff8fa6',
  nodeCurrent: '#ffd700',
  nodeCurrentBorder: '#ffe657',

  // Edge states
  edgeDefault: '#252550',
  edgeVisited: '#38ef7d',
  edgeActive: '#6c63ff',

  // Text
  text: '#ffffff',
  textSecondary: '#9898c0',
  textMuted: '#55557a',

  // Feedback
  success: '#38ef7d',
  error: '#ff4757',
  warning: '#ffd700',

  // Difficulty badges
  diffEasy: '#38ef7d',
  diffMedium: '#ffd700',
  diffHard: '#ff6584',

  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;
