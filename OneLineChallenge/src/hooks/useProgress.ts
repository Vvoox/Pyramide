/**
 * React hook that exposes the progress store to components.
 * Re-renders automatically when the store emits a change.
 */

import { useEffect, useReducer } from 'react';
import { progressStore } from '../store/progressStore';

export function useProgress() {
  // useReducer as a cheap "force re-render" trigger
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const unsub = progressStore.subscribe(forceUpdate);
    return unsub;
  }, []);

  return {
    progress: progressStore.getProgress(),
    isLevelUnlocked: (id: number) => progressStore.isLevelUnlocked(id),
    isLevelCompleted: (id: number) => progressStore.isLevelCompleted(id),
    markLevelComplete: (id: number) => progressStore.markLevelComplete(id),
  };
}
