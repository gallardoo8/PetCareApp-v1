// src/styles/colors.js
export const colors = {
  // Colores principales
  primary: '#4ECDC4',
  primaryDark: '#3AAFA9',
  primaryLight: '#6FE7DD',
  
  // Colores secundarios
  secondary: '#FF6B6B',
  secondaryDark: '#EE5A52',
  secondaryLight: '#FF8787',
  
  // Colores neutros
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Textos
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  textTertiary: '#BDC3C7',
  
  // Estados
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadowColor: '#000000',
  
  // Bordes
  border: '#E1E8ED',
  divider: '#ECF0F1',
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