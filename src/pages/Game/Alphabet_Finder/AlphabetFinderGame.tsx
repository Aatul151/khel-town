import { useState, useEffect, useCallback } from "react";
import { AlphabetStreet } from "./scenes/AlphabetStreet";
import { HUD } from "../../../ui/HUD";
import { PromptDisplay } from "./components/PromptDisplay";
import { LearningItem, LearningMode } from "../../../data/types";
import { getContentForMode } from "../../../data/index";
import { getProgress, addStar, markItemComplete, resetProgress } from "../../../utils/storage";
import { playPhonicsAudio, stopAllAudio, playBackgroundMusic } from "../../../utils/audio";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useAvatarControls } from "../../../hooks/useAvatarControls";
import { AvatarType } from "../../../components/AvatarSelector";
import { usePlayer } from "../../../context/PlayerContext";

interface AlphabetFinderGameProps {
  avatar: AvatarType;
  onBack: () => void;
  onGameComplete?: () => void;
}

export function AlphabetFinderGame({ avatar, onBack, onGameComplete }: AlphabetFinderGameProps) {
  const isMobile = useIsMobile();
  const { playerName } = usePlayer();
  const { direction, rotationDirection, isMoving, handleTouchStart, handleTouchEnd } = useAvatarControls();
  const [currentMode] = useState<LearningMode>("alphabet");
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);
  const [currentItem, setCurrentItem] = useState<LearningItem | null>(null);
  const [promptItem, setPromptItem] = useState<LearningItem | null>(null);
  const [showStar, setShowStar] = useState(false);
  const [starPosition, setStarPosition] = useState<[number, number, number] | null>(null);
  const [progress, setProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [avatarPosition, setAvatarPosition] = useState<[number, number, number]>([0, 0, -20]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTooFarMessage, setShowTooFarMessage] = useState(false);
  const [boxPositions, setBoxPositions] = useState<Map<string, [number, number, number]>>(new Map());
  const [shuffleKey, setShuffleKey] = useState(0);

  // Get current content based on mode
  const currentContent = getContentForMode(currentMode);
  const availableItems = currentContent.filter(item => !completedItems.includes(item.id));

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = getProgress(currentMode);
    setStars(savedProgress.stars);
    setScore(savedProgress.stars);
    setCompletedItems(savedProgress.completedItems);
    setProgress(savedProgress.completedItems.length);
    setPromptItem(null);
  }, [currentMode]);

  // Generate random prompt when mode changes or when no prompt exists
  useEffect(() => {
    if (currentMode === "alphabet") {
      if (availableItems.length > 0 && !promptItem) {
        const randomIndex = Math.floor(Math.random() * availableItems.length);
        setPromptItem(availableItems[randomIndex]);
        const textToSpeak = `Find ${availableItems[randomIndex].label} for ${availableItems[randomIndex].word}`;
        playPhonicsAudio("", textToSpeak);
      } else if (availableItems.length === 0) {
        setPromptItem(null);
        playPhonicsAudio("", "Congratulations! You completed all letters!");
      }
    }
  }, [currentMode, availableItems.length, promptItem]);

  // Reset when mode changes
  useEffect(() => {
    setCurrentItem(null);
    setShowStar(false);
    stopAllAudio();
    setAvatarPosition([0, 0, -20]);
  }, [currentMode]);

  // Start background music when component mounts
  useEffect(() => {
    playBackgroundMusic();

    return () => {
      // Stop all audio when component unmounts (when navigating away)
      stopAllAudio();
    };
  }, []);

  const handleItemClick = useCallback((item: LearningItem, itemPosition: [number, number, number]) => {
    if (!promptItem) return;

    const distance = Math.sqrt(
      Math.pow(itemPosition[0] - avatarPosition[0], 2) +
      Math.pow(itemPosition[2] - avatarPosition[2], 2)
    );

    if (distance > 2.5) {
      playPhonicsAudio("", "Get closer to the box!");
      setShowTooFarMessage(true);
      setTimeout(() => setShowTooFarMessage(false), 2000);
      return;
    }

    const isCorrect = item.id === promptItem.id;

    if (isCorrect) {
      setShowSuccess(true);
      setScore(prev => prev + 10);
      const newStarCount = addStar(currentMode);
      setStars(newStarCount);

      markItemComplete(currentMode, item.id);
      setCompletedItems(prev => [...prev, item.id]);
      setProgress(prev => prev + 1);

      const textToSpeak = `${item.label} for ${item.word}`;
      playPhonicsAudio(item.audio, textToSpeak);

      const gridSize = Math.ceil(Math.sqrt(26));
      const itemIndex = currentContent.findIndex(i => i.id === item.id);
      const row = Math.floor(itemIndex / gridSize);
      const col = itemIndex % gridSize;
      const spacing = 3;
      const x = (col - (gridSize - 1) / 2) * spacing;
      const z = (row - (gridSize - 1) / 2) * spacing;

      setStarPosition([x, 3, z]);
      setShowStar(true);

      setTimeout(() => {
        setShowSuccess(false);
        const remaining = currentContent.filter(i => !completedItems.includes(i.id) && i.id !== item.id);
        if (remaining.length > 0) {
          const randomIndex = Math.floor(Math.random() * remaining.length);
          setPromptItem(remaining[randomIndex]);
          const newPromptText = `Find ${remaining[randomIndex].label} for ${remaining[randomIndex].word}`;
          playPhonicsAudio("", newPromptText);
        } else {
          setPromptItem(null);
          playPhonicsAudio("", "Congratulations! You completed all letters!");
          // Notify parent that game is completed
          if (onGameComplete) {
            setTimeout(() => {
              // Stop all audio before navigating away
              stopAllAudio();
              onGameComplete();
            }, 3000); // Wait 3 seconds to show the completion message
          }
        }
      }, 2000);
    } else {
      playPhonicsAudio("", "Try again!");
    }
  }, [promptItem, currentMode, availableItems, currentContent, avatarPosition]);

  const handleResetGame = () => {
    if (window.confirm("Are you sure you want to reset the game? All progress will be lost.")) {
      resetProgress(currentMode);
      setScore(0);
      setStars(0);
      setCompletedItems([]);
      setProgress(0);
      setCurrentItem(null);
      setShowStar(false);
      setAvatarPosition([0, 0, -20]);
      setShowSuccess(false);
      setPromptItem(null);
      setShuffleKey(prev => prev + 1);
      stopAllAudio();
      playBackgroundMusic();
    }
  };

  const handleStarComplete = () => {
    setShowStar(false);
    setStarPosition(null);
  };

  // Handle back button - stop all audio before navigating
  const handleBack = () => {
    onBack();
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-100 to-purple-100 overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <AlphabetStreet
          items={currentContent}
          onItemClick={handleItemClick}
          showStar={showStar}
          starPosition={starPosition}
          onStarComplete={handleStarComplete}
          showObject={false}
          objectPosition={null}
          objectModelPath={null}
          avatarType={avatar}
          avatarTarget={null}
          onAvatarReachTarget={() => { }}
          completedItems={completedItems}
          avatarPosition={avatarPosition}
          onBoxPositionsUpdate={setBoxPositions}
          shuffleKey={shuffleKey}
          currentMode={currentMode}
          boxPositions={boxPositions}
          completedItemsForCollision={completedItems}
          onAvatarPositionChange={setAvatarPosition}
          direction={direction}
          rotationDirection={rotationDirection}
          isMoving={isMoving}
        />
      </div>

      {/* Prompt Display */}
      {currentMode === "alphabet" && (
        <>
          <PromptDisplay promptItem={promptItem} score={score} playerName={playerName} />

          {/* Progress Numbers */}
          <div className={`absolute ${isMobile ? 'bottom-2 left-2 right-2' : 'bottom-4 left-1/2 transform -translate-x-1/2'} z-30`}>
            <div className={`bg-white/70 backdrop-blur-sm rounded-xl ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} shadow-xl ${isMobile ? 'w-full' : ''}`}>
              <div className={`flex flex-wrap ${isMobile ? 'gap-1' : 'gap-1.5'} ${isMobile ? 'justify-center' : 'max-w-2xl justify-center'} ${isMobile ? '' : 'mx-auto'}`}>
                {Array.from({ length: currentContent.length }, (_, index) => (
                  <div
                    key={index}
                    className={`
                      ${isMobile ? 'w-5 h-5 text-[8px]' : 'w-7 h-7 text-xs'} rounded-full flex items-center justify-center
                      font-bold transition-all duration-300
                      ${completedItems.includes(currentContent[index].id)
                        ? "bg-green-500 text-white scale-110"
                        : index === currentContent.findIndex(i => i.id === promptItem?.id)
                          ? "bg-yellow-400 text-black scale-110 ring-1 ring-yellow-600"
                          : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className={`bg-green-500 text-white rounded-2xl ${isMobile ? 'px-6 py-4' : 'px-8 py-6'} shadow-2xl animate-bounce`}>
            <div className={`${isMobile ? 'text-4xl' : 'text-6xl'} text-center mb-2`}>🎉</div>
            <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-center`}>Correct!</div>
            <div className={`${isMobile ? 'text-lg' : 'text-xl'} text-center mt-2`}>+10 Points</div>
          </div>
        </div>
      )}

      {/* Too Far Message */}
      {showTooFarMessage && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 z-40">
          <div className={`bg-orange-500 text-white rounded-2xl ${isMobile ? 'px-4 py-3' : 'px-6 py-4'} shadow-2xl animate-pulse`}>
            <div className={`${isMobile ? 'text-3xl' : 'text-4xl'} text-center mb-2`}>⚠️</div>
            <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-center`}>Get Closer!</div>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-center mt-1`}>Move your avatar near the box</div>
          </div>
        </div>
      )}

      {/* Reset Game and Home Buttons */}
      <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'} z-20 flex ${isMobile ? 'gap-1' : 'gap-2'}`}>
        <button
          onClick={handleBack}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-bold ${isMobile ? 'py-1.5 px-2 text-sm' : 'py-2 px-4'} rounded-full shadow-lg transition-all duration-200 active:scale-95 flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}
          aria-label="Back"
        >
          <svg className={isMobile ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {!isMobile && <span>Back</span>}
        </button>
        <button
          onClick={handleResetGame}
          className={`bg-red-500 hover:bg-red-600 text-white font-bold ${isMobile ? 'py-1.5 px-2 text-sm' : 'py-2 px-4'} rounded-full shadow-lg transition-all duration-200 active:scale-95 flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}
          aria-label="Reset Game"
        >
          <svg className={isMobile ? "w-4 h-4" : "w-5 h-5"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {!isMobile && <span>Reset Game</span>}
        </button>
      </div>

      {/* HUD Overlay */}
      <HUD
        stars={stars}
        currentItem={currentItem}
        onRepeat={() => { }}
        progress={progress}
        totalItems={currentContent.length}
        mode={currentMode}
      />

      {/* Controls Instructions */}
      {currentMode === "alphabet" && (
        <div className={`absolute ${isMobile ? 'top-16 left-2' : 'top-20 left-4'} z-20`}>
          <div className={`bg-white/90 backdrop-blur-sm rounded-lg ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} shadow-lg`}>
            <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-medium text-gray-700`}>
              {isMobile ? '↑↓←→ Move' : 'Arrow Keys: Move'}
            </div>
            <div className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} text-gray-500 mt-0.5`}>
              {isMobile ? 'Tap Box' : 'Click Box'}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Control Buttons */}
      {currentMode === "alphabet" && isMobile && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <div className="relative">
            <div className="grid grid-cols-3 gap-0.5">
              <div></div>
              <button
                onTouchStart={(e) => {
                  e?.stopPropagation();
                  handleTouchStart("up");
                }}
                onTouchEnd={(e) => {
                  e?.stopPropagation();
                  handleTouchEnd("up");
                }}
                onMouseDown={() => handleTouchStart("up")}
                onMouseUp={() => handleTouchEnd("up")}
                onMouseLeave={() => handleTouchEnd("up")}
                className="bg-blue-500 active:bg-blue-600 text-white rounded-lg p-3 shadow-lg touch-manipulation select-none"
                aria-label="Move Forward"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <div></div>

              <button
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart("left");
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handleTouchEnd("left");
                }}
                onMouseDown={() => handleTouchStart("left")}
                onMouseUp={() => handleTouchEnd("left")}
                onMouseLeave={() => handleTouchEnd("left")}
                className="bg-blue-500 active:bg-blue-600 text-white rounded-lg p-3 shadow-lg touch-manipulation select-none"
                aria-label="Turn Left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart("down");
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handleTouchEnd("down");
                }}
                onMouseDown={() => handleTouchStart("down")}
                onMouseUp={() => handleTouchEnd("down")}
                onMouseLeave={() => handleTouchEnd("down")}
                className="bg-blue-500 active:bg-blue-600 text-white rounded-lg p-3 shadow-lg touch-manipulation select-none"
                aria-label="Turn Around"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onTouchStart={(e) => {
                  e.stopPropagation();
                  handleTouchStart("right");
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handleTouchEnd("right");
                }}
                onMouseDown={() => handleTouchStart("right")}
                onMouseUp={() => handleTouchEnd("right")}
                onMouseLeave={() => handleTouchEnd("right")}
                className="bg-blue-500 active:bg-blue-600 text-white rounded-lg p-3 shadow-lg touch-manipulation select-none"
                aria-label="Turn Right"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

