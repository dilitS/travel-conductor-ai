/**
 * TravelAI Guide - Spacing & Layout
 * 8pt grid system
 */

export const spacing = {
  // 8pt grid scale
  0: 0,
  0.5: 2,  // 2px - tiny
  1: 4,    // 4px - quarter
  1.5: 6,  // 6px
  2: 8,    // 8px - base unit
  3: 12,   // 12px
  4: 16,   // 16px - standard padding
  5: 20,   // 20px
  6: 24,   // 24px
  8: 32,   // 32px
  10: 40,  // 40px
  12: 48,  // 48px - touch target size
  16: 64,  // 64px
  20: 80,  // 80px
  24: 96,  // 96px
  32: 128, // 128px
} as const;

export const layout = {
  // Screen padding
  screenPadding: spacing[4],
  
  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  // Icon sizes
  icon: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  
  // Header height
  headerHeight: 60,
  
  // Tab bar height
  tabBarHeight: 80,
} as const;

