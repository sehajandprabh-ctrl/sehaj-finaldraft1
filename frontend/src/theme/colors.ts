// Premium Romantic Theme Colors

export const darkColors = {
  // Backgrounds
  background: '#0D0D12',
  backgroundSecondary: '#14141B',
  card: '#1A1A24',
  cardHover: '#222230',
  
  // Primary Accents - Soft Rose Pink
  primary: '#E8638F',
  primaryLight: '#F4A5BD',
  primaryDark: '#C74B78',
  primaryGlow: 'rgba(232, 99, 143, 0.3)',
  
  // Secondary Accents - Soft Lavender
  secondary: '#A78BFA',
  secondaryLight: '#C4B5FD',
  secondaryDark: '#8B5CF6',
  secondaryGlow: 'rgba(167, 139, 250, 0.25)',
  
  // Tertiary - Warm Blush/Peach
  tertiary: '#F4A5BD',
  tertiaryLight: '#FFD0E0',
  tertiaryDark: '#E8899E',
  
  // Text Colors
  textPrimary: '#F0EBF4',
  textSecondary: '#9B9BAE',
  textMuted: '#6B6B7B',
  textAccent: '#E8638F',
  textLavender: '#A78BFA',
  
  // UI Elements
  border: '#2A2A38',
  borderLight: '#3A3A4A',
  divider: '#252530',
  
  // Gradients
  gradientPrimary: ['#E8638F', '#A78BFA'],
  gradientSecondary: ['#C74B78', '#8B5CF6'],
  gradientBackground: ['#0D0D12', '#14141B', '#0D0D12'],
  
  // Status
  success: '#4ADE80',
  successGlow: 'rgba(74, 222, 128, 0.2)',
  error: '#F87171',
  warning: '#FBBF24',
  
  // Special
  overlay: 'rgba(13, 13, 18, 0.85)',
  glass: 'rgba(26, 26, 36, 0.8)',
  shimmer: 'rgba(255, 255, 255, 0.05)',
};

export const lightColors = {
  // Backgrounds
  background: '#FFF8F5',
  backgroundSecondary: '#FFF0EB',
  card: '#FFFFFF',
  cardHover: '#FFF5F2',
  
  // Primary Accents - Soft Rose Pink
  primary: '#E8638F',
  primaryLight: '#F4A5BD',
  primaryDark: '#C74B78',
  primaryGlow: 'rgba(232, 99, 143, 0.15)',
  
  // Secondary Accents - Soft Lavender
  secondary: '#8B5CF6',
  secondaryLight: '#A78BFA',
  secondaryDark: '#7C3AED',
  secondaryGlow: 'rgba(139, 92, 246, 0.12)',
  
  // Tertiary - Warm Blush/Peach
  tertiary: '#F4A5BD',
  tertiaryLight: '#FFD0E0',
  tertiaryDark: '#E8899E',
  
  // Text Colors
  textPrimary: '#2D1F36',
  textSecondary: '#5A4A64',
  textMuted: '#8A7A94',
  textAccent: '#E8638F',
  textLavender: '#8B5CF6',
  
  // UI Elements
  border: '#F0E0E8',
  borderLight: '#FFE0EB',
  divider: '#F5E5ED',
  
  // Gradients
  gradientPrimary: ['#E8638F', '#A78BFA'],
  gradientSecondary: ['#F4A5BD', '#C4B5FD'],
  gradientBackground: ['#FFF8F5', '#FFF0EB', '#FFF8F5'],
  
  // Status
  success: '#22C55E',
  successGlow: 'rgba(34, 197, 94, 0.15)',
  error: '#EF4444',
  warning: '#F59E0B',
  
  // Special
  overlay: 'rgba(45, 31, 54, 0.6)',
  glass: 'rgba(255, 255, 255, 0.9)',
  shimmer: 'rgba(0, 0, 0, 0.02)',
};

export type ThemeColors = typeof darkColors;

export const getTheme = (isDark: boolean): ThemeColors => {
  return isDark ? darkColors : lightColors;
};
