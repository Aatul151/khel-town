import { Howl } from "howler";

// Track all active sound instances
let activeSounds: Howl[] = [];
// Track if TTS is currently speaking to prevent duplicates
let isTTSSpeaking = false;

/**
 * Plays audio with fallback to Web Speech API if file doesn't exist
 */
export function playPhonicsAudio(
  audioUrl: string,
  text: string,
  onEnd?: () => void
): Howl | null {
  let usedTTS = false; // Track if we've used TTS for this call

  // Try to play audio file first
  const sound = new Howl({
    src: [audioUrl],
    volume: 0.8,
    onload: () => {
      // Audio file loaded successfully, play it
      sound.play();
    },
    onloaderror: (_id, _error) => {
      // Audio file failed to load, use TTS fallback (only once)
      if (!usedTTS && !isTTSSpeaking) {
        usedTTS = true;
        console.warn(`Audio file not found: ${audioUrl}, using TTS fallback`);
        activeSounds = activeSounds.filter(s => s !== sound);
        useTextToSpeech(text, onEnd);
      }
    },
    onplayerror: (_id, _error) => {
      // Playback failed, use TTS fallback (only once)
      if (!usedTTS && !isTTSSpeaking) {
        usedTTS = true;
        console.warn(`Audio playback failed: ${audioUrl}, using TTS fallback`);
        activeSounds = activeSounds.filter(s => s !== sound);
        useTextToSpeech(text, onEnd);
      }
    },
    onend: () => {
      // Remove from active sounds when done
      activeSounds = activeSounds.filter(s => s !== sound);
      if (onEnd) onEnd();
    },
    onstop: () => {
      // Remove from active sounds when stopped
      activeSounds = activeSounds.filter(s => s !== sound);
    },
  });

  // Add to active sounds
  activeSounds.push(sound);

  // Try to load the audio with a timeout
  sound.load();

  // If audio doesn't load within 500ms, use TTS fallback
  setTimeout(() => {
    if (!sound.playing() && !usedTTS && !isTTSSpeaking) {
      sound.unload(); // Clean up the failed sound
      activeSounds = activeSounds.filter(s => s !== sound);
      usedTTS = true;
      console.warn(`Audio load timeout: ${audioUrl}, using TTS fallback`);
      useTextToSpeech(text, onEnd);
    }
  }, 500);

  return sound;
}

/**
 * Fallback: Use Web Speech API for text-to-speech
 */
function useTextToSpeech(text: string, onEnd?: () => void) {
  // Prevent duplicate TTS calls
  if (isTTSSpeaking) {
    return;
  }

  if ("speechSynthesis" in window) {
    isTTSSpeaking = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.volume = 0.8;

    utterance.onend = () => {
      isTTSSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (error) => {
      isTTSSpeaking = false;
      console.error("Speech synthesis error:", error);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech synthesis not supported");
    if (onEnd) onEnd();
  }
}

/**
 * Stop all audio playback (except background music)
 */
export function stopAllAudio() {
  // Stop all active Howler sounds (but not background music)
  activeSounds.forEach(sound => {
    if (sound.playing() && sound !== backgroundMusic) {
      sound.stop();
    }
  });
  activeSounds = activeSounds.filter(s => s === backgroundMusic); // Keep background music in the list

  // Stop speech synthesis
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    isTTSSpeaking = false;
  }

  // Stop walking sound
  stopWalkingSound();
  stopBackgroundMusic()
}

// Walking sound effect
let walkingSound: Howl | null = null;
let walkingSoundInterval: number | null = null;

export function playWalkingSound() {
  // Create a subtle walking sound effect
  // Using a simple approach with Web Audio API for a step sound
  if (walkingSoundInterval) return; // Already playing

  // Create a simple step sound pattern
  walkingSoundInterval = window.setInterval(() => {
    // Create a short beep/tone for walking steps
    if ("AudioContext" in window || "webkitAudioContext" in window) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 200; // Low frequency for step sound
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.7, audioContext.currentTime); // Very quiet
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  }, 300); // Step sound every 300ms
}

export function stopWalkingSound() {
  if (walkingSoundInterval) {
    clearInterval(walkingSoundInterval);
    walkingSoundInterval = null;
  }
  if (walkingSound && walkingSound.playing()) {
    walkingSound.stop();
  }
}

// Background music
let backgroundMusic: Howl | null = null;

/**
 * Available background music files
 */
const BACKGROUND_MUSIC_FILES = [
  "/audio/bgmusic_1.mp3",
  "/audio/bgmusic_2.mp3",
];

/**
 * Play background music (looping)
 * Randomly selects one of the available MP3 files from the audio folder
 */
export function playBackgroundMusic() {
  // Stop existing background music if playing
  if (backgroundMusic && backgroundMusic.playing()) {
    backgroundMusic.stop();
    activeSounds = activeSounds.filter(s => s !== backgroundMusic);
  }

  // Randomly select one of the music files
  const selectedMusicUrl = BACKGROUND_MUSIC_FILES[Math.floor(Math.random() * BACKGROUND_MUSIC_FILES.length)];

  console.log("Loading background music:", selectedMusicUrl);

  // Create and play the background music
  backgroundMusic = new Howl({
    src: [selectedMusicUrl],
    volume: 0.3, // Lower volume so it doesn't overpower other sounds
    loop: true, // Loop the music
    autoplay: true,
    preload: true,
    onload: () => {
      console.log("Background music loaded successfully:", selectedMusicUrl);
    },
    onloaderror: (_id, error) => {
      console.error("Background music file not found or failed to load:", selectedMusicUrl, error);
      activeSounds = activeSounds.filter(s => s !== backgroundMusic);
    },
    onplayerror: (_id, error) => {
      console.error("Background music playback failed:", selectedMusicUrl, error);
      activeSounds = activeSounds.filter(s => s !== backgroundMusic);
    },
    onplay: () => {
      console.log("Background music playing:", selectedMusicUrl);
    },
  });

  // Add to active sounds for tracking
  activeSounds.push(backgroundMusic);

  // Try to load and play
  backgroundMusic.load();
}

/**
 * Stop background music
 */
export function stopBackgroundMusic() {

  if (backgroundMusic) {
    backgroundMusic.stop();
    backgroundMusic.unload(); // Free memory
  }

  // Remove from active sounds
  activeSounds = activeSounds.filter(s => s !== backgroundMusic);
  backgroundMusic = null;
}

/**
 * Set background music volume (0.0 to 1.0)
 */
export function setBackgroundMusicVolume(volume: number) {
  if (backgroundMusic) {
    backgroundMusic.volume(Math.max(0, Math.min(1, volume)));
  }
}


