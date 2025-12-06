/**
 * Services barrel export
 */

// Firebase
export * from './firebase';

// Location
export {
  requestLocationPermissions,
  hasLocationPermissions,
  getCurrentPosition,
  startLocationTracking,
  stopLocationTracking,
  isTrackingActive,
  isLocationServicesEnabled,
  calculateDistance,
} from './locationService';

// Audio
export {
  initAudioSession,
  getPolishVoices,
  playTTS,
  stopTTS,
  isSpeaking,
  pauseTTS,
  resumeTTS,
  speakGuideNote,
  stopAllAudio,
  cleanupAudio,
} from './audioService';

// Recording (PTT)
export {
  requestMicrophonePermission,
  hasMicrophonePermission,
  startRecording,
  stopRecording,
  cancelRecording,
  isRecording,
  getRecordingDuration,
  cleanupRecording,
} from './recordingService';

