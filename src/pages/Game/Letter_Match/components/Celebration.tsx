import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface CelebrationProps {
  onComplete: () => void;
}

export function Celebration({ onComplete }: CelebrationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTime.current;

    // Animate celebration text
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.02;
      const scale = 1 + Math.sin(elapsed * 3) * 0.1;
      groupRef.current.scale.setScalar(scale);
    }

    // Complete after 3 seconds
    if (elapsed > 3) {
      onComplete();
    }
  });

  return (
    <group ref={groupRef} position={[0, 3, 0]}>
      {/* Celebration Text */}
      <Text
        position={[0, 0, 0]}
        fontSize={2}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#ffffff"
      >
        🎉 Great Job! 🎉
      </Text>
    </group>
  );
}

