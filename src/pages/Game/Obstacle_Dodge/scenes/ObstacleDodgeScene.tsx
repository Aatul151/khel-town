import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Avatar3D } from "../../../../components/Avatar3D";
import { AvatarType } from "../../../../components/AvatarSelector";
import { useIsMobile } from "../../../../hooks/useIsMobile";

interface Obstacle {
  id: number;
  position: [number, number, number];
  size: number;
}

interface ObstacleDodgeSceneProps {
  avatarType: AvatarType;
  playerLane: number; // 0 = left, 1 = center, 2 = right
  obstacles: Obstacle[];
  onCollision: () => void;
  onObstacleUpdate: (obstacles: Obstacle[]) => void;
  gameState: "playing" | "gameOver";
}

// Lane positions
const LANE_WIDTH = 2;
const LANE_POSITIONS = [-LANE_WIDTH, 0, LANE_WIDTH];

// Obstacle component
function ObstacleMesh({ 
  obstacle, 
  onRemove, 
  onPositionUpdate 
}: { 
  obstacle: Obstacle; 
  onRemove: () => void;
  onPositionUpdate: (id: number, position: [number, number, number]) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = 0.15; // Speed at which obstacles move toward player
  const currentPosition = useRef<[number, number, number]>([...obstacle.position]);

  // Initialize position - ensure obstacle is centered on lane marker
  useEffect(() => {
    if (meshRef.current) {
      // Align obstacle X position exactly with lane marker
      const laneX = obstacle.position[0];
      meshRef.current.position.set(laneX, obstacle.position[1], obstacle.position[2]);
      currentPosition.current = [laneX, obstacle.position[1], obstacle.position[2]];
    }
  }, [obstacle.position]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Move obstacle toward player (negative Z direction)
    meshRef.current.position.z -= speed;
    currentPosition.current[0] = meshRef.current.position.x;
    currentPosition.current[1] = meshRef.current.position.y;
    currentPosition.current[2] = meshRef.current.position.z;
    
    // Update position for collision detection
    onPositionUpdate(obstacle.id, currentPosition.current);

    // Remove obstacle if it's behind the player (earlier removal to prevent false collisions)
    if (meshRef.current.position.z < -12) {
      onRemove();
    }
  });

  return (
    <mesh ref={meshRef} position={obstacle.position} castShadow receiveShadow>
      <boxGeometry args={[obstacle.size, obstacle.size, obstacle.size]} />
      <meshStandardMaterial 
        color="#ef4444" 
        roughness={0.3} 
        metalness={0.1}
        emissive="#ff0000"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

// Player component with collision detection and instant lane transitions
function Player({
  lane,
  obstacles,
  obstaclePositions,
  onCollision,
  avatarType,
  gameState,
}: {
  lane: number;
  obstacles: Obstacle[];
  obstaclePositions: React.MutableRefObject<Map<number, [number, number, number]>>;
  onCollision: () => void;
  avatarType: AvatarType;
  gameState: "playing" | "gameOver";
}) {
  const playerGroupRef = useRef<THREE.Group>(null);
  const playerSize = 0.4; // Reduced collision radius for more forgiving detection
  const targetX = LANE_POSITIONS[lane];
  const playerZ = -8;
  const playerY = 0;
  const collisionChecked = useRef<Set<number>>(new Set()); // Track obstacles we've already collided with

  // Instant position update when lane changes (no animation)
  useEffect(() => {
    if (playerGroupRef.current) {
      playerGroupRef.current.position.set(targetX, playerY, playerZ);
      // Clear collision checks when changing lanes to allow fresh collision detection
      collisionChecked.current.clear();
    }
  }, [lane, targetX]);

  // Collision detection only (no position interpolation)
  useFrame(() => {
    if (!playerGroupRef.current || gameState !== "playing") return;

    // Get player bounding box with smaller collision radius for more forgiving detection
    const playerBox = new THREE.Box3().setFromObject(playerGroupRef.current);
    playerBox.expandByScalar(playerSize); // Use reduced playerSize for more forgiveness

    const currentPlayerX = playerGroupRef.current.position.x;

    for (const obstacle of obstacles) {
      const obstaclePos = obstaclePositions.current.get(obstacle.id);
      if (!obstaclePos) continue;

      // Skip obstacles we've already checked for collision (prevent multiple triggers)
      if (collisionChecked.current.has(obstacle.id)) {
        // Reset check if obstacle has passed behind player
        if (obstaclePos[2] < playerZ - 3) {
          collisionChecked.current.delete(obstacle.id);
        }
        continue;
      }

      // Only check obstacles that are near the player's Z position
      // Player is at z = -8, so only check obstacles between z = -10 and z = -6
      const zDistance = Math.abs(obstaclePos[2] - playerZ);
      if (zDistance > 2.5) continue; // Skip obstacles that are too far away

      // Only check if obstacle is actually at or slightly in front of player's position
      if (obstaclePos[2] < playerZ - 1.5) continue; // Skip obstacles that have already passed behind

      // Check if obstacle is in the same lane (with tolerance for lane width)
      const xDistance = Math.abs(obstaclePos[0] - currentPlayerX);
      if (xDistance > 1.2) continue; // Skip obstacles in different lanes

      // Create obstacle bounding box with slightly reduced size for more forgiveness
      const obstacleBox = new THREE.Box3(
        new THREE.Vector3(
          obstaclePos[0] - obstacle.size / 2 * 0.9, // Slightly smaller collision box
          obstaclePos[1] - obstacle.size / 2 * 0.9,
          obstaclePos[2] - obstacle.size / 2 * 0.9
        ),
        new THREE.Vector3(
          obstaclePos[0] + obstacle.size / 2 * 0.9,
          obstaclePos[1] + obstacle.size / 2 * 0.9,
          obstaclePos[2] + obstacle.size / 2 * 0.9
        )
      );

      if (playerBox.intersectsBox(obstacleBox)) {
        collisionChecked.current.add(obstacle.id);
        onCollision();
        break;
      }
    }
  });

  return (
    <group ref={playerGroupRef} position={[targetX, playerY, playerZ]}>
      {avatarType && (
        <group scale={[0.7, 0.7, 0.7]}>
          <Avatar3D
            avatarType={avatarType}
            position={[0, 0, 0]}
            targetPosition={null}
            onReachTarget={() => {}}
            isWalking={false}
            isKeyboardMoving={false}
            rotation={0}
          />
        </group>
      )}
    </group>
  );
}

// Camera controller
function CameraController({ isMobile, playerLane }: { isMobile: boolean; playerLane: number }) {
  const { camera } = useThree();

  useFrame(() => {
    // Third-person camera: positioned behind avatar (backside view)
    // Camera follows player with steeper angle to show less road
    const playerX = LANE_POSITIONS[playerLane];
    const playerZ = -8; // Player's Z position
    
    // Camera positioned behind avatar (original distance)
    // Higher up and behind to see the back of avatar with steeper angle
    const offsetY = isMobile ? 5 : 4.5; // Increased height for steeper angle
    const offsetZ = isMobile ? 4 : 3.5; // Distance behind player (original distance)
    
    camera.position.set(playerX, offsetY, playerZ - offsetZ);
    
    // Look down more steeply - focus closer to player to show less road
    // Lower lookAt point creates steeper angle, showing less road ahead
    const lookAheadDistance = 3; // Reduced further to show less road
    camera.lookAt(playerX, 0.5, playerZ + lookAheadDistance); // Lower Y (0.5) creates steeper angle
  });

  return null;
}

export function ObstacleDodgeScene({
  avatarType,
  playerLane,
  obstacles,
  onCollision,
  onObstacleUpdate,
  gameState,
}: ObstacleDodgeSceneProps) {
  const isMobile = useIsMobile();
  const [obstaclesState, setObstaclesState] = useState<Obstacle[]>(obstacles);
  const obstaclePositions = useRef<Map<number, [number, number, number]>>(new Map());
  const pendingUpdateRef = useRef<Obstacle[] | null>(null);

  // Update obstacles state when props change
  useEffect(() => {
    setObstaclesState(obstacles);
    // Initialize positions
    obstacles.forEach(obs => {
      obstaclePositions.current.set(obs.id, obs.position);
    });
  }, [obstacles]);

  // Sync obstacles state changes back to parent (only when obstacles are removed)
  useEffect(() => {
    if (pendingUpdateRef.current !== null) {
      const update = pendingUpdateRef.current;
      pendingUpdateRef.current = null;
      // Defer to next tick to avoid setState during render
      setTimeout(() => {
        onObstacleUpdate(update);
      }, 0);
    }
  }, [obstaclesState.length, onObstacleUpdate]); // Only depend on length to avoid unnecessary updates

  const handleObstaclePositionUpdate = (id: number, position: [number, number, number]) => {
    obstaclePositions.current.set(id, position);
  };

  const handleObstacleRemove = (id: number) => {
    obstaclePositions.current.delete(id);
    setObstaclesState((prev) => {
      const updated = prev.filter((obs) => obs.id !== id);
      // Store the update to be synced in useEffect
      pendingUpdateRef.current = updated;
      return updated;
    });
  };

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Lighting - increased for better visibility and shadows */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ffffff" />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#ffffff" />

      {/* Camera - narrower FOV for closer, more focused view */}
      <PerspectiveCamera makeDefault position={[0, 3.5, -11.5]} fov={isMobile ? 65 : 65} />
      <CameraController isMobile={isMobile} playerLane={playerLane} />

      {/* Floor/Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 100]} />
        <meshStandardMaterial color="#1f2937" roughness={0.8} />
      </mesh>

      {/* Lane markers - made taller and more visible */}
      {LANE_POSITIONS.map((x, index) => (
        <group key={index}>
          {/* Main lane line on the road */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
            <planeGeometry args={[0.15, 100]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </mesh>
        
        </group>
      ))}

      {/* Player */}
      {gameState === "playing" && avatarType && (
        <Player
          lane={playerLane}
          obstacles={obstaclesState}
          obstaclePositions={obstaclePositions}
          onCollision={onCollision}
          avatarType={avatarType}
          gameState={gameState}
        />
      )}

      {/* Obstacles - only show when playing */}
      {gameState === "playing" && obstaclesState.map((obstacle) => (
        <ObstacleMesh
          key={obstacle.id}
          obstacle={obstacle}
          onRemove={() => handleObstacleRemove(obstacle.id)}
          onPositionUpdate={handleObstaclePositionUpdate}
        />
      ))}

      {/* Background stars for better visibility */}
      {Array.from({ length: 100 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 200;
        const y = Math.random() * 50 + 10;
        const z = (Math.random() - 0.5) * 200;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
          </mesh>
        );
      })}

      {/* Environment for better lighting */}
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

