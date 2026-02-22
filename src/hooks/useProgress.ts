import { useGameProgress, ModuleId } from '../context/GameProgressContext';

export function useProgress(moduleId: ModuleId) {
  const { state, dispatch } = useGameProgress();
  const module = state.modules[moduleId];

  const completeLevel = (levelId: string, stars: number) => {
    dispatch({ type: 'COMPLETE_LEVEL', module: moduleId, levelId, stars });
  };

  const isCompleted = (levelId: string) => module.completedLevels.includes(levelId);
  const getStars = (levelId: string) => module.bestStars[levelId] || 0;

  return {
    totalStars: state.totalStars,
    completedLevels: module.completedLevels,
    bestStars: module.bestStars,
    completeLevel,
    isCompleted,
    getStars,
  };
}
