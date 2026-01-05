import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { MatchGrid } from "../components/MatchGrid";
import { CircularMatchGrid } from "../components/CircularMatchGrid";
import { Celebration } from "../components/Celebration";
import { LetterData } from "../components/LetterBox";
import { useIsMobile } from "../../../../hooks/useIsMobile";

type LayoutType = "grid" | "circular" | "spiral" | "hexagonal";

interface LetterMatchSceneProps {
  letters: LetterData[];
  selectedId: number | null;
  matchedIds: number[];
  onLetterClick: (id: number) => void;
  showCelebration: boolean;
  onCelebrationComplete: () => void;
  isShaking?: boolean;
  revealedIds?: number[];
  matchedPairs?: Map<number, string>;
  layoutType?: LayoutType;
}

export function LetterMatchScene({
  letters,
  selectedId,
  matchedIds,
  onLetterClick,
  showCelebration,
  onCelebrationComplete,
  isShaking = false,
  revealedIds = [],
  matchedPairs = new Map(),
  layoutType = "circular", // Default to circular for more interactivity
}: LetterMatchSceneProps) {
  const isMobile = useIsMobile();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // Handle window resize for responsive updates
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Adjust camera position for mobile
  const cameraPosition: [number, number, number] = isMobile || windowSize.width < 640
    ? [0, 4, 10] // Closer and lower for mobile
    : [0, 5, 12];
  
  const cameraFov = isMobile || windowSize.width < 640 ? 60 : 50; // Wider FOV for mobile
  
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower DPR on mobile for performance
    >
      {/* Camera Setup */}
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, 10, -5]} intensity={0.4} />

      {/* Environment for better lighting */}
      <Environment preset="sunset" />

      {/* Camera Controls - Zoom enabled for better interaction */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={isMobile ? 6 : 8} // Minimum zoom distance
        maxDistance={isMobile ? 20 : 25} // Maximum zoom distance
        minPolarAngle={isMobile ? Math.PI / 3.5 : Math.PI / 3}
        maxPolarAngle={isMobile ? Math.PI / 2.5 : Math.PI / 2.2}
        minAzimuthAngle={isMobile ? -Math.PI / 6 : -Math.PI / 4}
        maxAzimuthAngle={isMobile ? Math.PI / 6 : Math.PI / 4}
        target={[0, 0, 0]}
        zoomSpeed={0.8} // Slightly slower zoom for better control
      />

      {/* Match Grid - Switch between layouts */}
      {layoutType === "grid" ? (
        <MatchGrid
          letters={letters}
          selectedId={selectedId}
          matchedIds={matchedIds}
          onLetterClick={onLetterClick}
          isShaking={isShaking}
          revealedIds={revealedIds}
          matchedPairs={matchedPairs}
        />
      ) : (
        <CircularMatchGrid
          letters={letters}
          selectedId={selectedId}
          matchedIds={matchedIds}
          onLetterClick={onLetterClick}
          isShaking={isShaking}
          revealedIds={revealedIds}
          matchedPairs={matchedPairs}
          layoutType={layoutType}
        />
      )}

      {/* Celebration Animation */}
      {showCelebration && (
        <Celebration onComplete={onCelebrationComplete} />
      )}
    </Canvas>
  );
}

