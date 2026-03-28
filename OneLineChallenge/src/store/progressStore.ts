/**
 * In-memory progress store with AsyncStorage persistence.
 *
 * This is a lightweight singleton store (no Redux/Zustand) that works well
 * for the small state surface of a mobile puzzle game. Components access it
 * via the `useProgress` hook which re-renders on changes.
 */

import { loadProgress, saveProgress, ProgressData } from '../utils/storage';
import { LEVELS } from '../game/levels';

type Listener = () => void;

class ProgressStore {
  private data: ProgressData = {
    completedLevels: [],
    highestUnlocked: 1,
  };
  private listeners: Set<Listener> = new Set();
  private loaded = false;

  /** Subscribe to store changes. Returns an unsubscribe function. */
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  /** Load persisted progress from AsyncStorage (call once on app start). */
  async hydrate(): Promise<void> {
    if (this.loaded) return;
    this.data = await loadProgress();
    this.loaded = true;
    this.notify();
  }

  getProgress(): ProgressData {
    return this.data;
  }

  isLevelUnlocked(levelId: number): boolean {
    return levelId <= this.data.highestUnlocked;
  }

  isLevelCompleted(levelId: number): boolean {
    return this.data.completedLevels.includes(levelId);
  }

  /** Call when the player wins a level. Unlocks the next level. */
  async markLevelComplete(levelId: number): Promise<void> {
    const completed = new Set(this.data.completedLevels);
    completed.add(levelId);

    const nextLevelId = levelId + 1;
    const maxLevelId = LEVELS[LEVELS.length - 1].id;
    const highestUnlocked = Math.min(
      Math.max(this.data.highestUnlocked, nextLevelId),
      maxLevelId,
    );

    this.data = {
      completedLevels: Array.from(completed),
      highestUnlocked,
    };

    this.notify();
    await saveProgress(this.data);
  }
}

// Singleton instance shared across the app
export const progressStore = new ProgressStore();
