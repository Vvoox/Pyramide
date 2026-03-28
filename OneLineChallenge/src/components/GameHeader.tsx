/**
 * GameHeader – the top bar shown during gameplay.
 * Contains a back button, the level name, and a restart button.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '../constants/colors';
import { LAYOUT } from '../constants/layout';
import { Difficulty } from '../game/levels';

const DIFF_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};
const DIFF_COLOR: Record<Difficulty, string> = {
  easy: COLORS.diffEasy,
  medium: COLORS.diffMedium,
  hard: COLORS.diffHard,
};

interface Props {
  levelId: number;
  levelName: string;
  difficulty: Difficulty;
  onBack: () => void;
  onRestart: () => void;
}

export function GameHeader({
  levelId,
  levelName,
  difficulty,
  onBack,
  onRestart,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.7}>
        <Text style={styles.iconBtnText}>‹</Text>
      </TouchableOpacity>

      {/* Level info */}
      <View style={styles.center}>
        <Text style={styles.levelLabel}>Level {levelId}</Text>
        <View style={styles.nameRow}>
          <Text style={styles.levelName}>{levelName}</Text>
          <View style={[styles.diffBadge, { backgroundColor: DIFF_COLOR[difficulty] + '33' }]}>
            <Text style={[styles.diffText, { color: DIFF_COLOR[difficulty] }]}>
              {DIFF_LABEL[difficulty]}
            </Text>
          </View>
        </View>
      </View>

      {/* Restart button */}
      <TouchableOpacity style={styles.iconBtn} onPress={onRestart} activeOpacity={0.7}>
        <Text style={styles.iconBtnText}>↺</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: LAYOUT.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '300',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  levelLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelName: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
