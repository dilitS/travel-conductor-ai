/**
 * TravelAI Guide - Typography
 * System fonts usage with strict presets
 */

import { TextStyle } from 'react-native';

// Define styles first so they can be used in the object
const styles = {
  h1: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 36, // 30 * 1.2
    color: '#FFFFFF',
  } as TextStyle,
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29, // 24 * 1.2
    color: '#FFFFFF',
  } as TextStyle,
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 24, // 20 * 1.2
    color: '#FFFFFF',
  } as TextStyle,
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24, // 18 * 1.3 approx
    color: '#FFFFFF',
  } as TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24, // 16 * 1.5
    color: '#FFFFFF',
  } as TextStyle,
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21, // 14 * 1.5
    color: '#A0AEC0', // Secondary color by default for small body
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17, // 12 * 1.4 approx
    color: '#718096', // Tertiary color by default for caption
  } as TextStyle,
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    color: '#FFFFFF',
  } as TextStyle,
  label: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 15,
    color: '#A0AEC0',
  } as TextStyle,
};

export const typography = {
  fontFamily: {
    // System fonts - native for each platform
    // Using System font stack ensures good performance and native feel
    sans: 'System', 
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,    // Headings
    normal: 1.5,   // Body
    relaxed: 1.75, // Long text
  },
  styles, // Include styles in the main object
} as const;

// Also export styles separately if needed
export const typographyStyles = styles;
