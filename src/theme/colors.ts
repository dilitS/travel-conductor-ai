/**
 * TravelAI Guide - Color Palette
 * Design System based on Vivid Dark aesthetic
 */

export const colors = {
  background: {
    primary: '#0F1115',      // Deep graphite - Main background
    secondary: '#1C1E24',     // Lighter graphite - Cards, surfaces
    tertiary: '#27272A',      // Subtle elements
    input: '#18181B',         // Input fields
  },
  text: {
    primary: '#FFFFFF',       // Main text
    secondary: '#9CA3AF',     // Grey-400 - Descriptions
    tertiary: '#6B7280',      // Grey-500 - Disabled
    muted: '#4B5563',         // Grey-600 - Subtle
  },
  accent: {
    primary: '#4ADE80',       // Green-400 - Main accent color
    light: '#86EFAC',         // Green-300 - Hover states
    dark: '#22C55E',          // Green-500 - Pressed states
    pale: '#14532D',          // Green-900 - Dark accents
  },
  green: {
    primary: '#4ADE80',       // Green-400 - Vivid Lime/Green
    light: '#86EFAC',         // Green-300 - Hover
    dark: '#22C55E',          // Green-500 - Pressed
    pale: '#14532D',          // Green-900 - Dark accents
    soft: 'rgba(74, 222, 128, 0.15)', // Soft green bg
  },
  blue: {
    primary: '#3B82F6',       // Blue-500 - Vivid Blue
    light: '#60A5FA',         // Blue-400
    dark: '#2563EB',          // Blue-600
    soft: 'rgba(59, 130, 246, 0.15)',
  },
  border: {
    default: 'rgba(255, 255, 255, 0.1)', // Subtle border
    green: '#4ADE80',         // Green border
    blue: '#3B82F6',          // Blue border
  },
  status: {
    inProgress: '#4ADE80',    // Green
    upcoming: '#60A5FA',      // Blue (changed from grey for better vibe)
    completed: '#374151',     // Dark grey
  },
  semantic: {
    error: '#EF4444',         // Red-500
    warning: '#F59E0B',       // Amber-500
    info: '#3B82F6',          // Blue-500
    success: '#4ADE80',       // Green-400
  },
  overlay: {
    dark: 'rgba(0, 0, 0, 0.8)',
    gradient: ['transparent', '#0F1115'],
  },
  // Activity colors for step types
  activity: {
    visit: '#4ADE80',        // Green - zwiedzanie
    meal: '#F59E0B',         // Amber - jedzenie
    transfer: '#3B82F6',     // Blue - transport
    accommodation: '#A855F7', // Purple - nocleg
    relax: '#06B6D4',        // Cyan - odpoczynek
  },
  // Soft backgrounds for activity cards
  activitySoft: {
    visit: 'rgba(74, 222, 128, 0.15)',
    meal: 'rgba(245, 158, 11, 0.15)',
    transfer: 'rgba(59, 130, 246, 0.15)',
    accommodation: 'rgba(168, 85, 247, 0.15)',
    relax: 'rgba(6, 182, 212, 0.15)',
  },
} as const;

// Helper function to get activity color by step type
export type ActivityType = 'visit' | 'meal' | 'transfer' | 'accommodation' | 'relax';

export function getActivityColor(type: ActivityType): string {
  return colors.activity[type] || colors.green.primary;
}

export function getActivitySoftColor(type: ActivityType): string {
  return colors.activitySoft[type] || colors.green.soft;
}

// Gradients definitions for expo-linear-gradient
export const gradients = {
  primary: {
    colors: ['#4ADE80', '#22C55E'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  blue: {
    colors: ['#3B82F6', '#2563EB'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  background: {
    colors: ['#0F1115', '#09090B'] as const,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  card: {
    colors: ['#1C1E24', '#18181B'] as const,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  overlay: {
    colors: ['transparent', 'rgba(15, 17, 21, 0.95)'] as const,
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
  shimmer: {
    colors: ['transparent', 'rgba(255,255,255,0.05)', 'transparent'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
} as const;
