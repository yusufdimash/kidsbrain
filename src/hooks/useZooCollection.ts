import { useGameProgress } from '../context/GameProgressContext';

export function useZooCollection() {
  const { state, dispatch } = useGameProgress();

  const addAnimal = (animalId: string) => {
    dispatch({ type: 'ADD_ZOO_ANIMAL', animalId });
  };

  const hasAnimal = (animalId: string) => state.zooCollection.includes(animalId);

  return {
    collection: state.zooCollection,
    addAnimal,
    hasAnimal,
    count: state.zooCollection.length,
  };
}
