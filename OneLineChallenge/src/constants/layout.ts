import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HORIZONTAL_PADDING = 36;

export const LAYOUT = {
  screenWidth: width,
  screenHeight: height,

  // The puzzle board is a square centered on screen
  boardSize: Math.min(width - HORIZONTAL_PADDING * 2, height * 0.52),

  // Node visual radius (drawn circle)
  nodeRadius: 13,

  // Snap radius – how close the finger must be to snap to a node (in board px)
  snapRadius: 36,

  // Edge stroke widths
  edgeWidth: 5,
  edgeActiveWidth: 7,

  // Path line stroke width (the drawn line while solving)
  pathWidth: 7,

  // Header height
  headerHeight: 56,

  // Safe padding
  horizontalPadding: HORIZONTAL_PADDING,
  verticalPadding: 24,
} as const;
