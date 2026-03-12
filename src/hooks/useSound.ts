import { useCallback, useEffect } from 'react';
import { Audio, type AVPlaybackStatus } from 'expo-av';
import { useGameProgress } from '../context/GameProgressContext';

const SFX_ASSETS = {
  tap: require('../../assets/audio/tap.wav'),
  success: require('../../assets/audio/success.wav'),
  error: require('../../assets/audio/error.wav'),
  star: require('../../assets/audio/star.wav'),
} as const;

type SfxName = keyof typeof SFX_ASSETS;

let loaded = false;
const sfxPool: Partial<Record<SfxName, Audio.Sound>> = {};
let preloadPromise: Promise<void> | null = null;

async function ensureLoaded() {
  if (loaded) return;
  if (preloadPromise) return preloadPromise;

  preloadPromise = (async () => {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playsInSilentModeIOS: true,
    });

    for (const key of Object.keys(SFX_ASSETS) as SfxName[]) {
      const sound = new Audio.Sound();
      await sound.loadAsync(SFX_ASSETS[key]);
      await sound.setVolumeAsync(0.8);
      sfxPool[key] = sound;
    }

    loaded = true;
  })();

  return preloadPromise;
}

async function playSfx(name: SfxName, enabled: boolean) {
  if (!enabled) return;
  await ensureLoaded();
  const sound = sfxPool[name];
  if (!sound) return;

  try {
    const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
    if (status.isLoaded) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  } catch {
    // Ignore audio errors for child-friendly resilience
  }
}

export function useSound() {
  const { state } = useGameProgress();

  useEffect(() => {
    ensureLoaded().catch(() => {});
  }, []);

  const play = useCallback(
    (name: string) => {
      const typed = name as SfxName;
      if (!(typed in SFX_ASSETS)) return;
      playSfx(typed, state.sfxEnabled).catch(() => {});
    },
    [state.sfxEnabled]
  );

  return {
    play,
    playSuccess: () => playSfx('success', state.sfxEnabled).catch(() => {}),
    playError: () => playSfx('error', state.sfxEnabled).catch(() => {}),
    playTap: () => playSfx('tap', state.sfxEnabled).catch(() => {}),
    playStar: () => playSfx('star', state.sfxEnabled).catch(() => {}),
  };
}
