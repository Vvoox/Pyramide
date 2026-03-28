/**
 * ResultModal – shown when the player wins a level.
 *
 * Displays a brief celebration, the level number, and two actions:
 *   • Next Level (if one exists)
 *   • Play Again
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '../constants/colors';
import { LEVELS } from '../game/levels';

interface Props {
  visible: boolean;
  levelId: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onClose: () => void;
}

export function ResultModal({
  visible,
  levelId,
  onNextLevel,
  onRetry,
  onClose,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const hasNextLevel = levelId < LEVELS[LEVELS.length - 1].id;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.6);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          {/* Trophy / celebration */}
          <Text style={styles.emoji}>🏆</Text>
          <Text style={styles.title}>Level Complete!</Text>
          <Text style={styles.subtitle}>Level {levelId} solved</Text>

          {/* Stars / decorative dots */}
          <View style={styles.starsRow}>
            {[0, 1, 2].map((i) => (
              <Text key={i} style={styles.star}>
                ★
              </Text>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={onRetry}
              activeOpacity={0.75}
            >
              <Text style={styles.retryBtnText}>↺  Retry</Text>
            </TouchableOpacity>

            {hasNextLevel && (
              <TouchableOpacity
                style={styles.nextBtn}
                onPress={onNextLevel}
                activeOpacity={0.75}
              >
                <Text style={styles.nextBtnText}>Next  ›</Text>
              </TouchableOpacity>
            )}
          </View>

          {!hasNextLevel && (
            <Text style={styles.allDoneText}>🎉 You've completed all levels!</Text>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: COLORS.accent + '44',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  star: {
    color: COLORS.warning,
    fontSize: 26,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  retryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  retryBtnText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 1.4,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  nextBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  allDoneText: {
    color: COLORS.accent,
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
});
