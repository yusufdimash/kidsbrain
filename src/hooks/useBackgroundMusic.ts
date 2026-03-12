import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useGameProgress } from '../context/GameProgressContext';

const TRACK = require('../../assets/audio/bgm_loop.wav');

let sharedBgm: Audio.Sound | null = null;
let bgmReadyPromise: Promise<void> | null = null;

async function ensureBgmLoaded() {
  if (sharedBgm) return;
  if (bgmReadyPromise) return bgmReadyPromise;

  bgmReadyPromise = (async () => {
    const sound = new Audio.Sound();
    await sound.loadAsync(TRACK, { isLooping: true, volume: 0.35 });
    sharedBgm = sound;
  })();

  return bgmReadyPromise;
}

export function useBackgroundMusic(_moduleKey?: string) {
  const { state } = useGameProgress();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    ensureBgmLoaded()
      .then(async () => {
        if (!mountedRef.current || !sharedBgm) return;
        if (state.musicEnabled) {
          await sharedBgm.playAsync();
        } else {
          await sharedBgm.pauseAsync();
        }
      })
      .catch(() => {});

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!sharedBgm) return;
    if (state.musicEnabled) {
      sharedBgm.playAsync().catch(() => {});
    } else {
      sharedBgm.pauseAsync().catch(() => {});
    }
  }, [state.musicEnabled]);

  return {
    stop: async () => {
      if (sharedBgm) {
        await sharedBgm.stopAsync().catch(() => {});
      }
    },
  };
}
