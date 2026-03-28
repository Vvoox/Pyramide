/**
 * LevelCard – a single card in the level-select grid.
 * Shows level number, name, difficulty, and locked/completed state.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Level } from '../game/levels';
import { COLORS } from '../constants/colors';

const DIFF_COLOR: Record<string, string> = {
  easy: COLORS.diffEasy,
  medium: COLORS.diffMedium,
  hard: COLORS.diffHard,
};

interface Props {
  level: Level;
  isUnlocked: boolean;
  isCompleted: boolean;
  onPress: () => void;
}

export function LevelCard({ level, isUnlocked, isCompleted, onPress }: Props) {
  const diffColor = DIFF_COLOR[level.difficulty] ?? COLORS.text;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCompleted && styles.cardCompleted,
        !isUnlocked && styles.cardLocked,
      ]}
      onPress={onPress}
      disabled={!isUnlocked}
      activeOpacity={0.75}
    >
      {/* Difficulty accent bar at top */}
      <View style={[styles.accentBar, { backgroundColor: isUnlocked ? diffColor : COLORS.textMuted }]} />

      {/* Completed checkmark */}
      {isCompleted && (
        <View style={styles.checkBadge}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}

      {/* Lock icon for locked levels */}
      {!isUnlocked && (
        <View style={styles.lockOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
        </View>
      )}

      {/* Level number */}
      <Text style={[styles.levelNum, !isUnlocked && styles.textLocked]}>
        {level.id}
      </Text>

      {/* Level name */}
      <Text style={[styles.levelName, !isUnlocked && styles.textLocked]} numberOfLines={1}>
        {level.name}
      </Text>

      {/* Difficulty label */}
      <Text style={[styles.diffLabel, { color: isUnlocked ? diffColor : COLORS.textMuted }]}>
        {level.difficulty}
      </Text>
    </TouchableOpacity>
  );
}

const CARD_SIZE = 95;

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    overflow: 'hidden',
  },
  cardCompleted: {
    borderColor: COLORS.accent + '80',
    backgroundColor: COLORS.card,
  },
  cardLocked: {
    opacity: 0.5,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: COLORS.black,
    fontSize: 11,
    fontWeight: '900',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background + 'aa',
    zIndex: 1,
  },
  lockIcon: {
    fontSize: 24,
  },
  levelNum: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 4,
  },
  levelName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  diffLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  textLocked: {
    color: COLORS.textMuted,
  },
});
