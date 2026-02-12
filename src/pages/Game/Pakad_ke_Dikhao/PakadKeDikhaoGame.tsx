import { useState, useEffect, useCallback, useRef } from "react";
import { PlaygroundScene, type CameraMode } from "./scenes/PlaygroundScene";
import { getButtonClasses, BUTTON_FULL_WIDTH } from "../../../utils/buttonStyles";
import { playPhonicsAudio, stopAllAudio, playBackgroundMusic, stopBackgroundMusic, stopWalkingSound } from "../../../utils/audio";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useAvatarControls } from "../../../hooks/useAvatarControls";
import { AvatarType } from "../../../components/AvatarSelector";
import { usePlayer } from "../../../context/PlayerContext";
import { Countdown } from "../../../components/Countdown";

// Follower count options - user selects in menu
export const FOLLOWER_COUNT_OPTIONS = [3, 5, 10, 15] as const;
export type FollowerCountOption = (typeof FOLLOWER_COUNT_OPTIONS)[number];

// Available time levels in minutes
export type TimeLevel = 2 | 3 | 5 | 10;
export const TIME_LEVELS: TimeLevel[] = [2, 3, 5, 10];

// Follower avatar types - different types for variety
const FOLLOWER_AVATAR_TYPES: AvatarType[] = ["robot", "boy", "girl", "robot"];

/** Mobile button that fires on pointer down/up with capture so release is always detected (never stop player accidentally). */
function MobileControlButton({
  label,
  onPressStart,
  onPressEnd,
  className,
}: {
  label: string;
  onPressStart: () => void;
  onPressEnd: () => void;
  className: string;
}) {
  const onPressEndRef = useRef(onPressEnd);
  onPressEndRef.current = onPressEnd;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onPressStart();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch (_) {}
    onPressEndRef.current();
  };

  return (
    <button
      type="button"
      className={`flex items-center justify-center transition-all active:scale-95 ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "manipulation" }}
      aria-label={label}
    >
      {label}
    </button>
  );
}

interface PakadKeDikhaoGameProps {
  avatar: AvatarType;
  onBack: () => void;
  onGameComplete?: () => void;
}

export function PakadKeDikhaoGame({ avatar, onBack, onGameComplete: _onGameComplete }: PakadKeDikhaoGameProps) {
  const isMobile = useIsMobile();
  const { playerName } = usePlayer();
  const { direction, rotationDirection, isMoving, handleTouchStart, handleTouchEnd } = useAvatarControls();
  
  // Game state
  const [gameState, setGameState] = useState<"menu" | "playing" | "won" | "lost">("menu");
  const [selectedTimeLevel, setSelectedTimeLevel] = useState<TimeLevel>(2);
  const [selectedFollowerCount, setSelectedFollowerCount] = useState<FollowerCountOption>(5);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // in seconds
  const [avatarPosition, setAvatarPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [_followerDistances, setFollowerDistances] = useState<number[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>("follow");

  // Timer ref
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown state
  const [showCountdown, setShowCountdown] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [hasPlayerMoved, setHasPlayerMoved] = useState(false);
  const initialAvatarPosition = useRef<[number, number, number]>([0, 0, 0]);

  // Win condition
  const handleWin = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState("won");
    stopAllAudio();
    playPhonicsAudio("", `Congratulations ${playerName || "Player"}! You survived! You won the game!`);
  }, [playerName]);

  // Handle countdown completion
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    setGameStarted(true);
    setHasPlayerMoved(false);
    initialAvatarPosition.current = [0, 0, 0];
    const timeInSeconds = selectedTimeLevel * 60;
    setTimeRemaining(timeInSeconds);
    playBackgroundMusic();
    
    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - player wins!
          handleWin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [selectedTimeLevel, handleWin]);

  // Track avatar position changes to detect when player starts moving
  useEffect(() => {
    if (!gameStarted || gameState !== "playing") return;
    
    const [initX, initY, initZ] = initialAvatarPosition.current;
    const [currX, currY, currZ] = avatarPosition;
    
    // Check if player has moved from initial position (threshold of 0.5 units)
    const distance = Math.sqrt(
      Math.pow(currX - initX, 2) + 
      Math.pow(currZ - initZ, 2)
    );
    
    if (distance > 0.5 && !hasPlayerMoved) {
      setHasPlayerMoved(true);
    }
  }, [avatarPosition, gameStarted, gameState, hasPlayerMoved]);

  // Start game
  const handleStartGame = () => {
    setGameState("playing");
    setShowCountdown(true);
    setGameStarted(false);
  };

  // Lose condition - caught by follower
  const handleGameOver = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState("lost");
    stopBackgroundMusic();
    stopWalkingSound();
    playPhonicsAudio("", "Oh no! You were caught! The followers got you! Try again!");
  };

  // Handle follower distance updates
  const handleFollowerDistanceChange = useCallback((distances: number[]) => {
    if (!gameStarted) return;
    setFollowerDistances(distances);
    // Show warning if any follower is close
    const minDistance = Math.min(...distances);
    setShowWarning(minDistance < 5);
  }, []);

  // Reset game
  const handleReset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState("menu");
    setTimeRemaining(0);
    setFollowerDistances([]);
    setShowWarning(false);
    setHasPlayerMoved(false);
    initialAvatarPosition.current = [0, 0, 0];
    stopAllAudio();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      stopAllAudio();
    };
  }, []);

  // Mobile: lock body scroll when playing so touches don't scroll the page
  useEffect(() => {
    if (!isMobile || gameState !== "playing") return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, [isMobile, gameState]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden"
      style={
        isMobile && gameState === "playing"
          ? {
              paddingTop: "env(safe-area-inset-top, 0px)",
              paddingLeft: "env(safe-area-inset-left, 0px)",
              paddingRight: "env(safe-area-inset-right, 0px)",
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
            }
          : undefined
      }
    >
      {/* Countdown */}
      {showCountdown && (
        <Countdown onComplete={handleCountdownComplete} />
      )}

      {/* Game Scene - touch-action: none on mobile so game area doesn't scroll and steal touches */}
      {gameState === "playing" && gameStarted && (
        <div className={`absolute inset-0 ${isMobile ? "touch-none select-none" : ""}`} style={isMobile ? { touchAction: "none" } : undefined}>
          <PlaygroundScene
            avatarType={avatar}
            avatarPosition={avatarPosition}
            onAvatarPositionChange={setAvatarPosition}
            followerCount={selectedFollowerCount}
            followerAvatarTypes={FOLLOWER_AVATAR_TYPES}
            onGameOver={handleGameOver}
            onFollowerDistanceChange={handleFollowerDistanceChange}
            direction={direction}
            rotationDirection={rotationDirection}
            isMoving={isMoving}
            onTouchGesture={isMobile && gameStarted ? (action) => {
              if (action === "up") handleTouchStart("up");
              else if (action === "left") handleTouchStart("left");
              else if (action === "right") handleTouchStart("right");
              else if (action === "down") handleTouchStart("down");
            } : undefined}
            onTouchGestureEnd={isMobile ? (action) => handleTouchEnd(action) : undefined}
            cameraMode={cameraMode}
            enableFollower={hasPlayerMoved}
          />
        </div>
      )}

      {/* Menu Screen - Level Selection */}
      {gameState === "menu" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 z-50">
          <div className={`bg-white rounded-3xl shadow-2xl ${isMobile ? 'p-6 mx-4' : 'p-8'} max-w-lg w-full text-center overflow-hidden`}>
            {/* Header Section */}
            <div className="mb-6">
              <div className={`${isMobile ? 'text-5xl' : 'text-6xl'} mb-3 animate-bounce`}>🏃💨</div>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2`}>
                Pakad ke Dikhao
              </div>
              <div className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 font-medium`}>
                Survive the followers! Don't get caught!
              </div>
            </div>

            {/* Time Level Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-700 font-bold`}>⏱️</span>
                <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>
                  Select Time Level
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {TIME_LEVELS.map((level) => {
                  const isSelected = selectedTimeLevel === level;
                  const difficulty = level <= 2 ? 'Easy' : level <= 5 ? 'Medium' : 'Hard';
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedTimeLevel(level)}
                      className={isSelected 
                        ? getButtonClasses('md', 'relative py-4 px-4 scale-105 ring-4 ring-blue-300 ring-opacity-50')
                        : `relative py-4 px-4 rounded-2xl font-bold transition-all duration-300 transform bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:scale-105 shadow-md`
                      }
                    >
                      <div className="text-2xl mb-1">{level <= 2 ? '🟢' : level <= 5 ? '🟡' : '🔴'}</div>
                      <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-extrabold`}>{level} min</div>
                      <div className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1 opacity-80`}>{difficulty}</div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-gray-800 animate-pulse">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Follower count: How many followers (chasers) */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-700 font-bold`}>👥</span>
                <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800`}>
                  How many followers?
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {FOLLOWER_COUNT_OPTIONS.map((count) => {
                  const isSelected = selectedFollowerCount === count;
                  const difficulty = count <= 3 ? 'Easy' : count <= 5 ? 'Medium' : count <= 10 ? 'Hard' : 'Extreme';
                  return (
                    <button
                      key={count}
                      onClick={() => setSelectedFollowerCount(count)}
                      className={isSelected 
                        ? getButtonClasses('sm', 'relative py-4 px-2 scale-110 ring-4 ring-amber-300 ring-opacity-50')
                        : `relative py-4 px-2 rounded-xl font-bold transition-all duration-300 transform bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 hover:scale-105 shadow-md`
                      }
                    >
                      <div className="text-xl mb-1">
                        {count <= 3 ? '😊' : count <= 5 ? '😐' : count <= 10 ? '😰' : '😱'}
                      </div>
                      <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-extrabold`}>{count}</div>
                      <div className={`${isMobile ? 'text-xs' : 'text-xs'} mt-0.5 opacity-70`}>{difficulty}</div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-800 animate-pulse">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartGame}
              className={`${BUTTON_FULL_WIDTH} mb-3 text-lg font-extrabold`}
            >
              🎮 Start Game
            </button>

            {/* Back Button */}
            <button
              onClick={onBack}
              className={getButtonClasses('md', 'w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600')}
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* Playing UI */}
      {gameState === "playing" && (
        <>
          {/* Timer Display - Below logo, safe area aware on mobile */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 z-30 ${isMobile ? "top-12" : "top-16"}`}
            style={isMobile ? { top: "max(3rem, env(safe-area-inset-top, 0px) + 2rem)" } : undefined}
          >
            <div className={`bg-black/80 backdrop-blur-sm text-white rounded-xl ${isMobile ? 'px-4 py-2' : 'px-6 py-3'} shadow-2xl border-2 ${timeRemaining < 60 ? 'border-red-500 animate-pulse' : 'border-yellow-400'}`}>
              <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-center`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
            </div>
          </div>

          {/* Warning when follower is close */}
          {showWarning && (
            <div className={`absolute ${isMobile ? "top-28" : "top-32"} left-1/2 transform -translate-x-1/2 z-40`}>
              <div className={`bg-red-600 text-white rounded-2xl ${isMobile ? 'px-4 py-3' : 'px-6 py-4'} shadow-2xl animate-pulse`}>
                <div className={`${isMobile ? 'text-xl' : 'text-2xl'} text-center mb-1`}>⚠️ RUN!</div>
                <div className={`${isMobile ? 'text-sm' : 'text-base'} text-center`}>Follower is close!</div>
              </div>
            </div>
          )}

          {/* Mobile D-pad controls - safe area bottom, reliable hold-to-run */}
          {isMobile && (
            <div
              data-mobile-controls
              className="absolute left-3 right-20 z-30 flex flex-col items-center gap-2 pointer-events-auto"
              style={{
                touchAction: "manipulation",
                bottom: "max(1rem, env(safe-area-inset-bottom, 0px) + 0.5rem)",
              }}
            >
              {/* Run (Up) - hold to run, release to stop */}
              <div className="flex justify-center">
                <MobileControlButton
                  label="RUN"
                  onPressStart={() => handleTouchStart("up")}
                  onPressEnd={() => handleTouchEnd("up")}
                  className="bg-green-600/90 hover:bg-green-500 active:bg-green-400 text-white rounded-xl shadow-lg border-2 border-green-400/50 min-w-[120px] min-h-[52px] text-lg font-bold"
                />
              </div>
              {/* Turn: Left / Down / Right */}
              <div className="flex items-center gap-4">
                <MobileControlButton
                  label="←"
                  onPressStart={() => handleTouchStart("left")}
                  onPressEnd={() => handleTouchEnd("left")}
                  className="bg-amber-600/90 hover:bg-amber-500 active:bg-amber-400 text-white rounded-xl shadow-lg border-2 border-amber-400/50 w-14 h-14 text-2xl font-bold"
                />
                <MobileControlButton
                  label="↓"
                  onPressStart={() => handleTouchStart("down")}
                  onPressEnd={() => handleTouchEnd("down")}
                  className="bg-amber-600/90 hover:bg-amber-500 active:bg-amber-400 text-white rounded-xl shadow-lg border-2 border-amber-400/50 w-14 h-14 text-2xl font-bold"
                />
                <MobileControlButton
                  label="→"
                  onPressStart={() => handleTouchStart("right")}
                  onPressEnd={() => handleTouchEnd("right")}
                  className="bg-amber-600/90 hover:bg-amber-500 active:bg-amber-400 text-white rounded-xl shadow-lg border-2 border-amber-400/50 w-14 h-14 text-2xl font-bold"
                />
              </div>
            </div>
          )}

          {/* Controls Info - above D-pad on mobile */}
          <div
            className={`absolute left-2 z-20 ${isMobile ? "bottom-28" : "bottom-6 left-4"}`}
            style={isMobile ? { bottom: "calc(max(1rem, env(safe-area-inset-bottom, 0px) + 0.5rem) + 7rem)" } : undefined}
          >
            <div className={`bg-black/70 backdrop-blur-sm rounded-lg ${isMobile ? "px-2 py-1" : "px-3 py-1.5"} text-white text-xs`}>
              {isMobile ? "Hold RUN to move · ← → turn" : "Arrow keys to move"}
            </div>
          </div>

          {/* Camera toggle: bottom right, safe area on mobile */}
          <div
            className={`absolute z-30 right-3 ${isMobile ? "" : "bottom-6"}`}
            style={isMobile ? { bottom: "max(1rem, env(safe-area-inset-bottom, 0px) + 0.5rem)" } : undefined}
          >
            <button
              type="button"
              onClick={() => setCameraMode((m) => (m === "follow" ? "top" : "follow"))}
              className={`
                bg-black/80 backdrop-blur-sm text-white rounded-xl shadow-lg border border-white/20
                hover:bg-black/90 active:scale-95 flex items-center gap-1.5
                ${isMobile ? "px-3 py-2.5 min-h-[44px] text-sm" : "px-4 py-2.5 text-sm"}
              `}
              aria-label={cameraMode === "follow" ? "Switch to top view" : "Switch to follow view"}
            >
              <span className="text-lg leading-none" aria-hidden>{cameraMode === "follow" ? "📷" : "🛸"}</span>
              <span className="font-medium whitespace-nowrap">
                {cameraMode === "follow" ? "Top view" : "Follow view"}
              </span>
            </button>
          </div>
        </>
      )}

      {/* Win Screen */}
      {gameState === "won" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`bg-white rounded-2xl shadow-2xl ${isMobile ? 'p-6 mx-4' : 'p-8'} max-w-md w-full text-center`}>
            <div className={`${isMobile ? 'text-6xl' : 'text-7xl'} mb-4`}>🎉🏆</div>
            <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-800 mb-2`}>
              You Won!
            </div>
            <div className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600 mb-6`}>
              You survived {selectedTimeLevel} minutes without being caught!
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleReset}
                className={getButtonClasses('md')}
              >
                Play Again
              </button>
              <button
                onClick={onBack}
                className={getButtonClasses('md')}
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lose Screen */}
      {gameState === "lost" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`bg-white rounded-2xl shadow-2xl ${isMobile ? 'p-6 mx-4' : 'p-8'} max-w-md w-full text-center`}>
            <div className={`${isMobile ? 'text-6xl' : 'text-7xl'} mb-4`}>😱</div>
            <div className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-800 mb-2`}>
              Caught!
            </div>
            <div className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600 mb-6`}>
              The followers caught you! Try to survive longer next time!
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleReset}
                className={getButtonClasses('md')}
              >
                Try Again
              </button>
              <button
                onClick={onBack}
                className={getButtonClasses('md')}
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo - Top Center - Above timer */}
      <div className={`absolute ${isMobile ? 'top-2' : 'top-4'} left-1/2 transform -translate-x-1/2 z-50`}>
        <img 
          src="/logo.png" 
          alt="Khel Town Logo" 
          className={`${isMobile ? 'h-6' : 'h-8'} w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-200`}
        />
      </div>

      {/* Back/Quit button - Top Left */}
      {gameState === "playing" && (
        <div className={`absolute ${isMobile ? 'top-2 left-2' : 'top-4 left-4'} z-40`}>
          <button
            onClick={handleReset}
            className={getButtonClasses(isMobile ? 'min-h-[44px] min-w-[44px] p-2.5 justify-center' : 'md', 'flex items-center gap-2')}
            aria-label="Quit game"
          >
            {!isMobile && <span>Quit</span>}
          </button>
        </div>
      )}

      {/* Score/Rating - Top Right */}
      {gameState === "playing" && (
        <div className={`absolute ${isMobile ? 'top-2 right-2' : 'top-4 right-4'} z-40`}>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
            <span className="text-sm sm:text-base font-bold text-gray-800">Time: {Math.floor(timeRemaining)}s</span>
          </div>
        </div>
      )}

      {/* Instructions - Bottom Left */}
      {gameState === "playing" && (
        <div className={`absolute ${isMobile ? 'bottom-12 left-2' : 'bottom-16 left-4'} z-20`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="text-xs font-medium text-gray-700">
              Move to avoid followers
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
