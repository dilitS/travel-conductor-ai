import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Trigger a light haptic feedback
 * Suitable for: selection changes, small interactions
 */
export const hapticSelection = async () => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    // Ignore haptics error
  }
};

/**
 * Trigger a medium haptic feedback (impact)
 * Suitable for: button presses, toggles
 */
export const hapticImpactLight = async () => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Ignore
  }
};

/**
 * Trigger a heavy haptic feedback
 * Suitable for: success actions, major changes
 */
export const hapticImpactMedium = async () => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    // Ignore
  }
};

/**
 * Trigger notification feedback
 */
export const hapticNotification = async (type: Haptics.NotificationFeedbackType) => {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(type);
  } catch (error) {
    // Ignore
  }
};

