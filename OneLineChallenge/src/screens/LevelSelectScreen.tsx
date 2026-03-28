/**
 * LevelSelectScreen – a scrollable grid of all 10 levels.
 * Locked levels are greyed out and non-interactive.
 */

import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { LEVELS } from '../game/levels';
import { COLORS } from '../constants/colors';
import { useProgress } from '../hooks/useProgress';
import { LevelCard } from '../components/LevelCard';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelect'>;

export function LevelSelectScreen({ navigation }: Props) {
  const { isLevelUnlocked, isLevelCompleted } = useProgress();

  const handleSelectLevel = (levelId: number) => {
    navigation.navigate('Game', { levelId });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Level</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Difficulty sections */}
      <FlatList
        data={LEVELS}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.legendRow}>
            {[
              { label: 'Easy', color: COLORS.diffEasy },
              { label: 'Medium', color: COLORS.diffMedium },
              { label: 'Hard', color: COLORS.diffHard },
            ].map(({ label, color }) => (
              <View key={label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{label}</Text>
              </View>
            ))}
          </View>
        }
        renderItem={({ item }) => (
          <LevelCard
            level={item}
            isUnlocked={isLevelUnlocked(item.id)}
            isCompleted={isLevelCompleted(item.id)}
            onPress={() => handleSelectLevel(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: COLORS.text,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'center',
  },
});
