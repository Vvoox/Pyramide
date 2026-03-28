/**
 * HomeScreen – the app entry point.
 * Shows the game title, a Play button (resumes at the first unlocked level)
 * and a Level Select button.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { RootStackParamList } from '../navigation/AppNavigator';
import { COLORS } from '../constants/colors';
import { useProgress } from '../hooks/useProgress';
import { progressStore } from '../store/progressStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { progress } = useProgress();

  // Fade-in animation on mount
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handlePlay = () => {
    navigation.navigate('Game', { levelId: progress.highestUnlocked });
  };

  const handleLevelSelect = () => {
    navigation.navigate('LevelSelect');
  };

  return (
    <LinearGradient
      colors={[COLORS.background, '#12122b', '#0f0f23']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Decorative dots */}
          <View style={styles.dotsRow}>
            {[COLORS.primary, COLORS.accent, COLORS.secondary].map((c, i) => (
              <View key={i} style={[styles.dot, { backgroundColor: c }]} />
            ))}
          </View>

          {/* Title */}
          <Text style={styles.title}>ONE LINE</Text>
          <Text style={styles.subtitle}>CHALLENGE</Text>
          <Text style={styles.tagline}>Trace every edge. One stroke.</Text>

          {/* Decorative puzzle preview hint */}
          <View style={styles.previewContainer}>
            <View style={[styles.previewDot, { top: 30, left: '50%' }]} />
            <View style={[styles.previewDot, { bottom: 20, left: '20%' }]} />
            <View style={[styles.previewDot, { bottom: 20, right: '20%' }]} />
            <View style={styles.previewLine1} />
            <View style={styles.previewLine2} />
            <View style={styles.previewLine3} />
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.playBtn} onPress={handlePlay} activeOpacity={0.85}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDim]}
              style={styles.playBtnGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.playBtnText}>▶  PLAY</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.levelsBtn}
            onPress={handleLevelSelect}
            activeOpacity={0.75}
          >
            <Text style={styles.levelsBtnText}>SELECT LEVEL</Text>
          </TouchableOpacity>

          {/* Progress info */}
          <Text style={styles.progressHint}>
            {progress.completedLevels.length} / 10 levels completed
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    color: COLORS.text,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 40,
  },
  previewContainer: {
    width: 140,
    height: 90,
    marginBottom: 48,
    position: 'relative',
  },
  previewDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  previewLine1: {
    position: 'absolute',
    top: 36,
    left: '22%',
    width: 110,
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.4,
  },
  previewLine2: {
    position: 'absolute',
    top: 36,
    left: '18%',
    width: 80,
    height: 2,
    backgroundColor: COLORS.accent,
    opacity: 0.4,
    transform: [{ rotate: '-42deg' }],
  },
  previewLine3: {
    position: 'absolute',
    top: 36,
    right: '15%',
    width: 80,
    height: 2,
    backgroundColor: COLORS.accent,
    opacity: 0.4,
    transform: [{ rotate: '42deg' }],
  },
  playBtn: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  playBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  playBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  levelsBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
    marginBottom: 28,
  },
  levelsBtnText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  progressHint: {
    color: COLORS.textMuted,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
