import { AudioButton } from "../components/AudioButton";
import { LearningItem, LearningMode } from "../data/types";

interface HUDProps {
  stars: number;
  currentItem: LearningItem | null;
  onRepeat: () => void;
  progress: number;
  totalItems: number;
  mode: LearningMode;
}

export function HUD({ stars, currentItem, progress, totalItems, mode }: HUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Star Counter - Only show if not in alphabet mode (score is shown separately) */}
        {mode !== "alphabet" && (
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-2xl font-bold text-gray-800">{stars}</span>
          </div>
        )}

        {/* Progress Tracker - Only show if not alphabet mode (alphabet has vertical tracker) */}
        {mode !== "alphabet" && (
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <div className="flex gap-1">
              {Array.from({ length: totalItems }, (_, index) => (
                <div
                  key={index}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-bold
                    transition-all duration-300
                    ${
                      index < progress
                        ? "bg-green-500 text-white scale-110"
                        : "bg-gray-200 text-gray-500"
                    }
                  `}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Item Display & Repeat Button */}
      {currentItem && (
        <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl">
            <div className="text-center">
              <div className="text-6xl md:text-8xl font-bold mb-2" style={{ color: currentItem.color }}>
                {currentItem.label}
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-800">
                {mode === "alphabet" ? `for ${currentItem.word}` : `is ${currentItem.word}`}
              </div>
            </div>
          </div>
          <AudioButton
            audioUrl={currentItem.audio}
            text={mode === "alphabet" 
              ? `${currentItem.label} for ${currentItem.word}`
              : `${currentItem.label} is ${currentItem.word}`}
            label="Repeat"
            className="text-xl"
          />
        </div>
      )}
    </div>
  );
}

