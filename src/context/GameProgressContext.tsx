import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@kidsbrain_progress';

export type ModuleId =
  | 'letterLand'
  | 'numberJungle'
  | 'shapeSafari'
  | 'colorWorld'
  | 'memoryMagic'
  | 'patternGame'
  | 'tracingFun';

export interface ModuleProgress {
  completedLevels: string[];
  bestStars: Record<string, number>; // levelId -> star count (1-3)
}

export interface GameState {
  totalStars: number;
  modules: Record<ModuleId, ModuleProgress>;
  zooCollection: string[]; // animal IDs collected
  soundEnabled: boolean;
  loaded: boolean;
}

const defaultModuleProgress: ModuleProgress = {
  completedLevels: [],
  bestStars: {},
};

const initialState: GameState = {
  totalStars: 0,
  modules: {
    letterLand: { ...defaultModuleProgress },
    numberJungle: { ...defaultModuleProgress },
    shapeSafari: { ...defaultModuleProgress },
    colorWorld: { ...defaultModuleProgress },
    memoryMagic: { ...defaultModuleProgress },
    patternGame: { ...defaultModuleProgress },
    tracingFun: { ...defaultModuleProgress },
  },
  zooCollection: [],
  soundEnabled: true,
  loaded: false,
};

type Action =
  | { type: 'LOAD'; payload: Partial<GameState> }
  | { type: 'COMPLETE_LEVEL'; module: ModuleId; levelId: string; stars: number }
  | { type: 'ADD_ZOO_ANIMAL'; animalId: string }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'RESET' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload, loaded: true };

    case 'COMPLETE_LEVEL': {
      const mod = state.modules[action.module];
      const prevBest = mod.bestStars[action.levelId] || 0;
      const newStars = Math.max(prevBest, action.stars);
      const starDiff = newStars - prevBest;

      const completedLevels = mod.completedLevels.includes(action.levelId)
        ? mod.completedLevels
        : [...mod.completedLevels, action.levelId];

      return {
        ...state,
        totalStars: state.totalStars + starDiff,
        modules: {
          ...state.modules,
          [action.module]: {
            completedLevels,
            bestStars: { ...mod.bestStars, [action.levelId]: newStars },
          },
        },
      };
    }

    case 'ADD_ZOO_ANIMAL':
      if (state.zooCollection.includes(action.animalId)) return state;
      return {
        ...state,
        zooCollection: [...state.zooCollection, action.animalId],
      };

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'RESET':
      return { ...initialState, loaded: true };

    default:
      return state;
  }
}

interface GameProgressContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
}

const GameProgressContext = createContext<GameProgressContextType>({
  state: initialState,
  dispatch: () => {},
});

export function GameProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const saved = JSON.parse(json);
          dispatch({ type: 'LOAD', payload: saved });
        } else {
          dispatch({ type: 'LOAD', payload: {} });
        }
      } catch {
        dispatch({ type: 'LOAD', payload: {} });
      }
    })();
  }, []);

  // Save to AsyncStorage on state change
  useEffect(() => {
    if (!state.loaded) return;
    const { loaded, ...toSave } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)).catch(() => {});
  }, [state]);

  return (
    <GameProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </GameProgressContext.Provider>
  );
}

export function useGameProgress() {
  return useContext(GameProgressContext);
}
