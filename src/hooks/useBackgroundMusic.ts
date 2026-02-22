import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useGameProgress } from '../context/GameProgressContext';

// Background music hook - plays looping music for a module
// Audio files are not yet included; this is the wiring for when they are added
export function useBackgroundMusic(_moduleKey?: string) {
  const { state } = useGameProgress();
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    // Pause/resume based on sound setting
    if (soundRef.current) {
      if (state.soundEnabled) {
        soundRef.current.playAsync().catch(() => {});
      } else {
        soundRef.current.pauseAsync().catch(() => {});
      }
    }
  }, [state.soundEnabled]);

  return {
    stop: async () => {
      if (soundRef.current) {
        await soundRef.current.stopAsync().catch(() => {});
      }
    },
  };
}
