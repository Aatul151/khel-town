import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type FollowerAvatarType = 
  | "follower_1" | "follower_2" | "follower_3" | "follower_4" | "follower_5"
  | "follower_6" | "follower_7" | "follower_8" | "follower_9" | "follower_10"
  | "follower_11" | "follower_12" | "follower_13" | "follower_14" | "follower_15";

interface FollowerAvatar3DProps {
  avatarType: FollowerAvatarType;
  position: [number, number, number];
  rotation: number;
  isWalking: boolean;
}

// Unique avatar designs for each follower - varied shapes, sizes, and features
const followerDesigns: Record<FollowerAvatarType, {
  color: string;
  headColor: string;
  bodyColor: string;
  legColor: string;
  uniqueFeature?: "hat" | "cape" | "helmet" | "crown" | "mask" | "glasses" | "antenna" | "horns" | "wings" | "tail" | "shield" | "sword" | "staff" | "book" | "gem" | "robot" | "tall" | "wide" | "spiky" | "round";
  size?: number;
  headShape?: "sphere" | "box" | "cone" | "cylinder";
  bodyShape?: "box" | "cylinder" | "sphere";
}> = {
  follower_1: { color: "#ef4444", headColor: "#dc2626", bodyColor: "#ef4444", legColor: "#991b1b", uniqueFeature: "helmet", size: 1.1, headShape: "sphere", bodyShape: "box" },
  follower_2: { color: "#f59e0b", headColor: "#d97706", bodyColor: "#f59e0b", legColor: "#92400e", uniqueFeature: "cape", size: 0.9, headShape: "box", bodyShape: "cylinder" },
  follower_3: { color: "#10b981", headColor: "#059669", bodyColor: "#10b981", legColor: "#047857", uniqueFeature: "hat", size: 1.0, headShape: "sphere", bodyShape: "box" },
  follower_4: { color: "#3b82f6", headColor: "#2563eb", bodyColor: "#3b82f6", legColor: "#1e40af", uniqueFeature: "crown", size: 1.2, headShape: "sphere", bodyShape: "box" },
  follower_5: { color: "#8b5cf6", headColor: "#7c3aed", bodyColor: "#8b5cf6", legColor: "#6d28d9", uniqueFeature: "mask", size: 0.85, headShape: "box", bodyShape: "cylinder" },
  follower_6: { color: "#ec4899", headColor: "#db2777", bodyColor: "#ec4899", legColor: "#be185d", uniqueFeature: "glasses", size: 1.0, headShape: "sphere", bodyShape: "box" },
  follower_7: { color: "#14b8a6", headColor: "#0d9488", bodyColor: "#14b8a6", legColor: "#0f766e", uniqueFeature: "robot", size: 1.0, headShape: "box", bodyShape: "box" },
  follower_8: { color: "#f97316", headColor: "#ea580c", bodyColor: "#f97316", legColor: "#c2410c", uniqueFeature: "horns", size: 1.15, headShape: "cone", bodyShape: "cylinder" },
  follower_9: { color: "#06b6d4", headColor: "#0891b2", bodyColor: "#06b6d4", legColor: "#0e7490", uniqueFeature: "wings", size: 0.95, headShape: "sphere", bodyShape: "box" },
  follower_10: { color: "#a855f7", headColor: "#9333ea", bodyColor: "#a855f7", legColor: "#7e22ce", uniqueFeature: "tail", size: 1.0, headShape: "sphere", bodyShape: "sphere" },
  follower_11: { color: "#eab308", headColor: "#ca8a04", bodyColor: "#eab308", legColor: "#a16207", uniqueFeature: "shield", size: 1.1, headShape: "box", bodyShape: "box" },
  follower_12: { color: "#22c55e", headColor: "#16a34a", bodyColor: "#22c55e", legColor: "#15803d", uniqueFeature: "sword", size: 0.9, headShape: "cylinder", bodyShape: "cylinder" },
  follower_13: { color: "#6366f1", headColor: "#4f46e5", bodyColor: "#6366f1", legColor: "#4338ca", uniqueFeature: "staff", size: 1.05, headShape: "sphere", bodyShape: "box" },
  follower_14: { color: "#f43f5e", headColor: "#e11d48", bodyColor: "#f43f5e", legColor: "#be123c", uniqueFeature: "book", size: 0.88, headShape: "box", bodyShape: "box" },
  follower_15: { color: "#84cc16", headColor: "#65a30d", bodyColor: "#84cc16", legColor: "#4d7c0f", uniqueFeature: "spiky", size: 1.0, headShape: "sphere", bodyShape: "box" },
};

export function FollowerAvatar3D({
  avatarType,
  position,
  rotation,
  isWalking = true,
}: FollowerAvatar3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const design = followerDesigns[avatarType];
  const size = design.size || 1;

  useFrame((state) => {
    if (!groupRef.current) return;

    // Set rotation
    groupRef.current.rotation.y = rotation;

    // Walking animation
    const walkCycle = isWalking ? state.clock.elapsedTime * 10 : 0;
    const armSwing = Math.sin(walkCycle) * 0.6;
    const legSwing = Math.sin(walkCycle) * 0.4;

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = armSwing;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -armSwing;
    }
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = -legSwing;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = legSwing;
    }
  });

  // Render head based on shape
  const renderHead = () => {
    const headY = 1.5 * size;
    if (design.headShape === "box") {
      return (
        <mesh position={[0, headY, 0]} castShadow>
          <boxGeometry args={[0.5 * size, 0.5 * size, 0.5 * size]} />
          <meshStandardMaterial 
            color={design.headColor}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      );
    } else if (design.headShape === "cone") {
      return (
        <mesh position={[0, headY, 0]} rotation={[0, 0, Math.PI]} castShadow>
          <coneGeometry args={[0.4 * size, 0.6 * size, 8]} />
          <meshStandardMaterial 
            color={design.headColor}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      );
    } else if (design.headShape === "cylinder") {
      return (
        <mesh position={[0, headY, 0]} castShadow>
          <cylinderGeometry args={[0.4 * size, 0.4 * size, 0.5 * size, 16]} />
          <meshStandardMaterial 
            color={design.headColor}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      );
    } else {
      // Default sphere
      return (
        <mesh position={[0, headY, 0]} castShadow>
          <sphereGeometry args={[0.45 * size, 16, 16]} />
          <meshStandardMaterial 
            color={design.headColor}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      );
    }
  };

  // Render body based on shape
  const renderBody = () => {
    const bodyY = 0.8 * size;
    if (design.bodyShape === "cylinder") {
      return (
        <mesh position={[0, bodyY, 0]} castShadow>
          <cylinderGeometry args={[0.35 * size, 0.35 * size, 0.9 * size, 16]} />
          <meshStandardMaterial 
            color={design.bodyColor}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      );
    } else if (design.bodyShape === "sphere") {
      return (
        <mesh position={[0, bodyY, 0]} castShadow>
          <sphereGeometry args={[0.4 * size, 16, 16]} />
          <meshStandardMaterial 
            color={design.bodyColor}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      );
    } else {
      // Default box
      return (
        <mesh position={[0, bodyY, 0]} castShadow>
          <boxGeometry args={[0.6 * size, 0.9 * size, 0.45 * size]} />
          <meshStandardMaterial 
            color={design.bodyColor}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
      );
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Head - varied shapes */}
      {renderHead()}

      {/* Unique Features */}
      {design.uniqueFeature === "helmet" && (
        <mesh position={[0, 1.6 * size, 0]} castShadow>
          <cylinderGeometry args={[0.5 * size, 0.5 * size, 0.3 * size, 16]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
      {design.uniqueFeature === "hat" && (
        <mesh position={[0, 1.9 * size, 0]} castShadow>
          <cylinderGeometry args={[0.4 * size, 0.5 * size, 0.4 * size, 16]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      )}
      {design.uniqueFeature === "crown" && (
        <group position={[0, 1.8 * size, 0]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[Math.cos((i / 5) * Math.PI * 2) * 0.3 * size, 0, Math.sin((i / 5) * Math.PI * 2) * 0.3 * size]} castShadow>
              <coneGeometry args={[0.08 * size, 0.2 * size, 8]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.9} emissive="#fbbf24" emissiveIntensity={0.3} />
            </mesh>
          ))}
        </group>
      )}
      {design.uniqueFeature === "mask" && (
        <mesh position={[0, 1.5 * size, 0.3 * size]} castShadow>
          <boxGeometry args={[0.5 * size, 0.4 * size, 0.1 * size]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      )}
      {design.uniqueFeature === "glasses" && (
        <>
          <mesh position={[-0.15 * size, 1.6 * size, 0.35 * size]}>
            <torusGeometry args={[0.1 * size, 0.02 * size, 8, 16]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0.15 * size, 1.6 * size, 0.35 * size]}>
            <torusGeometry args={[0.1 * size, 0.02 * size, 8, 16]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </>
      )}
      {design.uniqueFeature === "antenna" && (
        <>
          <mesh position={[0, 2 * size, 0]}>
            <cylinderGeometry args={[0.02 * size, 0.02 * size, 0.3 * size, 8]} />
            <meshStandardMaterial color={design.color} />
          </mesh>
          <mesh position={[0, 2.2 * size, 0]}>
            <sphereGeometry args={[0.05 * size, 8, 8]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
          </mesh>
        </>
      )}
      {design.uniqueFeature === "horns" && (
        <>
          <mesh position={[-0.15 * size, 1.8 * size, 0]} castShadow>
            <coneGeometry args={[0.08 * size, 0.2 * size, 8]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0.15 * size, 1.8 * size, 0]} castShadow>
            <coneGeometry args={[0.08 * size, 0.2 * size, 8]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </>
      )}
      {design.uniqueFeature === "wings" && (
        <group position={[0, 1.2 * size, -0.2 * size]}>
          <mesh position={[-0.4 * size, 0, 0]} rotation={[0, 0, 0.3]} castShadow>
            <boxGeometry args={[0.3 * size, 0.6 * size, 0.05 * size]} />
            <meshStandardMaterial color={design.color} />
          </mesh>
          <mesh position={[0.4 * size, 0, 0]} rotation={[0, 0, -0.3]} castShadow>
            <boxGeometry args={[0.3 * size, 0.6 * size, 0.05 * size]} />
            <meshStandardMaterial color={design.color} />
          </mesh>
        </group>
      )}
      {design.uniqueFeature === "tail" && (
        <mesh position={[0, 0.5 * size, -0.3 * size]} rotation={[0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05 * size, 0.1 * size, 0.5 * size, 8]} />
          <meshStandardMaterial color={design.color} />
        </mesh>
      )}
      {design.uniqueFeature === "shield" && (
        <mesh position={[-0.4 * size, 0.8 * size, 0]} rotation={[0, 0, 0.2]} castShadow>
          <boxGeometry args={[0.15 * size, 0.6 * size, 0.05 * size]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} />
        </mesh>
      )}
      {design.uniqueFeature === "sword" && (
        <mesh position={[0.4 * size, 0.5 * size, 0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.05 * size, 0.8 * size, 0.05 * size]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
        </mesh>
      )}
      {design.uniqueFeature === "staff" && (
        <mesh position={[0.4 * size, 0.3 * size, 0]} rotation={[0, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.03 * size, 0.03 * size, 1 * size, 8]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
      )}
      {design.uniqueFeature === "book" && (
        <mesh position={[0.35 * size, 0.8 * size, 0]} rotation={[0, 0, -0.2]} castShadow>
          <boxGeometry args={[0.15 * size, 0.2 * size, 0.05 * size]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      )}
      {design.uniqueFeature === "gem" && (
        <mesh position={[0, 1.7 * size, 0.3 * size]}>
          <octahedronGeometry args={[0.1 * size, 0]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      )}
      {design.uniqueFeature === "robot" && (
        <>
          {/* Robot head with square eyes */}
          <mesh position={[-0.15 * size, 1.6 * size, 0.4 * size]}>
            <boxGeometry args={[0.1 * size, 0.1 * size, 0.05 * size]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0.15 * size, 1.6 * size, 0.4 * size]}>
            <boxGeometry args={[0.1 * size, 0.1 * size, 0.05 * size]} />
            <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.8} />
          </mesh>
          {/* Robot chest panel */}
          <mesh position={[0, 0.8 * size, 0.25 * size]}>
            <boxGeometry args={[0.3 * size, 0.4 * size, 0.05 * size]} />
            <meshStandardMaterial color="#1f2937" metalness={0.9} />
          </mesh>
        </>
      )}
      {design.uniqueFeature === "spiky" && (
        <group position={[0, 1.5 * size, 0]}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh 
              key={i} 
              position={[
                Math.cos((i / 8) * Math.PI * 2) * 0.35 * size, 
                Math.sin((i / 8) * Math.PI * 2) * 0.35 * size + 0.2 * size,
                0
              ]} 
              castShadow
            >
              <coneGeometry args={[0.05 * size, 0.15 * size, 6]} />
              <meshStandardMaterial color={design.color} />
            </mesh>
          ))}
        </group>
      )}

      {/* Cape */}
      {design.uniqueFeature === "cape" && (
        <mesh position={[0, 0.8 * size, -0.2 * size]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.5 * size, 0.8 * size, 0.05 * size]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      )}

      {/* Body/Torso - varied shapes */}
      {renderBody()}

      {/* Arms */}
      <group ref={leftArmRef} position={[-0.35 * size, 0.8 * size, 0]}>
        <mesh position={[0, -0.3 * size, 0]} castShadow>
          <boxGeometry args={[0.18 * size, 0.7 * size, 0.18 * size]} />
          <meshStandardMaterial color={design.bodyColor} />
        </mesh>
      </group>
      
      <group ref={rightArmRef} position={[0.35 * size, 0.8 * size, 0]}>
        <mesh position={[0, -0.3 * size, 0]} castShadow>
          <boxGeometry args={[0.18 * size, 0.7 * size, 0.18 * size]} />
          <meshStandardMaterial color={design.bodyColor} />
        </mesh>
      </group>

      {/* Legs */}
      <group ref={leftLegRef} position={[-0.18 * size, 0.15 * size, 0]}>
        <mesh position={[0, -0.3 * size, 0]} castShadow>
          <boxGeometry args={[0.18 * size, 0.6 * size, 0.18 * size]} />
          <meshStandardMaterial color={design.legColor} />
        </mesh>
        <mesh position={[0, -0.65 * size, 0.1 * size]} castShadow>
          <boxGeometry args={[0.2 * size, 0.1 * size, 0.3 * size]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
      
      <group ref={rightLegRef} position={[0.18 * size, 0.15 * size, 0]}>
        <mesh position={[0, -0.3 * size, 0]} castShadow>
          <boxGeometry args={[0.18 * size, 0.6 * size, 0.18 * size]} />
          <meshStandardMaterial color={design.legColor} />
        </mesh>
        <mesh position={[0, -0.65 * size, 0.1 * size]} castShadow>
          <boxGeometry args={[0.2 * size, 0.1 * size, 0.3 * size]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>

      {/* Eyes - only render for non-robot avatars */}
      {design.uniqueFeature !== "robot" && (
        <>
          <mesh position={[-0.12 * size, 1.6 * size, 0.35 * size]}>
            <sphereGeometry args={[0.08 * size, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.12 * size, 1.6 * size, 0.35 * size]}>
            <sphereGeometry args={[0.08 * size, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Pupils */}
          <mesh position={[-0.12 * size, 1.6 * size, 0.4 * size]}>
            <sphereGeometry args={[0.04 * size, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.12 * size, 1.6 * size, 0.4 * size]}>
            <sphereGeometry args={[0.04 * size, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </>
      )}
    </group>
  );
}
