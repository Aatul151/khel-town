import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarRewardProps {
  position: [number, number, number];
  onComplete: () => void;
}

// Create a star shape geometry
function createStarGeometry(outerRadius: number, innerRadius: number, points: number) {
  const shape = new THREE.Shape();
  const angleStep = (Math.PI * 2) / (points * 2);
  
  for (let i = 0; i < points * 2; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  
  return new THREE.ShapeGeometry(shape);
}

export function StarReward({ position, onComplete }: StarRewardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [visible, setVisible] = useState(true);
  const startTime = useRef<number | null>(null);

  const starGeometry = useMemo(() => createStarGeometry(0.5, 0.25, 5), []);

  useFrame((state: any) => {
    if (!groupRef.current || !meshRef.current || !visible) return;

    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime;
      return;
    }

    const elapsed = state.clock.elapsedTime - startTime.current;

    // Animate star rising and rotating
    groupRef.current.position.y = position[1] + elapsed * 2;
    groupRef.current.rotation.z += 0.05;
    const scale = 1 + Math.sin(elapsed * 5) * 0.2;
    groupRef.current.scale.setScalar(scale);

    // Fade out after 1.5 seconds
    if (elapsed > 1.5) {
      setVisible(false);
      onComplete();
    } else if (elapsed > 1) {
      // Fade out in last 0.5 seconds
      const opacity = 1 - (elapsed - 1) * 2;
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.opacity = opacity;
        meshRef.current.material.transparent = true;
      }
    }
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={meshRef} geometry={starGeometry} rotation={[0, 0, 0]}>
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

