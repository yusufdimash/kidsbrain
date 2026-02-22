export const COLORS = {
  // Pastel palette
  pink: '#FFB5C2',
  blue: '#B5D8FF',
  green: '#B5FFD8',
  yellow: '#FFF5B5',
  purple: '#D8B5FF',
  orange: '#FFD8B5',
  red: '#FFB5B5',
  teal: '#B5FFE8',

  // UI colors
  background: '#FFF8F0',
  card: '#FFFFFF',
  text: '#4A3728',
  textLight: '#8B7355',
  textWhite: '#FFFFFF',
  star: '#FFD700',
  starEmpty: '#E0D5C5',
  success: '#6BCB77',
  error: '#FF6B6B',
  overlay: 'rgba(0,0,0,0.4)',

  // Module colors
  letterLand: '#FFB5C2',
  numberJungle: '#5EAA8D',
  shapeSafari: '#5B9BD5',
  colorWorld: '#D8B5FF',
  memoryMagic: '#FFF5B5',
  patternGame: '#FFD8B5',
  tracingFun: '#B5FFE8',
};

export const FONTS = {
  bold: 'SpaceMono-Regular', // We'll use system fonts with weight
  regular: 'SpaceMono-Regular',
  // Will use system font fallback
  heading: 'System',
  body: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
