import { LetterBox, LetterData } from "./LetterBox";
import { useIsMobile } from "../../../../hooks/useIsMobile";

type LayoutType = "circular" | "spiral" | "hexagonal";

interface CircularMatchGridProps {
  letters: LetterData[];
  selectedId: number | null;
  matchedIds: number[];
  onLetterClick: (id: number) => void;
  isShaking?: boolean;
  revealedIds?: number[];
  matchedPairs?: Map<number, string>;
  layoutType?: LayoutType;
}

export function CircularMatchGrid({ 
  letters, 
  selectedId, 
  matchedIds, 
  onLetterClick, 
  isShaking = false, 
  revealedIds = [], 
  matchedPairs = new Map(),
  layoutType = "circular"
}: CircularMatchGridProps) {
  const isMobile = useIsMobile();
  const totalLetters = letters.length;

  // Calculate circular layout positions
  const getCircularPosition = (index: number): [number, number, number] => {
    // Arrange boxes in a circle
    const angle = (index / totalLetters) * Math.PI * 2 - Math.PI / 2; // Start from top
    const radius = isMobile ? 3.5 : 5; // Smaller radius on mobile
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 0;
    
    return [x, y, z];
  };

  // Calculate spiral layout positions (alternative)
  const getSpiralPosition = (index: number): [number, number, number] => {
    const angle = index * 0.5; // Spiral angle increment
    const radius = 2 + (index * 0.3); // Increasing radius
    const scale = isMobile ? 0.7 : 1.0;
    
    const x = Math.cos(angle) * radius * scale;
    const z = Math.sin(angle) * radius * scale;
    const y = 0;
    
    return [x, y, z];
  };

  // Calculate hexagonal layout positions
  const getHexagonalPosition = (index: number): [number, number, number] => {
    // Arrange in hexagonal pattern
    const rings = Math.ceil(Math.sqrt(totalLetters / 3));
    let ring = 0;
    let positionInRing = index;
    let accumulated = 0;
    
    for (let r = 0; r < rings; r++) {
      const itemsInRing = r === 0 ? 1 : r * 6;
      if (index < accumulated + itemsInRing) {
        ring = r;
        positionInRing = index - accumulated;
        break;
      }
      accumulated += itemsInRing;
    }
    
    const radius = ring * 2.5 * (isMobile ? 0.7 : 1.0);
    const angle = ring === 0 ? 0 : (positionInRing / (ring * 6)) * Math.PI * 2;
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = 0;
    
    return [x, y, z];
  };
  
  const getPosition = (index: number): [number, number, number] => {
    switch (layoutType) {
      case "spiral":
        return getSpiralPosition(index);
      case "hexagonal":
        return getHexagonalPosition(index);
      default:
        return getCircularPosition(index);
    }
  };

  const boxScale = isMobile ? 0.75 : 0.9;

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
          <group key={letterData.id} scale={boxScale}>
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

