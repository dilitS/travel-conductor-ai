/**
 * Recording Service - Voice recording for PTT (Push-to-Talk)
 * Uses expo-av for recording audio
 */

import { Audio } from 'expo-av';

/**
 * Recording state
 */
let currentRecording: Audio.Recording | null = null;
let isRecordingActive = false;

/**
 * Recording configuration - high quality for voice
 */
const RECORDING_OPTIONS = Audio.RecordingOptionsPresets.HIGH_QUALITY;

/**
 * Request microphone permission
 * @returns true if permission granted
 */
export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to request microphone permission:', error);
    return false;
  }
}

/**
 * Check if microphone permission is granted
 * @returns true if permission granted
 */
export async function hasMicrophonePermission(): Promise<boolean> {
  try {
    const { status } = await Audio.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Failed to check microphone permission:', error);
    return false;
  }
}

/**
 * Start recording audio
 * @returns true if recording started successfully
 */
export async function startRecording(): Promise<boolean> {
  try {
    // Check permission first
    const hasPermission = await hasMicrophonePermission();
    if (!hasPermission) {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        console.warn('Microphone permission not granted');
        return false;
      }
    }

    // Stop any existing recording
    if (currentRecording) {
      await stopRecording();
    }

    // Configure audio mode for recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });

    // Create and start recording
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(RECORDING_OPTIONS);
    await recording.startAsync();

    currentRecording = recording;
    isRecordingActive = true;

    console.log('Recording started');
    return true;
  } catch (error) {
    console.error('Failed to start recording:', error);
    isRecordingActive = false;
    currentRecording = null;
    return false;
  }
}

/**
 * Stop recording and get the audio file URI
 * @returns URI of the recorded file, or null if failed
 */
export async function stopRecording(): Promise<string | null> {
  if (!currentRecording) {
    console.warn('No active recording to stop');
    return null;
  }

  try {
    await currentRecording.stopAndUnloadAsync();
    
    // Reset audio mode for playback
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

    const uri = currentRecording.getURI();
    console.log('Recording stopped, URI:', uri);

    currentRecording = null;
    isRecordingActive = false;

    return uri;
  } catch (error) {
    console.error('Failed to stop recording:', error);
    currentRecording = null;
    isRecordingActive = false;
    return null;
  }
}

/**
 * Cancel recording without saving
 */
export async function cancelRecording(): Promise<void> {
  if (!currentRecording) {
    return;
  }

  try {
    await currentRecording.stopAndUnloadAsync();
    
    // Reset audio mode
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
  } catch (error) {
    console.error('Failed to cancel recording:', error);
  } finally {
    currentRecording = null;
    isRecordingActive = false;
  }
}

/**
 * Check if currently recording
 * @returns true if recording is active
 */
export function isRecording(): boolean {
  return isRecordingActive;
}

/**
 * Get recording duration in milliseconds (if recording)
 * @returns duration in ms, or 0 if not recording
 */
export async function getRecordingDuration(): Promise<number> {
  if (!currentRecording) {
    return 0;
  }

  try {
    const status = await currentRecording.getStatusAsync();
    if (status.isRecording) {
      return status.durationMillis;
    }
    return 0;
  } catch (error) {
    console.error('Failed to get recording duration:', error);
    return 0;
  }
}

/**
 * Clean up recording resources
 * Call when component unmounts
 */
export async function cleanupRecording(): Promise<void> {
  await cancelRecording();
}

