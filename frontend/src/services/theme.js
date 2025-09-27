// Theme constants for the JobKhoj application
export const colors = {
  // Primary colors
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  primaryGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  primaryHover: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
  
  // Secondary colors
  secondary: '#6366f1',
  secondaryLight: '#818cf8',
  secondaryDark: '#4f46e5',
  
  // Success colors
  success: '#10b981',
  successLight: '#34d399',
  successDark: '#059669',
  
  // Warning colors
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningDark: '#d97706',
  
  // Danger colors
  danger: '#ef4444',
  dangerLight: '#f87171',
  dangerDark: '#dc2626',
  
  // Text colors
  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textTertiary: '#6b7280',
  textLight: '#9ca3af',
  textLightMuted: '#d1d5db',
  
  // Background colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f9fafb',
  bgTertiary: '#f3f4f6',
  bgDark: '#1f2937',
  
  // Border colors
  borderLight: '#e5e7eb',
  borderMedium: '#d1d5db',
  borderDark: '#9ca3af',
  
  // Glassmorphism effect
  glassBg: 'rgba(255, 255, 255, 0.8)',
  glassBgDark: 'rgba(31, 41, 55, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
  glassShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  
  // Neumorphism effect
  neuBg: '#f0f0f3',
  neuShadowLight: '6px 6px 12px rgba(163, 177, 198, 0.6)',
  neuShadowDark: '-6px -6px 12px rgba(255, 255, 255, 0.8)',
};

export const COLORS = colors;

export const typography = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    md: '1.125rem', // 18px
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    '2xl': '1.875rem', // 30px
    '3xl': '2.25rem', // 36px
    '4xl': '3rem', // 48px
  },
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },
  headings: {
    h1: '3rem', // 48px
    h2: '2.25rem', // 36px
    h3: '1.875rem', // 30px
    h4: '1.5rem', // 24px
    h5: '1.25rem', // 20px
    h6: '1.125rem', // 18px
  },
  sizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
  },
};

export const TYPOGRAPHY = typography;

export const spacing = {
  px: '1px',
  '0': '0px',
  '1': '0.25rem', // 4px
  '2': '0.5rem', // 8px
  '3': '0.75rem', // 12px
  '4': '1rem', // 16px
  '5': '1.25rem', // 20px
  '6': '1.5rem', // 24px
  '8': '2rem', // 32px
  '10': '2.5rem', // 40px
  '12': '3rem', // 48px
  '16': '4rem', // 64px
  '20': '5rem', // 80px
  '24': '6rem', // 96px
  '32': '8rem', // 128px
  xxs: '0.25rem',
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem',
  xxl: '4rem',
};

export const SPACING = spacing;

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
};

export const BORDER_RADIUS = borderRadius;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  hover: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
  active: '0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
};

export const SHADOWS = shadows; 

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const BREAKPOINTS = breakpoints;

export const transitions = {
  fast: '0.15s ease-in-out',
  normal: '0.25s ease-in-out',
  slow: '0.5s ease-in-out',
  duration: {
    '75': '75ms',
    '100': '100ms',
    '150': '150ms',
    '200': '200ms',
    '300': '300ms',
    '500': '500ms',
  },
  property: {
    color: 'color 0.25s ease-in-out',
    bg: 'background-color 0.25s ease-in-out',
    border: 'border-color 0.25s ease-in-out',
    transform: 'transform 0.25s ease-in-out',
    opacity: 'opacity 0.25s ease-in-out',
    boxShadow: 'box-shadow 0.25s ease-in-out',
    all: 'all 0.25s ease-in-out',
  },
};

export const TRANSITIONS = transitions;

export const zIndex = {
  auto: 'auto',
  '0': 0,
  '10': 10,
  '20': 20,
  '30': 30,
  '40': 40,
  '50': 50,
  '100': 100,
  toast: 5000,
  modal: 10000,
  dropdown: 1000,
  sticky: 100,
  fixed: 200,
};

export const Z_INDEX = zIndex;

// Export the complete theme
const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  transitions,
  zIndex,
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  BREAKPOINTS,
  TRANSITIONS,
  Z_INDEX,
};

export default theme;