/**
 * Audio Service - TTS and audio playback for voice guide
 * Uses expo-speech for TTS (with Gemini Live planned for future)
 */

import * as Speech from 'expo-speech';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { Platform } from 'react-native';

/**
 * TTS Configuration
 */
const TTS_CONFIG = {
  language: 'pl-PL', // Polish
  pitch: 1.0,
  rate: Platform.OS === 'ios' ? 0.5 : 0.9, // iOS speaks slower
};

/**
 * Audio session initialized flag
 */
let isAudioSessionInitialized = false;

/**
 * Current speech callback
 */
let currentOnDoneCallback: (() => void) | null = null;

/**
 * Initialize audio session
 * Call this before any audio/speech operations
 */
export async function initAudioSession(): Promise<boolean> {
  if (isAudioSessionInitialized) return true;

  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true, // Enable recording for PTT
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    isAudioSessionInitialized = true;
    console.log('Audio session initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize audio session:', error);
    return false;
  }
}

/**
 * Get available TTS voices for Polish
 */
export async function getPolishVoices(): Promise<Speech.Voice[]> {
  const voices = await Speech.getAvailableVoicesAsync();
  return voices.filter((v: Speech.Voice) => v.language.startsWith('pl'));
}

/**
 * Play text-to-speech
 * @param text Text to speak
 * @param onStart Callback when speech starts
 * @param onDone Callback when speech completes
 * @param onError Callback on error
 */
export function playTTS(
  text: string,
  options?: {
    onStart?: () => void;
    onDone?: () => void;
    onError?: (error: Error) => void;
    rate?: number;
  }
): void {
  // Ensure audio session is ready
  if (!isAudioSessionInitialized) {
    initAudioSession().catch(console.error);
  }

  // Stop any current speech
  stopTTS();

  // Store done callback
  currentOnDoneCallback = options?.onDone || null;

  // Speak
  Speech.speak(text, {
    language: TTS_CONFIG.language,
    pitch: TTS_CONFIG.pitch,
    rate: options?.rate ?? TTS_CONFIG.rate,
    onStart: options?.onStart,
    onDone: () => {
      currentOnDoneCallback = null;
      options?.onDone?.();
    },
    onError: (error: { message: string }) => {
      currentOnDoneCallback = null;
      console.error('TTS error:', error);
      options?.onError?.(new Error(error.message));
    },
    onStopped: () => {
      currentOnDoneCallback = null;
      // Don't call onDone when stopped manually
    },
  });
}

/**
 * Stop current TTS playback
 */
export function stopTTS(): void {
  Speech.stop();
  currentOnDoneCallback = null;
}

/**
 * Check if TTS is currently speaking
 */
export async function isSpeaking(): Promise<boolean> {
  return await Speech.isSpeakingAsync();
}

/**
 * Pause TTS (iOS only)
 */
export function pauseTTS(): void {
  if (Platform.OS === 'ios') {
    Speech.pause();
  }
}

/**
 * Resume TTS (iOS only)
 */
export function resumeTTS(): void {
  if (Platform.OS === 'ios') {
    Speech.resume();
  }
}

/**
 * Speak guide note for a place
 * Wrapper that handles the full flow
 */
export function speakGuideNote(
  guideNoteAudio: string,
  callbacks?: {
    onStart?: () => void;
    onDone?: () => void;
    onError?: (error: Error) => void;
  }
): void {
  if (!guideNoteAudio || guideNoteAudio.trim().length === 0) {
    callbacks?.onError?.(new Error('Empty guide note'));
    return;
  }

  playTTS(guideNoteAudio, {
    onStart: () => {
      console.log('Speaking guide note...');
      callbacks?.onStart?.();
    },
    onDone: () => {
      console.log('Guide note complete');
      callbacks?.onDone?.();
    },
    onError: (error) => {
      console.error('Guide note error:', error);
      callbacks?.onError?.(error);
    },
  });
}

/**
 * Stop all audio (TTS and any other)
 */
export function stopAllAudio(): void {
  stopTTS();
  // Future: stop Gemini Live stream here
}

/**
 * Clean up audio resources
 * Call when guide session ends
 */
export async function cleanupAudio(): Promise<void> {
  stopAllAudio();
  // Future: cleanup Gemini Live connection
}

