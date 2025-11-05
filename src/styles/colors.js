// src/styles/colors.js
export const colors = {
  // Colores principales - Turquesa (del logo)
  primary: '#4ECDC4',
  primaryDark: '#3AB5AC',
  primaryLight: '#95E1D3',
  
  // Colores secundarios - Coral/Naranja
  secondary: '#FF6B6B',
  secondaryDark: '#E85A5A',
  secondaryLight: '#FF9999',
  
  // Colores de acento - Verde menta
  accent: '#95E1D3',
  accentDark: '#7DCFC1',
  accentLight: '#B8EEDF',
  
  // Colores neutros
  background: '#F7F9FB',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Textos
  textPrimary: '#2C3E50',
  textSecondary: '#34495E',
  textTertiary: '#95A5A6',
  textLight: '#ECF0F1',
  
  // Estados
  success: '#4ECDC4',
  warning: '#FFB84D',
  error: '#FF6B6B',
  info: '#6EC4E8',
  
  // Overlay
  overlay: 'rgba(44, 62, 80, 0.5)',
  overlayLight: 'rgba(78, 205, 196, 0.1)',
  shadowColor: '#2C3E50',
  
  // Bordes
  border: '#D5E5E8',
  divider: '#E8F4F3',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};