import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { AlphabetGrid } from "../components/AlphabetGrid";
import { StarReward } from "../../../../components/StarReward";
import { ObjectModel } from "../../../../components/ObjectModel";
import { Avatar3D } from "../../../../components/Avatar3D";
import { LearningItem } from "../../../../data/types";
import { AvatarType } from "../../../../components/AvatarSelector";
import { useAvatarControls } from "../../../../hooks/useAvatarControls";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { playWalkingSound, stopWalkingSound } from "../../../../utils/audio";

interface AlphabetStreetProps {
  items: LearningItem[];
  onItemClick: (item: LearningItem, position: [number, number, number]) => void;
  showStar: boolean;
  starPosition: [number, number, number] | null;
  onStarComplete: () => void;
  showObject: boolean;
  objectPosition: [number, number, number] | null;
  objectModelPath: string | null;
  avatarType: AvatarType | null;
  avatarTarget: [number, number, number] | null;
  onAvatarReachTarget: () => void;
  completedItems: string[];
  avatarPosition?: [number, number, number]; // Initial position (optional, will be managed internally)
  onBoxPositionsUpdate?: (positions: Map<string, [number, number, number]>) => void;
  shuffleKey?: number;
  onAvatarPositionChange?: (position: [number, number, number]) => void; // Callback for position updates
  currentMode?: string; // For collision detection
  boxPositions?: Map<string, [number, number, number]>; // For collision detection
  completedItemsForCollision?: string[]; // For collision detection to skip completed items
  // Avatar controls from parent
  direction?: "up" | "down" | "left" | "right" | null;
  rotationDirection?: "left" | "right" | "down" | null;
  isMoving?: boolean;
}

export function AlphabetStreet({
  items,
  onItemClick,
  showStar,
  starPosition,
  onStarComplete,
  showObject,
  objectPosition,
  objectModelPath,
  avatarType,
  avatarTarget,
  onAvatarReachTarget,
  completedItems,
  avatarPosition: initialAvatarPosition = [0, 0, -20], // Start outside front of grid
  onBoxPositionsUpdate,
  shuffleKey = 0,
  onAvatarPositionChange,
  currentMode = "alphabet",
  boxPositions = new Map(),
  completedItemsForCollision = [],
  direction: externalDirection = null,
  rotationDirection: externalRotationDirection = null,
  isMoving: externalIsMoving = false,
}: AlphabetStreetProps) {
  // Navigation management - use external controls if provided, otherwise use internal hook
  const internalControls = useAvatarControls();
  const direction = externalDirection !== null ? externalDirection : internalControls.direction;
  const rotationDirection = externalRotationDirection !== null ? externalRotationDirection : internalControls.rotationDirection;
  const isMoving = externalIsMoving !== false ? externalIsMoving : internalControls.isMoving;
  const isMobile = useIsMobile();
  
  // Internal state for avatar position and rotation
  const [internalAvatarPosition, setInternalAvatarPosition] = useState<[number, number, number]>(initialAvatarPosition);
  const [internalAvatarRotation, setInternalAvatarRotation] = useState<number>(0);
  const [internalIsAvatarMoving, setInternalIsAvatarMoving] = useState(false);

  // Use internal state for avatar position and rotation
  const avatarPosition = internalAvatarPosition;
  const avatarRotation = internalAvatarRotation;
  const isAvatarMoving = internalIsAvatarMoving;

  // Navigation Management Functions - Natural avatar navigation
  // Left/Right/Down: Rotate avatar direction AND set camera behind avatar immediately
  // Up: Move forward in facing direction

  useEffect(() => {
    if (!rotationDirection) {
      return;
    }

    // Handle rotation keys - set avatar direction and camera position immediately
    if (rotationDirection === "down") {
      // Down: rotate 180 degrees (turn around)
      setInternalAvatarRotation(prev => {
        const normalized = ((prev % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const newRotation = normalized + Math.PI;
        // Camera will update automatically via useEffect dependency on avatarRotation
        return newRotation;
      });
      return;
    } else if (rotationDirection === "right") {
      // Right: rotate 90 degrees counter-clockwise
      setInternalAvatarRotation(prev => {
        const normalized = ((prev % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const newRotation = normalized - Math.PI / 2;
        // Camera will update automatically via useEffect dependency on avatarRotation
        return newRotation;
      });
      return;
    } else if (rotationDirection === "left") {
      // Left: rotate 90 degrees clockwise
      setInternalAvatarRotation(prev => {
        const normalized = ((prev % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const newRotation = normalized + Math.PI / 2;
        // Camera will update automatically via useEffect dependency on avatarRotation
        return newRotation;
      });
      return;
    }
    // Up key doesn't change rotation (only moves forward)
  }, [rotationDirection]);

  // Handle avatar forward movement with up key - moves in direction avatar is facing
  useEffect(() => {
    const wasMoving = internalIsAvatarMoving;
    setInternalIsAvatarMoving(isMoving && direction === "up");

    // Play/stop walking sound
    if (isMoving && direction === "up" && !wasMoving) {
      playWalkingSound();
    } else if ((!isMoving || direction !== "up") && wasMoving) {
      stopWalkingSound();
    }

    if (direction !== "up" || !isMoving) {
      return;
    }

    const interval = setInterval(() => {
      setInternalAvatarPosition(prev => {
        let [x, y, z] = prev;
        const moveSpeed = 0.2;

        // Calculate forward movement based on avatar's rotation
        // Avatar rotation angle: 0 = facing +Z (forward), PI/2 = facing +X (right), etc.
        let newX = x + Math.sin(internalAvatarRotation) * moveSpeed;
        let newZ = z + Math.cos(internalAvatarRotation) * moveSpeed;

        // Collision detection with alphabet boxes (only in alphabet mode)
        if (currentMode === "alphabet" && boxPositions.size > 0) {
          const boxSize = 3.5; // Box is 3.5x3.5 units (updated for larger boxes)
          const avatarRadius = 0.3; // Avatar collision radius
          const minDistance = boxSize / 2 + avatarRadius;

          let canMove = true;
          boxPositions.forEach(([boxX, , boxZ], itemId) => {
            // Skip collision check for completed items
            if (completedItemsForCollision.includes(itemId)) return;

            const distance = Math.sqrt(
              Math.pow(newX - boxX, 2) + Math.pow(newZ - boxZ, 2)
            );

            if (distance < minDistance) {
              canMove = false;
            }
          });

          if (!canMove) {
            // Can't move, keep previous position
            return prev;
          }
        }

        // Keep avatar within bounds (calculated based on grid size and spacing)
        // For 6x6 grid with spacing of 9: max position is (5 - 2.5) * 9 = 22.5
        // Add buffer for avatar movement around boxes (box size 3.5 + some margin)
        if (currentMode === "alphabet") {
          const gridSize = 6;
          const spacing = 9;
          const boxSize = 3.5;
          const buffer = boxSize / 2 + 2; // Allow movement around boxes but limit going too far
          
          // Calculate actual grid bounds
          const maxRow = gridSize - 1;
          const maxCol = gridSize - 1;
          const maxX = (maxCol - (gridSize - 1) / 2) * spacing + buffer;
          const maxZ = (maxRow - (gridSize - 1) / 2) * spacing + buffer;
          const minX = -maxX;
          const minZ = -maxZ;
          
          newX = Math.max(minX, Math.min(maxX, newX));
          newZ = Math.max(minZ, Math.min(maxZ, newZ));
        } else {
          // For other modes, use default bounds
          const gridBounds = 15;
          newX = Math.max(-gridBounds, Math.min(gridBounds, newX));
          newZ = Math.max(-gridBounds, Math.min(gridBounds, newZ));
        }

        const newPosition: [number, number, number] = [newX, y, newZ];

        return newPosition;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [direction, isMoving, internalAvatarRotation, currentMode, boxPositions, onAvatarPositionChange, completedItemsForCollision]);

  // Notify parent of position changes (useEffect to avoid setState during render)
  useEffect(() => {
    if (onAvatarPositionChange) {
      onAvatarPositionChange(internalAvatarPosition);
    }
  }, [internalAvatarPosition, onAvatarPositionChange]);

  // Reset position when shuffleKey changes (game reset)
  useEffect(() => {
    setInternalAvatarPosition([0, 0, -20]);
    setInternalAvatarRotation(0);
  }, [shuffleKey]);


  // Camera controller component that follows avatar
  // Camera always stays behind avatar, smoothly following rotation
  function CameraController({
    avatarPosition,
    avatarRotation,
    isMobile
  }: {
    avatarPosition: [number, number, number];
    avatarRotation: number;
    isMobile: boolean;
  }) {
    const { camera } = useThree();
    const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3());
    const currentCameraPos = useRef<THREE.Vector3>(new THREE.Vector3());
    const initialized = useRef(false);
    const lastAvatarPos = useRef<[number, number, number]>(avatarPosition);
    const cameraRotation = useRef<number>(0); // Track camera's rotation (smoothly follows avatar)

    // Initialize camera position based on avatar position
    useEffect(() => {
      // Initialize camera rotation to match avatar rotation
      cameraRotation.current = avatarRotation;

      // Calculate camera position behind avatar
      // Mobile: increased zoom out for better view
      const offsetY = isMobile ? 4 : 3; // Height above avatar (slightly higher on mobile)
      const offsetDistance = isMobile ? 8 : 5; // Distance behind avatar (much further on mobile)

      // Calculate offset based on avatar rotation
      const cosAngle = Math.cos(avatarRotation);
      const sinAngle = Math.sin(avatarRotation);
      const rotatedOffsetX = -offsetDistance * sinAngle;
      const rotatedOffsetZ = -offsetDistance * cosAngle;

      const initialPos = new THREE.Vector3(
        avatarPosition[0] + rotatedOffsetX,
        avatarPosition[1] + offsetY,
        avatarPosition[2] + rotatedOffsetZ
      );

      camera.position.copy(initialPos);
      currentCameraPos.current.copy(initialPos);
      camera.lookAt(avatarPosition[0], avatarPosition[1] + 1, avatarPosition[2]);
      initialized.current = true;
    }, [avatarRotation, avatarPosition, isMobile]);

    useFrame(() => {
      if (initialized.current) {
        // Smoothly interpolate camera rotation to match avatar rotation
        // This creates smooth camera movement when avatar rotates left/right
        const currentNormalized = ((cameraRotation.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const targetNormalized = ((avatarRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

        // Calculate shortest rotation path
        let diff = targetNormalized - currentNormalized;
        if (diff > Math.PI) diff -= 2 * Math.PI;
        if (diff < -Math.PI) diff += 2 * Math.PI;

        // Smooth interpolation - camera follows avatar rotation smoothly
        cameraRotation.current += diff * 0.15; // Smooth rotation speed

        // Normalize the result
        cameraRotation.current = ((cameraRotation.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

        // Calculate camera offset - ALWAYS positioned behind avatar
        // Use actual avatar rotation (not interpolated) to ensure camera is always behind
        // Mobile: increased zoom out for better view
        const offsetY = isMobile ? 4 : 3; // Height above avatar (slightly higher on mobile)
        const offsetDistance = isMobile ? 8 : 5; // Distance behind avatar (much further on mobile)

        // Rotate the offset based on avatar's actual facing direction
        // This ensures camera stays behind avatar when avatar turns
        const cosAngle = Math.cos(avatarRotation);
        const sinAngle = Math.sin(avatarRotation);

        // Apply rotation to offset (rotate around Y axis)
        // When avatar faces forward (angle=0, towards +Z), camera is behind at -Z
        // When avatar turns, camera rotates around avatar to stay behind
        // Behind means opposite direction of avatar's facing
        const rotatedOffsetX = -offsetDistance * sinAngle; // Behind = opposite of forward X
        const rotatedOffsetZ = -offsetDistance * cosAngle; // Behind = opposite of forward Z

        // Calculate target camera position (behind avatar)
        targetPosition.current.set(
          avatarPosition[0] + rotatedOffsetX,
          avatarPosition[1] + offsetY,
          avatarPosition[2] + rotatedOffsetZ
        );

        // Smoothly interpolate camera position - faster response
        currentCameraPos.current.lerp(targetPosition.current, 0.15);
        camera.position.copy(currentCameraPos.current);

        // Camera always looks at avatar position (focus on avatar)
        camera.lookAt(avatarPosition[0], avatarPosition[1] + 1, avatarPosition[2]);

        // Update last position
        lastAvatarPos.current = avatarPosition;
      }
    });

    return null;
  }

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Lighting setup for kid-friendly, colorful scene */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#fff5e1" />

      {/* Camera with dynamic position - will be controlled by CameraController */}
      <PerspectiveCamera
        makeDefault
        position={[0, 12, 2]}
        fov={isMobile ? 75 : 65}
      />

      {/* Camera controller that follows avatar */}
      <CameraController
        avatarPosition={avatarPosition}
        avatarRotation={internalAvatarRotation}
        isMobile={isMobile}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>

      {/* Learning item buildings - grid layout */}
      <AlphabetGrid
        items={items}
        onItemClick={onItemClick}
        completedItems={completedItems}
        avatarPosition={avatarPosition || [0, 0, -20]}
        onBoxPositionUpdate={onBoxPositionsUpdate}
        shuffleKey={shuffleKey}
      />

      {/* 3D Avatar */}
      {avatarType && (
        <Avatar3D
          avatarType={avatarType}
          position={avatarPosition}
          targetPosition={avatarTarget}
          onReachTarget={onAvatarReachTarget}
          isWalking={avatarTarget !== null}
          isKeyboardMoving={isAvatarMoving}
          onRotationChange={undefined} // Don't update camera rotation from avatar movement
          rotation={avatarRotation}
        />
      )}

      {/* Star reward animation */}
      {showStar && starPosition && (
        <StarReward position={starPosition} onComplete={onStarComplete} />
      )}

      {/* Object model when letter is clicked */}
      {showObject && objectPosition && objectModelPath && (
        <Suspense fallback={null}>
          <ObjectModel
            modelPath={objectModelPath}
            position={objectPosition}
            scale={1.5}
          />
        </Suspense>
      )}

      {/* Environment for better lighting */}
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}

