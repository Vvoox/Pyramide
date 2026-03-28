/**
 * GameScreen – the core gameplay screen.
 *
 * Responsibilities:
 *   1. Load the level by ID from route params
 *   2. Mount the PuzzleBoard and GameHeader
 *   3. Wire the useGameState hook
 *   4. Show the ResultModal on win
 *   5. Display a fail hint below the board on fail
 *   6. Persist level completion via progressStore
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { getLevelById, LEVELS } from '../game/levels';
import { COLORS } from '../constants/colors';
import { LAYOUT } from '../constants/layout';
import { useGameState } from '../hooks/useGameState';
import { progressStore } from '../store/progressStore';
import { PuzzleBoard } from '../components/PuzzleBoard';
import { GameHeader } from '../components/GameHeader';
import { ResultModal } from '../components/ResultModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export function GameScreen({ route, navigation }: Props) {
  const { levelId } = route.params;
  const level = getLevelById(levelId);

  // Hint opacity for "start from highlighted node" message
  const [showHint, setShowHint] = useState(true);
  const hintOpacity = React.useRef(new Animated.Value(1)).current;

  // Win modal visibility
  const [winModalVisible, setWinModalVisible] = useState(false);

  // ------------------------------------------------------------------
  // Callbacks
  // ------------------------------------------------------------------
  const onWin = useCallback(() => {
    progressStore.markLevelComplete(levelId);
    // Small delay so the player sees the completed board before the modal
    setTimeout(() => setWinModalVisible(true), 350);
  }, [levelId]);

  const onFail = useCallback(() => {
    // The board's shake animation already provides feedback; nothing extra needed
  }, []);

  // ------------------------------------------------------------------
  // Game state
  // ------------------------------------------------------------------
  const { gameState, handlers, failAnim } = useGameState(
    level ?? LEVELS[0],
    LAYOUT.boardSize,
    onWin,
    onFail,
  );

  // Fade the hint out once drawing begins
  useEffect(() => {
    if (gameState.status === 'drawing' || gameState.status === 'win') {
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowHint(false));
    } else if (gameState.status === 'idle') {
      setShowHint(true);
      hintOpacity.setValue(1);
    }
  }, [gameState.status, hintOpacity]);

  // ------------------------------------------------------------------
  // Navigation helpers
  // ------------------------------------------------------------------
  const handleBack = () => navigation.goBack();

  const handleRestart = () => {
    setWinModalVisible(false);
    handlers.resetLevel();
  };

  const handleNextLevel = () => {
    setWinModalVisible(false);
    const nextId = levelId + 1;
    if (nextId <= LEVELS[LEVELS.length - 1].id) {
      navigation.replace('Game', { levelId: nextId });
    }
  };

  if (!level) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Level not found</Text>
      </SafeAreaView>
    );
  }

  const isFail = gameState.status === 'fail';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <GameHeader
        levelId={level.id}
        levelName={level.name}
        difficulty={level.difficulty}
        onBack={handleBack}
        onRestart={handleRestart}
      />

      {/* Board container – centered vertically */}
      <View style={styles.boardContainer}>
        <PuzzleBoard
          level={level}
          boardSize={LAYOUT.boardSize}
          gameState={gameState}
          handlers={handlers}
          failAnim={failAnim}
        />

        {/* Hint: where to start */}
        {showHint && level.startNode && (
          <Animated.View style={[styles.hintContainer, { opacity: hintOpacity }]}>
            <Text style={styles.hintText}>
              ✦  Start from the{' '}
              <Text style={styles.hintHighlight}>highlighted</Text> node
            </Text>
          </Animated.View>
        )}

        {/* Fail message */}
        {isFail && (
          <View style={styles.failContainer}>
            <Text style={styles.failText}>
              {gameState.failReason ?? 'Try again!'}
            </Text>
          </View>
        )}

        {/* Edge counter */}
        <View style={styles.counterRow}>
          <Text style={styles.counterText}>
            {gameState.visitedEdges.size} / {level.edges.length} edges
          </Text>
        </View>
      </View>

      {/* Win modal */}
      <ResultModal
        visible={winModalVisible}
        levelId={level.id}
        onNextLevel={handleNextLevel}
        onRetry={handleRestart}
        onClose={() => setWinModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  hintContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.nodeStart + '55',
  },
  hintText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  hintHighlight: {
    color: COLORS.nodeStart,
    fontWeight: '700',
  },
  failContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.error + '22',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.error + '55',
  },
  failText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  counterRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  counterText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
