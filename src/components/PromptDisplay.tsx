import { LearningItem } from "../data/types";
import { useIsMobile } from "../hooks/useIsMobile";

interface PromptDisplayProps {
  promptItem: LearningItem | null;
  score: number;
  playerName?: string;
}

export function PromptDisplay({ promptItem, score, playerName }: PromptDisplayProps) {
  const isMobile = useIsMobile();
  if (!promptItem) return null;

  return (
    <>
      {/* Prompt Display - Center */}
      <div className={`absolute ${isMobile ? 'top-12' : 'top-20'} left-1/2 transform -translate-x-1/2 z-30`}>
        <div className={`bg-gradient-to-r from-purple-500/50 to-pink-500/70 backdrop-blur-sm rounded-2xl ${isMobile ? 'px-4 py-3' : 'px-8 py-6'} shadow-2xl`}>
          <div className="text-center">
            <div className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} font-semibold ${isMobile ? 'mb-1' : 'mb-2'}`}>Find the letter:</div>
            <div className={`${isMobile ? 'text-4xl' : 'text-6xl md:text-8xl'} font-bold text-white ${isMobile ? 'mb-1' : 'mb-2'}`}>
              {promptItem.label}
            </div>
            <div className={`text-white ${isMobile ? 'text-sm' : 'text-xl'} font-semibold`}>
              for {promptItem.word}
            </div>
          </div>
        </div>
      </div>

      {/* Score Display - Top Right */}
      <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-30`}>
        <div className={`bg-green-500 text-white rounded-full ${isMobile ? 'px-2 py-1' : 'px-4 py-2'} shadow-lg flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
          <svg className={isMobile ? "w-3 h-3" : "w-4 h-4"} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {playerName && (
            <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold opacity-90`}>
              {playerName}
            </span>
          )}
          <span className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold`}>
            {playerName ? ' • ' : ''}Score: {score}
          </span>
        </div>
      </div>
    </>
  );
}

