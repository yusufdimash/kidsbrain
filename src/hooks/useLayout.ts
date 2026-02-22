import { useWindowDimensions } from 'react-native';
import { BASE_WIDTH, BREAKPOINTS } from '../constants/layout';

export function useLayout() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= BREAKPOINTS.tablet;
  const isLandscape = width > height;
  const scale = Math.min(width / BASE_WIDTH, 1.5);

  return {
    width,
    height,
    isTablet,
    isLandscape,
    scale,
  };
}
