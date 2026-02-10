import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";
import { Avatar3D } from "../../../../components/Avatar3D";
import { AvatarType } from "../../../../components/AvatarSelector";
import { useAvatarControls } from "../../../../hooks/useAvatarControls";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { playWalkingSound, stopWalkingSound } from "../../../../utils/audio";
import { getStartCell, getExitCell, MAZE_ROWS, MAZE_COLS } from "../utils/mazeGenerator";

/** Larger = more space between walls (wider corridors). Increase for more room to walk. */
const CELL_SIZE = 4.5;
const WALL_HEIGHT = 3;
const WALL_THICKNESS = 0.1;

/** Convert grid (row, col) to world (x, z). Center of maze at origin. */
function gridToWorld(row: number, col: number): [number, number] {
  const R = 2 * MAZE_ROWS + 1;
  const C = 2 * MAZE_COLS + 1;
  const z = (row - (R - 1) / 2) * CELL_SIZE;
  const x = (col - (C - 1) / 2) * CELL_SIZE;
  return [x, z];
}

/** Convert world (x, z) to grid (row, col) */
function worldToGrid(x: number, z: number): [number, number] {
  const R = 2 * MAZE_ROWS + 1;
  const C = 2 * MAZE_COLS + 1;
  const row = Math.round(z / CELL_SIZE + (R - 1) / 2);
  const col = Math.round(x / CELL_SIZE + (C - 1) / 2);
  return [row, col];
}

interface MazeSceneProps {
  maze: number[][];
  avatarType: AvatarType;
  onReachExit: () => void;
  direction?: "up" | "down" | "left" | "right" | null;
  rotationDirection?: "left" | "right" | "down" | null;
  isMoving?: boolean;
  onTouchGesture?: (action: "up" | "down" | "left" | "right") => void;
}

export function MazeScene({
  maze,
  avatarType,
  onReachExit,
  direction: externalDirection = null,
  rotationDirection: externalRotationDirection = null,
  isMoving: externalIsMoving = false,
  onTouchGesture,
}: MazeSceneProps) {
  const isMobile = useIsMobile();
  const internalControls = useAvatarControls();
  const direction = externalDirection !== null ? externalDirection : internalControls.direction;
  const rotationDirection = externalRotationDirection !== null ? externalRotationDirection : internalControls.rotationDirection;
  const isMoving = externalIsMoving !== false ? externalIsMoving : internalControls.isMoving;

  const [startX, startZ] = gridToWorld(getStartCell()[0], getStartCell()[1]);
  const AVATAR_Y_OFFSET = 0.15; // Raise avatar so legs aren't cut off
  const [avatarPosition, setAvatarPosition] = useState<[number, number, number]>([startX, AVATAR_Y_OFFSET, startZ]);
  const [avatarRotation, setAvatarRotation] = useState<number>(0);
  const [isAvatarMoving, setIsAvatarMoving] = useState(false);

  const R = maze.length;
  const C = maze[0]?.length ?? 0;
  const [exitRow, exitCol] = getExitCell(MAZE_ROWS, MAZE_COLS);
  const [exitX, exitZ] = gridToWorld(exitRow, exitCol);

  /** Only the cell under the avatar center must be path (0). No margin check so we don't treat path cells as blocked. */
  function canMoveTo(worldX: number, worldZ: number): boolean {
    const [row, col] = worldToGrid(worldX, worldZ);
    if (row < 0 || row >= R || col < 0 || col >= C) return false;
    return maze[row][col] === 0;
  }

  // Rotation
  useEffect(() => {
    if (!rotationDirection) return;
    if (rotationDirection === "down") {
      setAvatarRotation((prev) => ((prev + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI));
      return;
    }
    if (rotationDirection === "right") {
      setAvatarRotation((prev) => ((prev - Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI));
      return;
    }
    if (rotationDirection === "left") {
      setAvatarRotation((prev) => ((prev + Math.PI / 2) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI));
      return;
    }
  }, [rotationDirection]);

  // Movement
  useEffect(() => {
    const wasMoving = isAvatarMoving;
    setIsAvatarMoving(isMoving && direction === "up");

    if (isMoving && direction === "up" && !wasMoving) playWalkingSound();
    else if ((!isMoving || direction !== "up") && wasMoving) stopWalkingSound();

    if (direction !== "up" || !isMoving) return;

    const interval = setInterval(() => {
      setAvatarPosition((prev) => {
        const [x, , z] = prev;
        const speed = 0.12;
        const newX = x + Math.sin(avatarRotation) * speed;
        const newZ = z + Math.cos(avatarRotation) * speed;

        if (!canMoveTo(newX, newZ)) {
          if (canMoveTo(newX, z)) return [newX, AVATAR_Y_OFFSET, z];
          if (canMoveTo(x, newZ)) return [x, AVATAR_Y_OFFSET, newZ];
          return prev;
        }

        // Check exit
        const [er, ec] = worldToGrid(newX, newZ);
        if (er === exitRow && ec === exitCol) {
          onReachExit();
        }

        return [newX, AVATAR_Y_OFFSET, newZ];
      });
    }, 16);
    return () => clearInterval(interval);
  }, [direction, isMoving, avatarRotation, onReachExit, exitRow, exitCol]);

  // Touch
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isGestureActive = useRef(false);
  const isTouchHolding = useRef(false);

  useEffect(() => {
    if (!isMobile || !onTouchGesture) return;

    const handleTouchStart = (e: TouchEvent) => {
      const t = (e.target as HTMLElement);
      if (t.closest("button") || t.closest("a")) return;
      const touch = e.touches[0];
      if (touch) {
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        isGestureActive.current = true;
        isTouchHolding.current = false;
        setTimeout(() => {
          if (isGestureActive.current && !isTouchHolding.current) {
            isTouchHolding.current = true;
            onTouchGesture("up");
          }
        }, 150);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isGestureActive.current || !touchStartPos.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      const dx = touch.clientX - touchStartPos.current.x;
      const dy = touch.clientY - touchStartPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 40) {
        isTouchHolding.current = false;
        if (Math.abs(dx) > Math.abs(dy)) onTouchGesture(dx > 0 ? "right" : "left");
        else if (dy > 0) onTouchGesture("down");
      }
    };

    const handleTouchEnd = () => {
      isGestureActive.current = false;
      isTouchHolding.current = false;
      touchStartPos.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isMobile, onTouchGesture]);

  // Camera: behind the avatar (third-person back view), not from above
  function CameraController({
    avatarPosition,
    avatarRotation,
    isMobile,
  }: {
    avatarPosition: [number, number, number];
    avatarRotation: number;
    isMobile: boolean;
  }) {
    const { camera } = useThree();
    const targetPos = useRef(new THREE.Vector3());
    const currentPos = useRef(new THREE.Vector3());
    const camRot = useRef(avatarRotation);
    const init = useRef(false);

    useEffect(() => {
      camRot.current = avatarRotation;
      const oy = isMobile ? 2.5 : 2;       // Closer height above avatar
      const od = isMobile ? 4 : 3;       // Closer distance behind avatar
      const cx = avatarPosition[0] - od * Math.sin(avatarRotation);
      const cz = avatarPosition[2] - od * Math.cos(avatarRotation);
      const v = new THREE.Vector3(cx, avatarPosition[1] + oy, cz);
      camera.position.copy(v);
      currentPos.current.copy(v);
      camera.lookAt(avatarPosition[0], avatarPosition[1] + 1, avatarPosition[2]);
      init.current = true;
    }, [avatarRotation, avatarPosition, isMobile]);

    useFrame(() => {
      if (!init.current) return;
      camRot.current += ((avatarRotation - camRot.current) % (2 * Math.PI)) * 0.12;
      const oy = isMobile ? 2.5 : 2;       // Closer height above avatar
      const od = isMobile ? 4 : 3;       // Closer distance behind avatar
      targetPos.current.set(
        avatarPosition[0] - od * Math.sin(avatarRotation),
        avatarPosition[1] + oy,
        avatarPosition[2] - od * Math.cos(avatarRotation)
      );
      currentPos.current.lerp(targetPos.current, 0.1);
      camera.position.copy(currentPos.current);
      camera.lookAt(avatarPosition[0], avatarPosition[1] + 1, avatarPosition[2]);
    });
    return null;
  }

  return (
    <Canvas shadows gl={{ antialias: true, alpha: true }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[20, 15, 10]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={80}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <pointLight position={[0, 15, 0]} intensity={0.4} color="#fff8e7" />

      <PerspectiveCamera makeDefault position={[startX - 4, 4, startZ - 4]} fov={isMobile ? 75 : 65} />
      <CameraController avatarPosition={avatarPosition} avatarRotation={avatarRotation} isMobile={isMobile} />

      {/* Sky */}
      <mesh>
        <sphereGeometry args={[150, 32, 32]} />
        <meshStandardMaterial color="#87ceeb" side={THREE.BackSide} />
      </mesh>

      {/* Ground - light brown textured path style */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[C * CELL_SIZE + 10, R * CELL_SIZE + 10]} />
        <meshStandardMaterial color="#c4a574" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Maze walls - vibrant colorful gradient */}
      {maze.map((row, i) =>
        row.map((cell, j) => {
          if (cell === 0) return null;
          const [wx, wz] = gridToWorld(i, j);
          // Colorful gradient: varies by position for visual interest
          const distFromCenter = Math.sqrt((i - R / 2) ** 2 + (j - C / 2) ** 2);
          const maxDist = Math.sqrt((R / 2) ** 2 + (C / 2) ** 2);
          const t = distFromCenter / maxDist;
          const angle = Math.atan2(i - R / 2, j - C / 2);
          
          // Create a colorful gradient: warm colors (orange, yellow, pink, coral)
          // Mix based on distance and angle for variety
          const hue = (angle + Math.PI) / (2 * Math.PI) * 360; // 0-360 based on angle
          const saturation = 60 + t * 20; // 60-80%
          const lightness = 70 - t * 15; // 70-55%
          
          // Convert HSL to RGB for vibrant colors
          const h = hue / 360;
          const s = saturation / 100;
          const l = lightness / 100;
          const c = (1 - Math.abs(2 * l - 1)) * s;
          const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
          const m = l - c / 2;
          let r = 0, g = 0, b = 0;
          if (h < 1/6) { r = c; g = x; b = 0; }
          else if (h < 2/6) { r = x; g = c; b = 0; }
          else if (h < 3/6) { r = 0; g = c; b = x; }
          else if (h < 4/6) { r = 0; g = x; b = c; }
          else if (h < 5/6) { r = x; g = 0; b = c; }
          else { r = c; g = 0; b = x; }
          
          const color = `rgb(${Math.floor((r + m) * 255)}, ${Math.floor((g + m) * 255)}, ${Math.floor((b + m) * 255)})`;
          
          // Unique number for each wall: row-col format (e.g., "5-7") or sequential
          const wallNumber = `${i}-${j}`;
          
          return (
            <group key={`${i}-${j}`} position={[wx, 0, wz]}>
              <mesh position={[0, WALL_HEIGHT / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[CELL_SIZE + WALL_THICKNESS, WALL_HEIGHT, CELL_SIZE + WALL_THICKNESS]} />
                <meshStandardMaterial
                  color={color}
                  roughness={0.5}
                  metalness={0.15}
                  emissive={color}
                  emissiveIntensity={0.1}
                />
              </mesh>
              {/* Number label on side of wall - visible from side view */}
              <Text
                position={[0, WALL_HEIGHT / 2, (CELL_SIZE + WALL_THICKNESS) / 2 + 0.15]}
                fontSize={1.2}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.2}
                outlineColor="#000000"
              >
                {wallNumber}
              </Text>
            </group>
          );
        })
      )}

      {/* Exit: glowing / colored marker (low-poly) */}
      <pointLight position={[exitX, 1.2, exitZ]} color="#22c55e" intensity={2} distance={4} decay={2} />
      <mesh position={[exitX, 0.35, exitZ]} receiveShadow castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 12]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#166534"
          emissiveIntensity={0.8}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      <Avatar3D
        avatarType={avatarType}
        position={avatarPosition}
        targetPosition={null}
        onReachTarget={() => {}}
        isWalking={false}
        isKeyboardMoving={isAvatarMoving}
        rotation={avatarRotation}
      />

      <Suspense fallback={null}>
        <Environment preset="park" />
      </Suspense>
    </Canvas>
  );
}
