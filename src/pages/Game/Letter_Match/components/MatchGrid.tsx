import { LetterBox, LetterData } from "./LetterBox";
import { useIsMobile } from "../../../../hooks/useIsMobile";

interface MatchGridProps {
  letters: LetterData[];
  selectedId: number | null;
  matchedIds: number[];
  onLetterClick: (id: number) => void;
  isShaking?: boolean;
  revealedIds?: number[];
  matchedPairs?: Map<number, string>; // Map of letter ID to display letter (for matched pairs)
}

export function MatchGrid({ letters, selectedId, matchedIds, onLetterClick, isShaking = false, revealedIds = [], matchedPairs = new Map() }: MatchGridProps) {
  const isMobile = useIsMobile();

  // Calculate grid dimensions based on screen size
  const getGridConfig = () => {
    const totalLetters = letters.length;
    const screenWidth = window.innerWidth;
    
    if (isMobile || screenWidth < 640) {
      // Mobile: 2 columns, tighter spacing
      return {
        cols: 2,
        rows: Math.ceil(totalLetters / 2),
        spacing: 2.2, // Reduced spacing for mobile
        boxScale: 0.85, // Smaller boxes on mobile
      };
    } else if (screenWidth < 1024) {
      // Tablet: 3-4 columns
      return {
        cols: totalLetters <= 8 ? 3 : 4,
        rows: Math.ceil(totalLetters / (totalLetters <= 8 ? 3 : 4)),
        spacing: 2.8,
        boxScale: 0.95,
      };
    } else {
      // Desktop: 4-5 columns
      return {
        cols: totalLetters <= 8 ? 4 : 5,
        rows: Math.ceil(totalLetters / (totalLetters <= 8 ? 4 : 5)),
        spacing: 3.5,
        boxScale: 1.0,
      };
    }
  };

  const config = getGridConfig();
  const { cols, rows, spacing } = config;

  // Calculate positions for each letter
  const getPosition = (index: number): [number, number, number] => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Center the grid
    const totalWidth = (cols - 1) * spacing;
    const totalHeight = (rows - 1) * spacing;
    
    const x = (col * spacing) - totalWidth / 2;
    // Adjust vertical position for mobile to ensure visibility
    const zOffset = isMobile && rows > 4 ? -0.5 : 0; // Shift up slightly on mobile if many rows
    const z = (row * spacing) - totalHeight / 2 + zOffset;
    const y = 0;
    
    return [x, y, z];
  };

  return (
    <>
      {letters.map((letterData, index) => {
        const position = getPosition(index);
        const state = matchedIds.includes(letterData.id)
          ? "matched"
          : selectedId === letterData.id
          ? "selected"
          : "idle";

        const isRevealed = revealedIds.includes(letterData.id) || matchedIds.includes(letterData.id);
        const displayLetter = matchedPairs.get(letterData.id) || (isRevealed ? letterData.letter : undefined);

        return (
          <group key={letterData.id} scale={config.boxScale}>
            <LetterBox
              letterData={letterData}
              position={position}
              onClick={() => onLetterClick(letterData.id)}
              state={state}
              isMatched={matchedIds.includes(letterData.id)}
              isShaking={isShaking && (selectedId === letterData.id || state === "selected")}
              isRevealed={isRevealed}
              displayLetter={displayLetter}
            />
          </group>
        );
      })}
    </>
  );
}

