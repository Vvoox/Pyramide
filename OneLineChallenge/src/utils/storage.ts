/**
 * Thin wrapper around AsyncStorage for typed, error-safe reads and writes.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@one_line_challenge/progress';

export interface ProgressData {
  /** Set of level IDs that have been completed at least once. */
  completedLevels: number[];
  /** Highest level the player has unlocked (1-based). */
  highestUnlocked: number;
}

const DEFAULT_PROGRESS: ProgressData = {
  completedLevels: [],
  highestUnlocked: 1,
};

export async function loadProgress(): Promise<ProgressData> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) } as ProgressData;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveProgress(data: ProgressData): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
  } catch {
    // Silently ignore storage failures; progress is non-critical.
  }
}

export async function clearProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROGRESS_KEY);
  } catch {
    // noop
  }
}
