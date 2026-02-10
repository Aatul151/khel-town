import { useState, useCallback, useEffect } from "react";
import { MazeScene } from "./scenes/MazeScene";
import { playPhonicsAudio, stopAllAudio, playBackgroundMusic } from "../../../utils/audio";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useAvatarControls } from "../../../hooks/useAvatarControls";
import { AvatarType } from "../../../components/AvatarSelector";
import { usePlayer } from "../../../context/PlayerContext";
import { generateMaze, MAZE_ROWS, MAZE_COLS } from "./utils/mazeGenerator";

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
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
        >
          Play again (new maze)
        </button>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg"
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

  useEffect(() => {
    if (gameState === "playing") playBackgroundMusic();
    return () => stopAllAudio();
  }, [gameState]);

  const handleReachExit = useCallback(() => {
    setGameState("won");
    stopAllAudio();
    playPhonicsAudio("", `Congratulations ${playerName || "Player"}! You found the way out!`);
  }, [playerName]);

  const handlePlayAgain = useCallback(() => {
    setMaze(generateMaze(MAZE_ROWS, MAZE_COLS));
    setGameState("playing");
    playBackgroundMusic();
  }, []);

  const handleTouchGesture = useCallback(
    (action: "up" | "down" | "left" | "right") => {
      if (action === "up") {
        handleTouchStart("up");
      } else {
        handleTouchStart(action);
        setTimeout(() => handleTouchEnd(action), 50);
      }
    },
    [handleTouchStart, handleTouchEnd]
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
      {gameState === "playing" && (
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

          <div className={`absolute ${isMobile ? "top-3 right-12" : "top-4 right-4"} z-20`}>
            <button
              onClick={onBack}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {!isMobile && <span>Back</span>}
            </button>
          </div>

          <div className={`absolute bottom-4 left-4 right-4 z-20 flex justify-center`}>
            <div className="bg-black/50 text-white rounded-lg px-4 py-2 text-xs text-center">
              {isMobile ? "Swipe to turn • Hold to move forward" : "WASD or Arrow keys: move • Find the green exit"}
            </div>
          </div>
        </>
      )}

      {gameState === "won" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <WinModal isMobile={isMobile} onPlayAgain={handlePlayAgain} onBack={onBack} />
        </div>
      )}
    </div>
  );
}
