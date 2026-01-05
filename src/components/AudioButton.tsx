import { useRef, useState } from "react";
import { playPhonicsAudio, stopAllAudio } from "../utils/audio";

interface AudioButtonProps {
  audioUrl: string;
  text?: string;
  label?: string;
  className?: string;
}

export function AudioButton({ audioUrl, text, label, className = "" }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef<any>(null);

  const playSound = () => {
    // Stop previous sound if playing
    stopAllAudio();
    if (soundRef.current) {
      if (soundRef.current.stop) {
        soundRef.current.stop();
      }
    }

    setIsPlaying(true);

    // Use the audio utility with TTS fallback
    const textToSpeak = text || "Play sound";
    soundRef.current = playPhonicsAudio(audioUrl, textToSpeak, () => {
      setIsPlaying(false);
    });
  };

  return (
    <button
      onClick={playSound}
      disabled={isPlaying}
      className={`
        flex items-center justify-center gap-2
        px-6 py-4 rounded-full
        bg-primary-400 hover:bg-primary-500
        text-white font-bold text-lg
        shadow-lg hover:shadow-xl
        transition-all duration-200
        disabled:opacity-70 disabled:cursor-not-allowed
        active:scale-95
        ${className}
      `}
      aria-label={label || "Play sound"}
    >
      <svg
        className={`w-6 h-6 ${isPlaying ? "animate-pulse" : ""}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        {isPlaying ? (
          <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM11 8a1 1 0 112 0v4a1 1 0 11-2 0V8z" />
        ) : (
          <path
            fillRule="evenodd"
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.617a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
            clipRule="evenodd"
          />
        )}
      </svg>
      {label && <span>{label}</span>}
    </button>
  );
}

