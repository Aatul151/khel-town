import { useState, useEffect, useCallback } from "react";
import { LetterMatchScene } from "./scenes/LetterMatchScene";
import { LetterData } from "./components/LetterBox";
import { Howl } from "howler";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { usePlayer } from "../../../context/PlayerContext";
import { addStar } from "../../../utils/storage";

interface LetterMatchGameProps {
  onBack: () => void;
  onGameComplete?: () => void;
}

// Generate letter pairs (8-10 pairs)
function generateLetterPairs(count: number = 8): LetterData[] {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const selectedLetters = letters.slice(0, count);
  
  const pairs: LetterData[] = [];
  let id = 1;

  selectedLetters.forEach((letter) => {
    // Add uppercase
    pairs.push({
      id: id++,
      letter: letter,
      case: "upper",
    });
    // Add lowercase
    pairs.push({
      id: id++,
      letter: letter.toLowerCase(),
      case: "lower",
    });
  });

  // Shuffle the array
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  return pairs;
}

// Sound effects
const playSuccessSound = () => {
  const sound = new Howl({
    src: ["/audio/success.mp3"],
    volume: 0.7,
    onloaderror: () => {
      // Fallback: create a pleasant success sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    },
  });
  sound.play();
};

const playErrorSound = () => {
  const sound = new Howl({
    src: ["/audio/error.mp3"],
    volume: 0.5,
    onloaderror: () => {
      // Fallback: create a soft "try again" sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 200; // Low, soft tone
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    },
  });
  sound.play();
};

export function LetterMatchGame({ onBack, onGameComplete }: LetterMatchGameProps) {
  const isMobile = useIsMobile();
  const { playerName } = usePlayer();
  
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [revealedIds, setRevealedIds] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Map<number, string>>(new Map());
  const [stars, setStars] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Initialize game with random letters
  useEffect(() => {
    const letterCount = Math.floor(Math.random() * 3) + 8; // 8-10 pairs
    setLetters(generateLetterPairs(letterCount));
    setMatchedIds([]);
    setRevealedIds([]);
    setMatchedPairs(new Map());
    setSelectedId(null);
    setStars(0);
  }, []);

  // Check if game is completed
  const isGameComplete = matchedIds.length === letters.length && letters.length > 0;

  // Handle letter click
  const handleLetterClick = useCallback(
    (id: number) => {
      // Don't allow clicking matched letters
      if (matchedIds.includes(id)) return;

      // Don't allow clicking the same letter twice
      if (selectedId === id) return;

      // If no letter is selected, reveal and select this one
      if (selectedId === null) {
        setSelectedId(id);
        setRevealedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        return;
      }

      // Get both letters
      const firstLetter = letters.find((l) => l.id === selectedId);
      const secondLetter = letters.find((l) => l.id === id);

      if (!firstLetter || !secondLetter) return;

      // Reveal the second letter
      setRevealedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

      // Check if they match (same letter, different case)
      const isMatch =
        (firstLetter.case === "upper" && secondLetter.case === "lower" && firstLetter.letter.toLowerCase() === secondLetter.letter) ||
        (firstLetter.case === "lower" && secondLetter.case === "upper" && firstLetter.letter.toUpperCase() === secondLetter.letter);

      if (isMatch) {
        // Correct match! Show uppercase letter on both boxes
        const displayLetter = firstLetter.case === "upper" ? firstLetter.letter : secondLetter.letter.toUpperCase();
        
        setMatchedIds((prev) => [...prev, selectedId, id]);
        setMatchedPairs((prev) => {
          const newMap = new Map(prev);
          newMap.set(selectedId, displayLetter);
          newMap.set(id, displayLetter);
          return newMap;
        });
        setSelectedId(null);
        setStars((prev) => prev + 1);
        addStar("alphabet"); // Save to storage
        playSuccessSound();

        // Check if game is complete
        const newMatchedIds = [...matchedIds, selectedId, id];
        if (newMatchedIds.length === letters.length) {
          setTimeout(() => {
            setShowCelebration(true);
            if (onGameComplete) {
              setTimeout(() => {
                onGameComplete();
              }, 3000);
            }
          }, 500);
        }
      } else {
        // Incorrect match - hide both letters after a delay
        setIsShaking(true);
        playErrorSound();
        setTimeout(() => {
          setSelectedId(null);
          setRevealedIds((prev) => prev.filter((revealedId) => revealedId !== selectedId && revealedId !== id));
          setIsShaking(false);
        }, 1000);
      }
    },
    [selectedId, letters, matchedIds, onGameComplete]
  );

  // Reset game
  const handleReset = () => {
    if (window.confirm("Are you sure you want to restart? Your progress will be reset.")) {
      const letterCount = Math.floor(Math.random() * 3) + 8;
      setLetters(generateLetterPairs(letterCount));
      setMatchedIds([]);
      setRevealedIds([]);
      setMatchedPairs(new Map());
      setSelectedId(null);
      setStars(0);
      setShowCelebration(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-100 via-purple-100 to-pink-100 overflow-hidden relative">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <LetterMatchScene
          letters={letters}
          selectedId={selectedId}
          matchedIds={matchedIds}
          onLetterClick={handleLetterClick}
          showCelebration={showCelebration}
          onCelebrationComplete={() => setShowCelebration(false)}
          isShaking={isShaking}
          revealedIds={revealedIds}
          matchedPairs={matchedPairs}
          layoutType="hexagonal"
        />
      </div>

      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top HUD */}
        {/* Control Buttons - Top Left */}
        <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'} flex ${isMobile ? 'gap-1' : 'gap-2'} pointer-events-auto`}>
          <button
            onClick={onBack}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-bold ${isMobile ? 'py-1.5 px-2 text-sm' : 'py-2 px-4'} rounded-full shadow-lg transition-all duration-200 active:scale-95 flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}
            aria-label="Back"
          >
            <svg className={isMobile ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {!isMobile && <span>Back</span>}
          </button>
          <button
            onClick={handleReset}
            className={`bg-red-500 hover:bg-red-600 text-white font-bold ${isMobile ? 'py-1.5 px-2 text-sm' : 'py-2 px-4'} rounded-full shadow-lg transition-all duration-200 active:scale-95 flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}
            aria-label="Reset Game"
          >
            <svg className={isMobile ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {!isMobile && <span>Reset</span>}
          </button>
        </div>

        {/* Star Counter - Top Right */}
        <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} pointer-events-auto`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-2xl font-bold text-gray-800">{stars}</span>
          </div>
        </div>

        {/* Progress - Bottom */}
        <div className={`absolute ${isMobile ? 'bottom-16 left-2 right-2' : 'bottom-4 left-1/2 transform -translate-x-1/2'} pointer-events-auto`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <span className="text-lg font-bold text-gray-800">
              {matchedIds.length / 2} / {letters.length / 2} Pairs
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className={`absolute ${isMobile ? 'bottom-28 left-2 right-2' : 'bottom-20 left-4'} pointer-events-auto`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg max-w-md">
            <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-700 text-center`}>
              {selectedId === null
                ? "👆 Tap a letter to select it"
                : "👆 Tap another letter to match"}
            </p>
            {!isMobile && (
              <p className="text-xs text-gray-500 text-center mt-1">
                🔍 Scroll to zoom in/out
              </p>
            )}
          </div>
        </div>


        {/* Completion Message */}
        {isGameComplete && !showCelebration && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            <div className={`bg-green-500 text-white rounded-2xl ${isMobile ? 'px-6 py-4' : 'px-8 py-6'} shadow-2xl animate-bounce`}>
              <div className={`${isMobile ? 'text-4xl' : 'text-6xl'} text-center mb-2`}>🎉</div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-center`}>All Matched!</div>
              <div className={`${isMobile ? 'text-lg' : 'text-xl'} text-center mt-2`}>Great job, {playerName}!</div>
            </div>
          </div>
        )}
      </div>

      {/* Shake animation overlay */}
      {isShaking && (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}

