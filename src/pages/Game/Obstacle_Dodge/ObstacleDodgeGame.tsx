import { useState, useEffect, useRef, useCallback } from "react";
import { ObstacleDodgeScene } from "./scenes/ObstacleDodgeScene";
import { AvatarType } from "../../../components/AvatarSelector";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { stopAllAudio, playBackgroundMusic } from "../../../utils/audio";

interface ObstacleDodgeGameProps {
  avatar: AvatarType;
  onBack: () => void;
}

interface Obstacle {
  id: number;
  position: [number, number, number];
  size: number;
}

export function ObstacleDodgeGame({ avatar, onBack }: ObstacleDodgeGameProps) {
  const isMobile = useIsMobile();
  const [gameState, setGameState] = useState<"playing" | "gameOver">("playing");
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(0); // X position: -1, 0, or 1 (left, center, right lane)
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const gameStartTime = useRef<number>(Date.now());
  const animationFrameRef = useRef<number>();
  const lastObstacleSpawnTime = useRef<number>(Date.now());
  const keysPressed = useRef<Set<string>>(new Set());
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Lane positions (3 lanes: left, center, right)
  const LANE_WIDTH = 2;
  const LANE_POSITIONS = [-LANE_WIDTH, 0, LANE_WIDTH];

  // Handle keyboard input for left/right movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(e.key)) {
        e.preventDefault();
      }

      keysPressed.current.add(e.key);

      if (gameState === "playing") {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          // Left key: move to left side of screen
          // Swapped: increase index to move left visually
          setPlayerPosition((prev) => Math.min(2, prev + 1));
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          // Right key: move to right side of screen
          // Swapped: decrease index to move right visually
          setPlayerPosition((prev) => Math.max(0, prev - 1));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [gameState]);

  const spawnObstacle = useCallback(() => {
    // Spawn only ONE obstacle in ONE random lane at a time
    const lane = Math.floor(Math.random() * 3); // Random lane (0, 1, or 2)
    const x = LANE_POSITIONS[lane];
    const z = 12; // Start closer for more urgent, engaging gameplay
    const size = 0.8 + Math.random() * 0.4; // Random size between 0.8 and 1.2
    const y = size / 2; // Position on ground (ground is at y=0, so obstacle center should be at size/2)

    setObstacles((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        position: [x, y, z],
        size,
      },
    ]);
  }, []);

  // Spawn initial obstacle in one lane when game starts
  useEffect(() => {
    if (gameState === "playing" && obstacles.length === 0) {
      // Spawn only ONE obstacle in ONE random lane
      const lane = Math.floor(Math.random() * 3);
      const x = LANE_POSITIONS[lane];
      const z = 12;
      const size = 0.8 + Math.random() * 0.4;
      const y = size / 2;
      
      setObstacles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          position: [x, y, z],
          size,
        },
      ]);
    }
  }, [gameState, obstacles.length]);

  // Game loop: timer and ensure all lanes always have obstacles
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = () => {
      const now = Date.now();
      const elapsed = (now - gameStartTime.current) / 1000;
      setCurrentTime(elapsed);

      // Ensure at least one obstacle is visible (spawn one if none visible)
      setObstacles((currentObstacles) => {
        const visibleObstacles = currentObstacles.filter(
          (obs) => obs.position[2] > -12 // Match obstacle removal threshold
        );
        
        // If no obstacles visible, spawn one in a random lane
        if (visibleObstacles.length === 0 && now - lastObstacleSpawnTime.current >= 300) {
          const lane = Math.floor(Math.random() * 3);
          const x = LANE_POSITIONS[lane];
          const z = 12;
          const size = 0.8 + Math.random() * 0.4;
          const y = size / 2;
          
          lastObstacleSpawnTime.current = now;
          return [
            ...currentObstacles,
            {
              id: Date.now() + Math.random(),
              position: [x, y, z],
              size,
            },
          ];
        }

        return currentObstacles;
      });

      // Spawn obstacles more frequently (every 0.8 seconds) - spawns in random lane
      const spawnInterval = 800;
      if (now - lastObstacleSpawnTime.current >= spawnInterval) {
        spawnObstacle();
        lastObstacleSpawnTime.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, spawnObstacle]);

  const playFailureSound = () => {
    // Create a failure sound using Web Audio API
    if ("AudioContext" in window || "webkitAudioContext" in window) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      
      // Create a descending tone for failure
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
      oscillator.type = "sawtooth";
      
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    // Also use TTS to say "Failed"
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("Failed");
      utterance.rate = 0.8;
      utterance.pitch = 0.7;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCollision = useCallback(() => {
    if (gameState === "playing") {
      setGameState("gameOver");
      setTotalTime(currentTime);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Play failure sound
      playFailureSound();
    }
  }, [gameState, currentTime]);

  // Start background music when component mounts
  useEffect(() => {
    playBackgroundMusic();

    return () => {
      // Stop all audio when component unmounts (when navigating away)
      stopAllAudio();
    };
  }, []);

  const handleRestart = () => {
    setGameState("playing");
    setCurrentTime(0);
    setTotalTime(0);
    setPlayerPosition(0);
    setObstacles([]);
    gameStartTime.current = Date.now();
    lastObstacleSpawnTime.current = Date.now();
    // Spawn initial obstacle in one lane on restart
    setTimeout(() => {
      const lane = Math.floor(Math.random() * 3);
      const x = LANE_POSITIONS[lane];
      const z = 12;
      const size = 0.8 + Math.random() * 0.4;
      const y = size / 2;
      
      setObstacles((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          position: [x, y, z],
          size,
        },
      ]);
    }, 100);
  };

  const handleObstacleUpdate = useCallback((updatedObstacles: Obstacle[]) => {
    setObstacles(updatedObstacles);
  }, []);

  // Mobile touch controls for swiping left/right
  useEffect(() => {
    if (!isMobile || gameState !== "playing") return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent default to avoid scrolling
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = touch.clientY - touchStartY.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Minimum swipe distance (in pixels)
      const minSwipeDistance = 50;

      // Only register horizontal swipes (more horizontal than vertical)
      if (absDeltaX > minSwipeDistance && absDeltaX > absDeltaY) {
        if (deltaX > 0) {
          // Swipe right - move to right lane (swapped to match keyboard)
          setPlayerPosition((prev) => Math.max(0, prev - 1));
        } else {
          // Swipe left - move to left lane (swapped to match keyboard)
          setPlayerPosition((prev) => Math.min(2, prev + 1));
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, gameState]);

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <ObstacleDodgeScene
          avatarType={avatar}
          playerLane={playerPosition}
          obstacles={obstacles}
          onCollision={handleCollision}
          onObstacleUpdate={handleObstacleUpdate}
          gameState={gameState}
        />
      </div>

      {/* Timer Display */}
      {gameState === "playing" && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-6 py-3 shadow-2xl border-2 border-yellow-400">
            <div className="text-yellow-400 text-sm font-semibold mb-1 text-center">Current Time</div>
            <div className="text-white text-3xl font-bold text-center font-mono">
              {formatTime(currentTime)}
            </div>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === "gameOver" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-4xl font-bold text-red-600 mb-4">FAILED</h2>
              <div className="text-xl text-gray-700 mb-2">Total Time Played</div>
              <div className="text-3xl font-bold text-gray-900 mb-6 font-mono">
                {formatTime(totalTime)}
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
                >
                  Restart
                </button>
                <button
                  onClick={onBack}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      {gameState === "playing" && (
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={onBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
            aria-label="Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>
      )}

      {/* Controls Instructions */}
      {gameState === "playing" && (
        <div className={`absolute ${isMobile ? 'bottom-4 left-2 right-2' : 'bottom-4 left-4'} z-20`}>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            {isMobile ? (
              <div className="text-xs font-medium text-gray-700">
                Swipe left/right to dodge obstacles
              </div>
            ) : (
              <div className="text-xs font-medium text-gray-700">
                Arrow Keys / A/D: Move Left/Right
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

