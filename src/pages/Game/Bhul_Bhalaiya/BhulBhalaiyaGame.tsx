import { useState, useCallback, useEffect } from "react";
import { MazeScene } from "./scenes/MazeScene";
import { getButtonClasses } from "../../../utils/buttonStyles";
import { playPhonicsAudio, stopAllAudio, playBackgroundMusic } from "../../../utils/audio";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useAvatarControls } from "../../../hooks/useAvatarControls";
import { AvatarType } from "../../../components/AvatarSelector";
import { usePlayer } from "../../../context/PlayerContext";
import { generateMaze, MAZE_ROWS, MAZE_COLS } from "./utils/mazeGenerator";
import { Countdown } from "../../../components/Countdown";

/** Win overlay with simple scale-in animation */
function WinModal({
  isMobile,
  onPlayAgain,
  onBack,
}: {
  isMobile: boolean;
  onPlayAgain: () => void;
  onBack: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={`bg-white rounded-2xl shadow-2xl ${isMobile ? "p-6 mx-4" : "p-8"} max-w-md w-full text-center transition-all duration-500 ease-out`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "scale(1)" : "scale(0.9)",
      }}
    >
      <div className={`${isMobile ? "text-6xl" : "text-7xl"} mb-4`}>🏆</div>
      <div className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold text-gray-800 mb-2`}>
        You found the way out!
      </div>
      <div className="text-amber-700 font-medium mb-6">Bhul Bhalaiya solved!</div>
      <div className="flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className={getButtonClasses('md')}
        >
          Play again (new maze)
        </button>
        <button
          onClick={onBack}
          className={getButtonClasses('md')}
        >
          Back to games
        </button>
      </div>
    </div>
  );
}

interface BhulBhalaiyaGameProps {
  avatar: AvatarType;
  onBack: () => void;
}

export function BhulBhalaiyaGame({ avatar, onBack }: BhulBhalaiyaGameProps) {
  const isMobile = useIsMobile();
  const { playerName } = usePlayer();
  const { direction, rotationDirection, isMoving, handleTouchStart, handleTouchEnd } = useAvatarControls();

  const [gameState, setGameState] = useState<"playing" | "won">("playing");
  const [maze, setMaze] = useState<number[][]>(() => generateMaze(MAZE_ROWS, MAZE_COLS));
  const [showCountdown, setShowCountdown] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle countdown completion
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    setGameStarted(true);
  }, []);

  useEffect(() => {
    if (gameState === "playing" && gameStarted) playBackgroundMusic();
    return () => stopAllAudio();
  }, [gameState, gameStarted]);

  const handleReachExit = useCallback(() => {
    setGameState("won");
    stopAllAudio();
    playPhonicsAudio("", `Congratulations ${playerName || "Player"}! You found the way out!`);
  }, [playerName]);

  const handlePlayAgain = useCallback(() => {
    setMaze(generateMaze(MAZE_ROWS, MAZE_COLS));
    setGameState("playing");
    setShowCountdown(true);
    setGameStarted(false);
  }, []);

  const handleTouchGesture = useCallback(
    (action: "up" | "down" | "left" | "right") => {
      if (!gameStarted) return;
      if (action === "up") {
        handleTouchStart("up");
      } else {
        handleTouchStart(action);
        setTimeout(() => handleTouchEnd(action), 50);
      }
    },
    [handleTouchStart, handleTouchEnd, gameStarted]
  );

  useEffect(() => {
    const onTouchEnd = () => handleTouchEnd("up");
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [handleTouchEnd]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-amber-100 to-amber-200 overflow-hidden">
      {/* Countdown */}
      {showCountdown && (
        <Countdown onComplete={handleCountdownComplete} />
      )}
      {gameState === "playing" && gameStarted && (
        <div className="absolute inset-0">
          <MazeScene
            maze={maze}
            avatarType={avatar}
            onReachExit={handleReachExit}
            direction={direction}
            rotationDirection={rotationDirection}
            isMoving={isMoving}
            onTouchGesture={isMobile ? handleTouchGesture : undefined}
          />
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div className={`absolute ${isMobile ? "top-3 left-3" : "top-4 left-4"} z-20`}>
            <div className="bg-amber-800/90 text-amber-100 rounded-xl px-3 py-2 shadow-lg text-sm font-medium">
              Find the green exit!
            </div>
          </div>

          {/* Back Button - Top Left */}
          <div className={`absolute ${isMobile ? "top-2 left-2" : "top-4 left-4"} z-40`}>
            <button
              onClick={onBack}
              className={getButtonClasses('md', 'flex items-center gap-2')}
              aria-label="Back"
            >
              {!isMobile && <span>Back</span>}
            </button>
          </div>

          {/* Instructions - Bottom Left */}
          <div className={`absolute ${isMobile ? "bottom-12 left-2" : "bottom-16 left-4"} z-20`}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="text-xs font-medium text-gray-700">
                {isMobile ? "Swipe to turn • Hold to move forward" : "WASD or Arrow keys: move • Find the green exit"}
              </div>
            </div>
          </div>
        </>
      )}

      {gameState === "won" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <WinModal isMobile={isMobile} onPlayAgain={handlePlayAgain} onBack={onBack} />
        </div>
      )}

      {/* Logo - Top Center */}
      <div className={`absolute ${isMobile ? 'top-2' : 'top-4'} left-1/2 transform -translate-x-1/2 z-50`}>
        <img 
          src="/logo.png" 
          alt="Khel Town Logo" 
          className={`${isMobile ? 'h-6' : 'h-8'} w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-200`}
        />
      </div>


      {/* Instructions - Bottom Left */}
      {gameState === "playing" && (
        <div className={`absolute ${isMobile ? 'bottom-12 left-2' : 'bottom-16 left-4'} z-20`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            {isMobile ? (
              <div className="text-xs font-medium text-gray-700">
                Swipe to move, find the exit
              </div>
            ) : (
              <div className="text-xs font-medium text-gray-700">
                Arrow Keys: Move | Find the exit
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
