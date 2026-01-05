import { LearningMode } from "../data/types";

interface ModeSelectorProps {
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
}

const modeIcons: Record<LearningMode, string> = {
  alphabet: "🔤",
  numbers: "🔢",
  shapes: "🔷",
  colors: "🎨",
};

const modeLabels: Record<LearningMode, string> = {
  alphabet: "Alphabet",
  numbers: "Numbers",
  shapes: "Shapes",
  colors: "Colors",
};

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modes: LearningMode[] = ["alphabet", "numbers", "shapes", "colors"];

  return (
    <div className="flex gap-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-2 shadow-lg">
      {modes?.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            font-semibold text-sm md:text-base
            transition-all duration-200
            ${
              currentMode === mode
                ? "bg-primary-400 text-white scale-105 shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
          aria-label={`Switch to ${modeLabels[mode]} mode`}
        >
          <span className="text-xl">{modeIcons[mode]}</span>
          <span className="hidden md:inline">{modeLabels[mode]}</span>
        </button>
      ))}
    </div>
  );
}

