// Color palette - Basado en el logo de PetCare
export const COLORS = {
  // Primary colors - Turquesa
  primary: '#4ECDC4',
  primaryLight: '#95E1D3',
  primaryDark: '#3AB5AC',
  
  // Secondary colors - Coral/Naranja
  secondary: '#FF6B6B',
  secondaryLight: '#FF9999',
  secondaryDark: '#E85A5A',
  
  // Neutral colors
  background: '#F7F9FB',
  surface: '#ffffff',
  surfaceSecondary: '#F0F8F7',
  
  // Text colors
  textPrimary: '#2C3E50',
  textSecondary: '#34495E',
  textTertiary: '#95A5A6',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#ffffff',
  
  // Status colors
  success: '#4ECDC4',
  warning: '#FFB84D',
  error: '#FF6B6B',
  info: '#6EC4E8',
  
  // Additional colors
  accent: '#95E1D3',
  divider: '#E8F4F3',
  shadow: '#2C3E50',
  
  // Gray scale
  gray50: '#F7F9FB',
  gray100: '#F0F8F7',
  gray200: '#E8F4F3',
  gray300: '#D5E5E8',
  gray400: '#B8CDD0',
  gray500: '#95A5A6',
  gray600: '#7F8C8D',
  gray700: '#34495E',
  gray800: '#2C3E50',
  gray900: '#1A252F',
};

// Spacing system
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius system
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};

// Typography
export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    display: 32,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Shadow styles
export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Button styles
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.primary,
    color: COLORS.textOnPrimary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    color: COLORS.textOnSecondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    color: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: COLORS.primary,
  },
};

// Common component styles
export const COMMON_STYLES = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
  },
  
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  
  text: {
    color: COLORS.textPrimary,
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: TYPOGRAPHY.lineHeight.normal * TYPOGRAPHY.fontSize.md,
  },
};

// Export default theme object
export default {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
  SHADOWS,
  BUTTON_STYLES,
  COMMON_STYLES,
};