import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AvatarType } from "./AvatarSelector";

interface Avatar3DProps {
  avatarType: AvatarType;
  position: [number, number, number];
  targetPosition: [number, number, number] | null;
  onReachTarget: () => void;
  isWalking: boolean;
  isKeyboardMoving?: boolean;
  onRotationChange?: (rotation: number) => void;
  rotation?: number; // External rotation control for keyboard rotation
}

export function Avatar3D({
  avatarType,
  position: initialPosition,
  targetPosition,
  onReachTarget,
  isWalking: _isWalking, // Prop kept for interface compatibility but not used internally
  isKeyboardMoving = false,
  onRotationChange,
  rotation,
}: Avatar3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(initialPosition);
  const [walking, setWalking] = useState(false);
  const walkStartTime = useRef<number | null>(null);
  const walkStartPos = useRef<[number, number, number]>(initialPosition);
  const lastPosition = useRef<[number, number, number]>(initialPosition);

  // Animation refs for body parts
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  // Update avatar rotation when rotation prop changes (for left/right/down keys)
  useEffect(() => {
    if (rotation !== undefined && groupRef.current) {
      // Apply rotation to avatar model immediately when rotation changes
      groupRef.current.rotation.y = rotation;
    }
  }, [rotation]);

  // Update position when prop changes (for keyboard movement)
  useEffect(() => {
    const hasMoved = 
      Math.abs(initialPosition[0] - lastPosition.current[0]) > 0.01 ||
      Math.abs(initialPosition[2] - lastPosition.current[2]) > 0.01;
    
    if (hasMoved && groupRef.current) {
      const oldPos = [...lastPosition.current] as [number, number, number];
      
      // Calculate rotation based on movement direction BEFORE updating position
      const dx = initialPosition[0] - oldPos[0];
      const dz = initialPosition[2] - oldPos[2];
      if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
        const angle = Math.atan2(dx, dz);
        groupRef.current.rotation.y = angle;
        // Notify parent of rotation change for camera tracking
        if (onRotationChange) {
          onRotationChange(angle);
        }
      }
      
      // Update position
      setCurrentPosition(initialPosition);
      groupRef.current.position.set(...initialPosition);
      lastPosition.current = initialPosition;
    }
  }, [initialPosition]);

  useEffect(() => {
    if (targetPosition && !walking) {
      setWalking(true);
      walkStartTime.current = null;
      walkStartPos.current = currentPosition;
    }
  }, [targetPosition, currentPosition, walking]);

  // Track if avatar is moving (either to target or via keyboard)
  const isActuallyMoving = walking || isKeyboardMoving;

  useFrame((state) => {
    if (!groupRef.current) return;

    // Walking animation for arms and legs
    const walkCycle = isActuallyMoving ? state.clock.elapsedTime * 8 : 0;
    const armSwing = Math.sin(walkCycle) * 0.6;
    const legSwing = Math.sin(walkCycle) * 0.4;

    // Animate arms
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = isActuallyMoving ? armSwing : 0;
      leftArmRef.current.rotation.z = isActuallyMoving ? Math.sin(walkCycle) * 0.2 : 0;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = isActuallyMoving ? -armSwing : 0;
      rightArmRef.current.rotation.z = isActuallyMoving ? -Math.sin(walkCycle) * 0.2 : 0;
    }

    // Animate legs
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = isActuallyMoving ? -legSwing : 0;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = isActuallyMoving ? legSwing : 0;
    }

    // Body bobbing while walking
    if (bodyRef.current && isActuallyMoving) {
      const bodyBob = Math.sin(walkCycle * 2) * 0.15;
      bodyRef.current.position.y = bodyBob;
    }

    // Head bobbing while walking
    if (headRef.current && isActuallyMoving) {
      const headBob = Math.sin(walkCycle * 2) * 0.05;
      headRef.current.position.y = 1.5 + headBob;
    }

    // Handle target-based walking
    if (walking && targetPosition) {
      if (walkStartTime.current === null) {
        walkStartTime.current = state.clock.elapsedTime;
      }

      const elapsed = state.clock.elapsedTime - walkStartTime.current;
      const walkSpeed = 3; // units per second
      const distance = Math.sqrt(
        Math.pow(targetPosition[0] - walkStartPos.current[0], 2) +
        Math.pow(targetPosition[2] - walkStartPos.current[2], 2)
      );
      const duration = distance / walkSpeed;

      if (elapsed < duration) {
        // Interpolate position
        const t = elapsed / duration;
        const x = THREE.MathUtils.lerp(walkStartPos.current[0], targetPosition[0], t);
        const z = THREE.MathUtils.lerp(walkStartPos.current[2], targetPosition[2], t);
        const y = initialPosition[1]; // Keep same height

        setCurrentPosition([x, y, z]);
        groupRef.current.position.set(x, y, z);

        // Rotate to face movement direction
        const dx = targetPosition[0] - walkStartPos.current[0];
        const dz = targetPosition[2] - walkStartPos.current[2];
        const angle = Math.atan2(dx, dz);
        groupRef.current.rotation.y = angle;

        // Step animation - body goes up and down
        const stepHeight = Math.abs(Math.sin(walkCycle)) * 0.2;
        groupRef.current.position.y = y + stepHeight;
      } else {
        // Reached target
        setCurrentPosition(targetPosition);
        groupRef.current.position.set(...targetPosition);
        setWalking(false);
        onReachTarget();
      }
    } else if (!isKeyboardMoving) {
      // Idle animation - slight bobbing and breathing
      const bob = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      const breathe = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      groupRef.current.position.y = initialPosition[1] + bob;
      if (bodyRef.current) {
        bodyRef.current.scale.y = 1 + breathe;
      }
      if (headRef.current) {
        headRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      }
    }
  });

  // Avatar colors and styles based on type
  const avatarStyles = {
    boy: {
      color: "#3b82f6",
      headColor: "#fdbcb4", // Skin tone
      shirtColor: "#3b82f6",
      pantsColor: "#1e40af",
    },
    girl: {
      color: "#ec4899",
      headColor: "#fdbcb4", // Skin tone
      shirtColor: "#ec4899",
      pantsColor: "#be185d",
    },
    robot: {
      color: "#10b981",
      headColor: "#10b981",
      shirtColor: "#10b981",
      pantsColor: "#059669",
    },
  };

  const style = avatarStyles[avatarType];

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Avatar body - improved character representation */}
      <group ref={bodyRef}>
        {/* Head */}
        <mesh ref={headRef} position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial 
            color={style.headColor}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>

        {/* Hair/Head accessory */}
        {avatarType === "boy" && (
          <mesh position={[0, 1.7, 0]} castShadow>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#4a3728" />
          </mesh>
        )}
        {avatarType === "girl" && (
          <group position={[0, 1.75, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.35, 8, 8]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Pigtails */}
            <mesh position={[-0.3, 0.1, 0]} castShadow>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            <mesh position={[0.3, 0.1, 0]} castShadow>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        )}

        {/* Body/Torso */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[0.6, 0.9, 0.45]} />
          <meshStandardMaterial 
            color={style.shirtColor}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>

        {/* Arms with shoulders */}
        <group ref={leftArmRef} position={[-0.35, 0.8, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.18, 0.7, 0.18]} />
            <meshStandardMaterial color={style.shirtColor} />
          </mesh>
        </group>
        
        <group ref={rightArmRef} position={[0.35, 0.8, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.18, 0.7, 0.18]} />
            <meshStandardMaterial color={style.shirtColor} />
          </mesh>
        </group>

        {/* Legs with hips */}
        <group ref={leftLegRef} position={[-0.18, 0.15, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.18, 0.6, 0.18]} />
            <meshStandardMaterial color={style.pantsColor} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.65, 0.1]} castShadow>
            <boxGeometry args={[0.2, 0.1, 0.3]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>
        
        <group ref={rightLegRef} position={[0.18, 0.15, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.18, 0.6, 0.18]} />
            <meshStandardMaterial color={style.pantsColor} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.65, 0.1]} castShadow>
            <boxGeometry args={[0.2, 0.1, 0.3]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>

        {/* Eyes */}
        <mesh position={[-0.12, 1.6, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 1.6, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.12, 1.6, 0.4]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.12, 1.6, 0.4]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Robot-specific features */}
        {avatarType === "robot" && (
          <>
            <mesh position={[-0.1, 1.5, 0.4]}>
              <boxGeometry args={[0.08, 0.08, 0.05]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0.1, 1.5, 0.4]}>
              <boxGeometry args={[0.08, 0.08, 0.05]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
            </mesh>
            {/* Antenna */}
            <mesh position={[0, 2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
              <meshStandardMaterial color={style.color} />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
            </mesh>
          </>
        )}

        {/* Smile */}
        {avatarType !== "robot" && (
          <mesh position={[0, 1.4, 0.35]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        )}
      </group>
    </group>
  );
}
