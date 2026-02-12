import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Avatar3D } from "../../../../components/Avatar3D";
import { FollowerAvatar3D, FollowerAvatarType } from "../../../../components/FollowerAvatar3D";
import { AvatarType } from "../../../../components/AvatarSelector";
import { useAvatarControls } from "../../../../hooks/useAvatarControls";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { playWalkingSound, stopWalkingSound } from "../../../../utils/audio";

/** Generate obstacles randomly with spacing - smaller obstacles, not too close to each other */
function generateObstacles(count: number, bounds: number, minSpacing: number): [number, number, number, number][] {
  const obstacles: [number, number, number, number][] = [];
  const maxAttempts = 100;
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let placed = false;
    
    while (!placed && attempts < maxAttempts) {
      // Random position within bounds (leave some margin)
      const margin = 5;
      const cx = (Math.random() * 2 - 1) * (bounds - margin);
      const cz = (Math.random() * 2 - 1) * (bounds - margin);
      
      // Smaller obstacles: random size between 1.0 and 1.8 (halfWidth/halfDepth)
      const hw = 0.8 + Math.random() * 1.0; // 0.8 to 1.8
      const hd = 0.8 + Math.random() * 1.0; // 0.8 to 1.8
      
      // Check if this obstacle is far enough from existing ones
      let tooClose = false;
      for (const [exCx, exCz, exHw, exHd] of obstacles) {
        const dist = Math.sqrt((cx - exCx) ** 2 + (cz - exCz) ** 2);
        const minDist = minSpacing + Math.max(hw, hd) + Math.max(exHw, exHd);
        if (dist < minDist) {
          tooClose = true;
          break;
        }
      }
      
      // Also ensure not too close to center (spawn area)
      const distFromCenter = Math.sqrt(cx ** 2 + cz ** 2);
      if (!tooClose && distFromCenter > 3) {
        obstacles.push([cx, cz, hw, hd]);
        placed = true;
      }
      
      attempts++;
    }
  }
  
  return obstacles;
}

const PLAYGROUND_BOUNDS = 100; // Much larger playground
const OBSTACLE_COUNT = 4; // Reduced from 10 to 4
const MIN_OBSTACLE_SPACING = 8; // Minimum distance between obstacles
const AVATAR_RADIUS = 0.5;

function pointCollidesObstacle(px: number, pz: number, radius: number, obstacles: [number, number, number, number][]): boolean {
  for (const [cx, cz, hw, hd] of obstacles) {
    const closestX = Math.max(cx - hw, Math.min(cx + hw, px));
    const closestZ = Math.max(cz - hd, Math.min(cz + hd, pz));
    const distSq = (px - closestX) ** 2 + (pz - closestZ) ** 2;
    if (distSq < radius * radius) return true;
  }
  return false;
}

function canMoveTo(x: number, z: number, radius: number, obstacles: [number, number, number, number][]): boolean {
  if (Math.abs(x) > PLAYGROUND_BOUNDS || Math.abs(z) > PLAYGROUND_BOUNDS) return false;
  return !pointCollidesObstacle(x, z, radius, obstacles);
}

/** Follower behavior types for variety */
type FollowerBehavior = "direct" | "sprint_burst" | "zigzag" | "patient" | "aggressive";

interface FollowerConfig {
  speedMultiplier: number;
  behavior: FollowerBehavior;
  /** 0–1, adds random nudge to direction */
  unpredictability: number;
}

export type CameraMode = "follow" | "top";

interface PlaygroundSceneProps {
  avatarType: AvatarType;
  avatarPosition: [number, number, number];
  onAvatarPositionChange: (position: [number, number, number]) => void;
  followerCount: number;
  followerAvatarTypes: FollowerAvatarType[];
  onGameOver: () => void;
  onFollowerDistanceChange: (distances: number[]) => void;
  direction?: "up" | "down" | "left" | "right" | null;
  rotationDirection?: "left" | "right" | "down" | null;
  isMoving?: boolean;
  onTouchGesture?: (action: "up" | "down" | "left" | "right") => void;
  /** Called when touch ends so movement/rotation can stop (e.g. handleTouchEnd) */
  onTouchGestureEnd?: (action: "up" | "down" | "left" | "right") => void;
  /** "follow" = third-person behind avatar, "top" = top-down view */
  cameraMode?: CameraMode;
  /** Enable/disable follower movement - followers only start following after player moves */
  enableFollower?: boolean;
  /** Optional callback to report follower positions for minimap */
  onFollowerPositionsChange?: (positions: [number, number, number][]) => void;
  /** Optional callback to report avatar rotation for minimap */
  onAvatarRotationChange?: (rotation: number) => void;
}

/** Red warning circle indicator that appears below avatar when follower is near */
function WarningCircle({ position, intensity }: { position: [number, number, number]; intensity: number }) {
  const circleRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  useFrame(() => {
    if (circleRef.current) {
      pulseRef.current += 0.1 + (intensity * 0.15);
      const scale = 1 + Math.sin(pulseRef.current) * 0.2 * intensity;
      circleRef.current.scale.set(scale, scale, 1);
      
      const material = circleRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.3 + (intensity * 0.7);
      material.emissiveIntensity = intensity * 2;
    }
  });

  return (
    <mesh ref={circleRef} position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <ringGeometry args={[0.8, 1.2, 32]} />
      <meshStandardMaterial
        color="#ff0000"
        emissive="#ff0000"
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function PlaygroundScene({
  avatarType,
  avatarPosition: initialAvatarPosition,
  onAvatarPositionChange,
  followerCount,
  followerAvatarTypes,
  onGameOver,
  onFollowerDistanceChange,
  direction: externalDirection = null,
  rotationDirection: externalRotationDirection = null,
  isMoving: externalIsMoving = false,
  onTouchGesture,
  onTouchGestureEnd,
  cameraMode = "follow",
  enableFollower = true,
  onFollowerPositionsChange,
  onAvatarRotationChange,
}: PlaygroundSceneProps) {
  const isMobile = useIsMobile();
  const internalControls = useAvatarControls();
  const direction = externalDirection !== null ? externalDirection : internalControls.direction;
  const rotationDirection = externalRotationDirection !== null ? externalRotationDirection : internalControls.rotationDirection;
  const isMoving = externalIsMoving !== false ? externalIsMoving : internalControls.isMoving;

  // Generate obstacles randomly each game session
  const [obstacles] = useState<[number, number, number, number][]>(() => 
    generateObstacles(OBSTACLE_COUNT, PLAYGROUND_BOUNDS, MIN_OBSTACLE_SPACING)
  );

  // Avatar state
  const [internalAvatarPosition, setInternalAvatarPosition] = useState<[number, number, number]>(initialAvatarPosition);
  const [internalAvatarRotation, setInternalAvatarRotation] = useState<number>(0);
  const [internalIsAvatarMoving, setInternalIsAvatarMoving] = useState(false);

  // Per-follower config: different speed and behavior so they don't all act the same
  const followerConfigsRef = useRef<FollowerConfig[] | null>(null);
  const lastFollowerCountRef = useRef<number>(-1);
  
  // Initialize or update follower configs when count changes
  if (followerConfigsRef.current === null || lastFollowerCountRef.current !== followerCount) {
    // Determine how many aggressive followers based on total count
    let aggressiveCount = 0;
    if (followerCount === 3) {
      aggressiveCount = 1;
    } else if (followerCount === 5) {
      aggressiveCount = 1;
    } else if (followerCount === 10) {
      aggressiveCount = 2;
    } else if (followerCount === 15) {
      aggressiveCount = 3;
    }
    
    // Other behaviors to distribute
    const otherBehaviors: FollowerBehavior[] = ["direct", "sprint_burst", "zigzag", "patient"];
    
    followerConfigsRef.current = Array.from({ length: followerCount }, (_, i) => {
      let behavior: FollowerBehavior;
      // Assign aggressive to first N followers
      if (i < aggressiveCount) {
        behavior = "aggressive";
      } else {
        // Distribute other behaviors among remaining followers
        behavior = otherBehaviors[(i - aggressiveCount) % otherBehaviors.length];
      }
      
      return {
        speedMultiplier: 0.055 + (i % 3) * 0.03 + (i * 0.008),
        behavior: behavior,
        unpredictability: 0.05 + (i % 4) * 0.08,
      };
    });
    lastFollowerCountRef.current = followerCount;
  }
  const followerConfigs = followerConfigsRef.current;

  const followerBehaviorState = useRef<{ burstUntil: number; zigzagPhase: number }[]>(
    Array.from({ length: followerCount }, () => ({ burstUntil: 0, zigzagPhase: 0 }))
  );

  function getInitialFollowerPositions(count: number): [number, number, number][] {
    const positions: [number, number, number][] = [];
    // Start followers much further away from player (minimum 30 units, spread out)
    const minRadius = 30;
    const maxRadius = 60;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (i * 0.5);
      // Distribute followers between minRadius and maxRadius
      const radius = minRadius + ((i / Math.max(1, count - 1)) * (maxRadius - minRadius));
      positions.push([Math.sin(angle) * radius, 0, Math.cos(angle) * radius]);
    }
    return positions;
  }

  // Follower state lives only in refs; one game loop updates them and forces re-render via gameLoopTick (fixes followers not moving while player moves)
  const [gameLoopTick, setGameLoopTick] = useState(0);
  void gameLoopTick; // consumed so setGameLoopTick(t+1) triggers re-render and we read latest refs
  const followerPositionsRef = useRef<[number, number, number][]>(getInitialFollowerPositions(followerCount));
  const followerRotationsRef = useRef<number[]>(new Array(followerCount).fill(0));
  const minFollowerDistanceRef = useRef(100);

  const avatarPosition = internalAvatarPosition;
  const avatarRotation = internalAvatarRotation;
  const isAvatarMoving = internalIsAvatarMoving;

  const avatarPositionRef = useRef(avatarPosition);
  avatarPositionRef.current = avatarPosition;
  const directionRef = useRef(direction);
  const isMovingRef = useRef(isMoving);
  const avatarRotationRef = useRef(internalAvatarRotation);
  directionRef.current = direction;
  isMovingRef.current = isMoving;
  avatarRotationRef.current = internalAvatarRotation;

  // Reset follower refs when follower count changes (e.g. new game)
  useEffect(() => {
    followerPositionsRef.current = getInitialFollowerPositions(followerCount);
    followerRotationsRef.current = new Array(followerCount).fill(0);
    minFollowerDistanceRef.current = 100;
    // Reset configs so they get regenerated with new count
    followerConfigsRef.current = null;
    lastFollowerCountRef.current = -1;
  }, [followerCount]);

  // Handle avatar rotation
  useEffect(() => {
    if (!rotationDirection) return;

    if (rotationDirection === "down") {
      setInternalAvatarRotation(prev => {
        const normalized = ((prev % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return normalized + Math.PI;
      });
      return;
    } else if (rotationDirection === "right") {
      setInternalAvatarRotation(prev => {
        const normalized = ((prev % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return normalized - Math.PI / 2;
      });
      return;
    } else if (rotationDirection === "left") {
      setInternalAvatarRotation(prev => {
        const normalized = ((prev % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        return normalized + Math.PI / 2;
      });
      return;
    }
  }, [rotationDirection]);

  // Report avatar rotation changes for minimap
  useEffect(() => {
    if (onAvatarRotationChange) {
      onAvatarRotationChange(internalAvatarRotation);
    }
  }, [internalAvatarRotation, onAvatarRotationChange]);

  // Walking sound when movement starts/stops
  useEffect(() => {
    const wasMoving = internalIsAvatarMoving;
    setInternalIsAvatarMoving(isMoving && direction === "up");

    if (isMoving && direction === "up" && !wasMoving) {
      playWalkingSound();
    } else if ((!isMoving || direction !== "up") && wasMoving) {
      stopWalkingSound();
    }
  }, [isMoving, direction]);

  // Notify parent of position changes
  useEffect(() => {
    onAvatarPositionChange(internalAvatarPosition);
  }, [internalAvatarPosition, onAvatarPositionChange]);

  // Touch gesture handlers for mobile: hold = walk forward, swipe = rotate
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const isGestureActive = useRef<boolean>(false);
  const gestureDirection = useRef<"up" | "down" | "left" | "right" | null>(null);
  const isTouchHolding = useRef<boolean>(false);
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Last action we sent so we can call onTouchGestureEnd with the same action when touch ends */
  const lastGestureActionRef = useRef<"up" | "down" | "left" | "right" | null>(null);

  useEffect(() => {
    if (!isMobile || !onTouchGesture) return;

    const clearHoldTimeout = () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('[role="button"]') || target.closest('[data-mobile-controls]')) {
        return;
      }
      e.preventDefault();

      const touch = e.touches[0];
      if (touch) {
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        isGestureActive.current = true;
        gestureDirection.current = null;
        isTouchHolding.current = false;
        lastGestureActionRef.current = null;
        clearHoldTimeout();

        holdTimeoutRef.current = setTimeout(() => {
          holdTimeoutRef.current = null;
          if (isGestureActive.current && !gestureDirection.current) {
            isTouchHolding.current = true;
            lastGestureActionRef.current = "up";
            onTouchGesture("up");
          }
        }, 150);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isGestureActive.current || !touchStartPos.current) return;

      const touch = e.touches[0];
      if (!touch) return;

      const deltaX = touch.clientX - touchStartPos.current.x;
      const deltaY = touch.clientY - touchStartPos.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      const minSwipeDistance = 40;

      if (distance > minSwipeDistance) {
        clearHoldTimeout();
        if (isTouchHolding.current) {
          isTouchHolding.current = false;
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          gestureDirection.current = deltaX > 0 ? "right" : "left";
          lastGestureActionRef.current = gestureDirection.current;
          onTouchGesture(gestureDirection.current);
        } else {
          if (deltaY < 0) {
            gestureDirection.current = "up";
          } else {
            gestureDirection.current = "down";
          }
          lastGestureActionRef.current = gestureDirection.current;
          onTouchGesture(gestureDirection.current);
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isGestureActive.current) return;

      clearHoldTimeout();
      if (isTouchHolding.current) {
        isTouchHolding.current = false;
      }

      const lastAction = lastGestureActionRef.current;
      if (lastAction && onTouchGestureEnd) {
        onTouchGestureEnd(lastAction);
      }
      lastGestureActionRef.current = null;
      touchStartPos.current = null;
      isGestureActive.current = false;
      gestureDirection.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      clearHoldTimeout();
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isMobile, onTouchGesture, onTouchGestureEnd]);

  // Single game loop: update player and all followers in the same tick (refs only for followers), then one setState(tick) so both move together every frame
  useEffect(() => {
    const interval = setInterval(() => {
      const dir = directionRef.current;
      const moving = isMovingRef.current;
      const rot = avatarRotationRef.current;
      let [ax, ay, az] = avatarPositionRef.current;

      // 1) Update player position if moving (aggressive mode: faster so followers don't catch easily)
      if (moving && dir === "up") {
        const moveSpeed = 0.3;
        let newX = ax + Math.sin(rot) * moveSpeed;
        let newZ = az + Math.cos(rot) * moveSpeed;
        newX = Math.max(-PLAYGROUND_BOUNDS, Math.min(PLAYGROUND_BOUNDS, newX));
        newZ = Math.max(-PLAYGROUND_BOUNDS, Math.min(PLAYGROUND_BOUNDS, newZ));

        let next: [number, number, number] = [ax, ay, az];
        if (canMoveTo(newX, newZ, AVATAR_RADIUS, obstacles)) {
          next = [newX, ay, newZ];
        } else if (canMoveTo(newX, az, AVATAR_RADIUS, obstacles)) {
          next = [newX, ay, az];
        } else if (canMoveTo(ax, newZ, AVATAR_RADIUS, obstacles)) {
          next = [ax, ay, newZ];
        }
        avatarPositionRef.current = next;
        setInternalAvatarPosition(next);
        ax = next[0];
        az = next[2];
      }

      // 2) Update all followers (each has its own ref-backed position; we read/write refs only, then force one re-render)
      const now = Date.now();
      const prevPositions = followerPositionsRef.current;
      const newPositions: [number, number, number][] = [];
      const newRotations: number[] = [];
      const newDistances: number[] = [];

      for (let index = 0; index < prevPositions.length; index++) {
        const followerPos = prevPositions[index];
        const [fx, fy, fz] = followerPos;

        const dx = ax - fx;
        const dz = az - fz;
        const distance = Math.sqrt(dx * dx + dz * dz);
        newDistances.push(distance);

        // Only move followers if enabled (player has started moving)
        if (!enableFollower) {
          // Keep followers in place, but still track distance for UI
          newPositions.push(followerPos);
          newRotations.push(followerRotationsRef.current[index] ?? 0);
          continue;
        }

        if (distance < 1.2) {
          queueMicrotask(() => onGameOver());
          newPositions.push(followerPos);
          newRotations.push(followerRotationsRef.current[index] ?? 0);
          continue;
        }

        const cfg = followerConfigs[index];
        const state = followerBehaviorState.current[index];

        let targetRotation = Math.atan2(dx, dz);
        if (cfg.behavior === "zigzag") {
          state.zigzagPhase += 0.15;
          targetRotation += Math.sin(state.zigzagPhase) * 0.4;
        }
        newRotations.push(targetRotation);

        if (distance < 0.2) {
          newPositions.push(followerPos);
          continue;
        }

        let speed = cfg.speedMultiplier;
        if (cfg.behavior === "sprint_burst") {
          if (now > state.burstUntil) {
            state.burstUntil = now + 800 + Math.random() * 400;
          }
          if (state.burstUntil > now) speed *= 1.8;
        } else if (cfg.behavior === "aggressive") {
          speed *= 1.25;
          if (distance < 6) speed *= 1.2;
        } else if (cfg.behavior === "patient") {
          speed *= 0.85;
          if (distance > 15) speed *= 0.7;
        }

        const nudge = (Math.random() - 0.5) * 2 * cfg.unpredictability;
        const dirX = dx / distance + nudge;
        const dirZ = dz / distance + (Math.random() - 0.5) * cfg.unpredictability;
        const len = Math.sqrt(dirX * dirX + dirZ * dirZ) || 1;
        const ndx = dirX / len;
        const ndz = dirZ / len;

        let newFx = fx + ndx * speed;
        let newFz = fz + ndz * speed;
        newFx = Math.max(-PLAYGROUND_BOUNDS, Math.min(PLAYGROUND_BOUNDS, newFx));
        newFz = Math.max(-PLAYGROUND_BOUNDS, Math.min(PLAYGROUND_BOUNDS, newFz));

        const followerRadius = 0.5;
        let pushed = false;
        if (canMoveTo(newFx, newFz, followerRadius, obstacles)) {
          newPositions.push([newFx, fy, newFz]);
          pushed = true;
        } else if (canMoveTo(newFx, fz, followerRadius, obstacles)) {
          newPositions.push([newFx, fy, fz]);
          pushed = true;
        } else if (canMoveTo(fx, newFz, followerRadius, obstacles)) {
          newPositions.push([fx, fy, newFz]);
          pushed = true;
        } else {
          const perpX = -ndz * speed;
          const perpZ = ndx * speed;
          if (canMoveTo(fx + perpX, fz, followerRadius, obstacles)) {
            newPositions.push([fx + perpX, fy, fz]);
            pushed = true;
          } else if (canMoveTo(fx - perpX, fz, followerRadius, obstacles)) {
            newPositions.push([fx - perpX, fy, fz]);
            pushed = true;
          } else if (canMoveTo(fx, fz + perpZ, followerRadius, obstacles)) {
            newPositions.push([fx, fy, fz + perpZ]);
            pushed = true;
          } else if (canMoveTo(fx, fz - perpZ, followerRadius, obstacles)) {
            newPositions.push([fx, fy, fz - perpZ]);
            pushed = true;
          }
        }
        if (!pushed) newPositions.push(followerPos);
      }

      if (newPositions.length === followerCount && newRotations.length === followerCount && newDistances.length === followerCount) {
        followerPositionsRef.current = newPositions;
        followerRotationsRef.current = newRotations;
        const minDist = Math.min(...newDistances);
        minFollowerDistanceRef.current = minDist;
        queueMicrotask(() => onFollowerDistanceChange(newDistances));
        if (onFollowerPositionsChange) {
          queueMicrotask(() => onFollowerPositionsChange(newPositions));
        }
        setGameLoopTick(t => t + 1);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onGameOver, onFollowerDistanceChange, followerCount, obstacles, enableFollower, onFollowerPositionsChange]);

  // Camera controller: follow (third-person) or top-down view
  function CameraController({
    avatarPosition,
    avatarRotation,
    isMobile,
    cameraMode: mode,
  }: {
    avatarPosition: [number, number, number];
    avatarRotation: number;
    isMobile: boolean;
    cameraMode: CameraMode;
  }) {
    const { camera } = useThree();
    const targetPosition = useRef<THREE.Vector3>(new THREE.Vector3());
    const currentCameraPos = useRef<THREE.Vector3>(new THREE.Vector3());
    const initialized = useRef(false);
    const cameraRotation = useRef<number>(0);

    useEffect(() => {
      cameraRotation.current = avatarRotation;
      if (mode === "top") {
        const topHeight = isMobile ? 35 : 30;
        const pos = new THREE.Vector3(avatarPosition[0], topHeight, avatarPosition[2]);
        camera.position.copy(pos);
        currentCameraPos.current.copy(pos);
        camera.lookAt(avatarPosition[0], 0, avatarPosition[2]);
      } else {
        const offsetY = isMobile ? 4 : 3;
        const offsetDistance = isMobile ? 8 : 5;
        const cosAngle = Math.cos(avatarRotation);
        const sinAngle = Math.sin(avatarRotation);
        const initialPos = new THREE.Vector3(
          avatarPosition[0] - offsetDistance * sinAngle,
          avatarPosition[1] + offsetY,
          avatarPosition[2] - offsetDistance * cosAngle
        );
        camera.position.copy(initialPos);
        currentCameraPos.current.copy(initialPos);
        camera.lookAt(avatarPosition[0], avatarPosition[1] + 1, avatarPosition[2]);
      }
      initialized.current = true;
    }, [avatarRotation, avatarPosition, isMobile, mode]);

    useFrame(() => {
      if (!initialized.current) return;

      if (mode === "top") {
        const topHeight = isMobile ? 35 : 30;
        targetPosition.current.set(avatarPosition[0], topHeight, avatarPosition[2]);
        currentCameraPos.current.lerp(targetPosition.current, 0.1);
        camera.position.copy(currentCameraPos.current);
        camera.lookAt(avatarPosition[0], 0, avatarPosition[2]);
        return;
      }

      const currentNormalized = ((cameraRotation.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const targetNormalized = ((avatarRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      let diff = targetNormalized - currentNormalized;
      if (diff > Math.PI) diff -= 2 * Math.PI;
      if (diff < -Math.PI) diff += 2 * Math.PI;
      cameraRotation.current += diff * 0.15;
      cameraRotation.current = ((cameraRotation.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      const offsetY = isMobile ? 4 : 3;
      const offsetDistance = isMobile ? 8 : 5;
      const cosAngle = Math.cos(avatarRotation);
      const sinAngle = Math.sin(avatarRotation);
      targetPosition.current.set(
        avatarPosition[0] - offsetDistance * sinAngle,
        avatarPosition[1] + offsetY,
        avatarPosition[2] - offsetDistance * cosAngle
      );
      currentCameraPos.current.lerp(targetPosition.current, 0.15);
      camera.position.copy(currentCameraPos.current);
      camera.lookAt(avatarPosition[0], avatarPosition[1] + 1, avatarPosition[2]);
    });

    return null;
  }

  // Calculate minimum distance for warning circle
  const minDistance = minFollowerDistanceRef.current;

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#fff5e1" />

      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={[0, 12, 2]}
        fov={isMobile ? 75 : 65}
      />

      <CameraController
        avatarPosition={avatarPosition}
        avatarRotation={avatarRotation}
        isMobile={isMobile}
        cameraMode={cameraMode}
      />

      {/* Sky */}
      <mesh>
        <sphereGeometry args={[200, 32, 32]} />
        <meshStandardMaterial 
          color="#87ceeb" 
          side={THREE.BackSide}
          fog={false}
        />
      </mesh>

      {/* Stadium: outer ground (dirt/sand tone) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]} receiveShadow>
        <planeGeometry args={[PLAYGROUND_BOUNDS * 4, PLAYGROUND_BOUNDS * 4]} />
        <meshStandardMaterial color="#a0826d" roughness={0.95} metalness={0} />
      </mesh>

      {/* Stadium: running track ring around the field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]} receiveShadow>
        <ringGeometry args={[PLAYGROUND_BOUNDS * 0.85, PLAYGROUND_BOUNDS * 1.1, 64]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.47, 0]} receiveShadow>
        <ringGeometry args={[PLAYGROUND_BOUNDS * 0.8, PLAYGROUND_BOUNDS * 0.88, 64]} />
        <meshStandardMaterial color="#c4b5a0" roughness={0.9} metalness={0} />
      </mesh>

      {/* Stadium: inner field (pitch) - main play area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[PLAYGROUND_BOUNDS * 1.7, PLAYGROUND_BOUNDS * 1.7]} />
        <meshStandardMaterial color="#5a9e37" roughness={0.9} metalness={0} />
      </mesh>

      {/* Stadium: simple stands / bleachers at edges (low-poly) */}
      {[[-PLAYGROUND_BOUNDS * 1.15, 0], [PLAYGROUND_BOUNDS * 1.15, 0], [0, -PLAYGROUND_BOUNDS * 1.15], [0, PLAYGROUND_BOUNDS * 1.15]].map(([x, z], i) => (
        <group key={`stand-${i}`} position={[x, 0, z]} rotation={[0, (i * Math.PI / 2), 0]}>
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[PLAYGROUND_BOUNDS * 0.5, 2, 8]} />
            <meshStandardMaterial color="#6b7280" roughness={0.7} metalness={0.2} />
          </mesh>
          <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[PLAYGROUND_BOUNDS * 0.48, 1, 7.5]} />
            <meshStandardMaterial color="#4b5563" roughness={0.7} metalness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Stadium: light towers at corners */}
      {[[-PLAYGROUND_BOUNDS * 1.05, -PLAYGROUND_BOUNDS * 1.05], [PLAYGROUND_BOUNDS * 1.05, -PLAYGROUND_BOUNDS * 1.05], [PLAYGROUND_BOUNDS * 1.05, PLAYGROUND_BOUNDS * 1.05], [-PLAYGROUND_BOUNDS * 1.05, PLAYGROUND_BOUNDS * 1.05]].map(([lx, lz], i) => (
        <group key={`light-${i}`} position={[lx, 0, lz]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 12, 0.8]} />
            <meshStandardMaterial color="#374151" metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 6, 0]}>
            <boxGeometry args={[1.5, 0.4, 1.5]} />
            <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.6} />
          </mesh>
          <pointLight position={[0, 6, 0]} color="#fff8e1" intensity={0.8} distance={25} decay={2} />
        </group>
      ))}

      {/* Center circle line (decorative) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
        <ringGeometry args={[4.8, 5, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>

      {/* Obstacles - randomly placed, smaller, spaced apart */}
      {obstacles.map(([cx, cz, hw, hd], i) => (
        <group key={i} position={[cx, 0, cz]}>
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[hw * 2, 2, hd * 2]} />
            <meshStandardMaterial color={i % 3 === 0 ? "#8b4513" : i % 3 === 1 ? "#4a5568" : "#6b7280"} />
          </mesh>
        </group>
      ))}

      {/* Removed decorative props - obstacles are now randomly placed */}

      {/* Main Avatar */}
      <Avatar3D
        avatarType={avatarType}
        position={avatarPosition}
        targetPosition={null}
        onReachTarget={() => {}}
        isWalking={false}
        isKeyboardMoving={isAvatarMoving}
        rotation={avatarRotation}
      />

      {/* Warning circle when follower is near */}
      {minDistance < 8 && (
        <WarningCircle 
          position={[avatarPosition[0], 0.05, avatarPosition[2]]} 
          intensity={Math.max(0, 1 - (minDistance / 8))}
        />
      )}

      {/* Followers - positions/rotations from refs updated by single game loop (moves while player moves) */}
      {followerPositionsRef.current.map((followerPos, index) => (
        <FollowerAvatar3D
          key={index}
          avatarType={followerAvatarTypes[index]}
          position={followerPos}
          rotation={followerRotationsRef.current[index] ?? 0}
          isWalking={true}
        />
      ))}

      {/* Environment */}
      <Suspense fallback={null}>
        <Environment preset="park" />
      </Suspense>
    </Canvas>
  );
}
