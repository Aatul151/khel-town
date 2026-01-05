import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// Helper function to create a star shape
function createStarShape(outerRadius: number, innerRadius: number, points: number): THREE.Shape {
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
  
  return shape;
}

export interface LetterData {
  id: number;
  letter: string;
  case: "upper" | "lower";
}

interface LetterBoxProps {
  letterData: LetterData;
  position: [number, number, number];
  onClick: () => void;
  state: "idle" | "selected" | "matched";
  isMatched: boolean;
  isShaking?: boolean;
  isRevealed?: boolean;
  displayLetter?: string; // The letter to display (for matched pairs, show same letter)
}

export function LetterBox({ letterData, position, onClick, state, isMatched, isShaking = false, isRevealed = false, displayLetter }: LetterBoxProps) {
  const groupRef = useRef<THREE.Group>(null);
  const boxRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const basePosition = useRef<[number, number, number]>(position);
  
  // Generate a colorful pattern based on box ID for visual variety
  const boxId = letterData.id;
  const colors = [
    "#ef4444", // red
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange
  ];
  const patternColor = colors[boxId % colors.length];
  
  // Create star shape geometry once
  const starShape = useMemo(() => createStarShape(0.3, 0.15, 5), []);
  const starGeometry = useMemo(() => new THREE.ShapeGeometry(starShape), [starShape]);

  // Animation: floating effect for letters
  useFrame((frameState) => {
    if (!groupRef.current || isMatched) return;

    // Floating animation
    const floatOffset = Math.sin(frameState.clock.elapsedTime * 2 + position[0]) * 0.1;
    groupRef.current.position.y = basePosition.current[1] + floatOffset;

    // Shake animation
    if (isShaking) {
      const shakeIntensity = 0.1;
      groupRef.current.position.x = basePosition.current[0] + (Math.random() - 0.5) * shakeIntensity;
      groupRef.current.position.z = basePosition.current[2] + (Math.random() - 0.5) * shakeIntensity;
    } else {
      groupRef.current.position.x = basePosition.current[0];
      groupRef.current.position.z = basePosition.current[2];
    }

    // Rotation animation for matched boxes
    if (state === "matched") {
      groupRef.current.rotation.y += 0.02;
    }

    // Hover scale effect
    if (boxRef.current) {
      const targetScale = hovered ? 1.1 : state === "selected" ? 1.05 : 1;
      boxRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  // Determine box color based on state
  const getBoxColor = () => {
    if (isMatched) return "#10b981"; // Green when matched
    if (state === "selected") return "#3b82f6"; // Blue when selected
    return patternColor; // Colorful pattern when idle
  };

  // Determine glow intensity
  const getEmissiveIntensity = () => {
    if (isMatched) return 0.5;
    if (state === "selected") return 0.3;
    if (hovered) return 0.1;
    return 0;
  };

  if (isMatched && state === "matched") {
    // Animate out when matched
    return null;
  }

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D Rounded Box */}
      <RoundedBox
        ref={boxRef}
        args={[1.5, 1.5, 1.5]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial
          color={getBoxColor()}
          emissive={getBoxColor()}
          emissiveIntensity={getEmissiveIntensity()}
          metalness={0.3}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Decorative pattern on idle boxes */}
      {!isRevealed && !isMatched && (
        <>
          {/* Central decorative shape - using a simple shape */}
          <mesh position={[0, 0, 0.76]} rotation={[0, 0, Math.PI / 4]} geometry={starGeometry}>
            <meshStandardMaterial color={patternColor} emissive={patternColor} emissiveIntensity={0.3} />
          </mesh>
          {/* Small decorative circles */}
          <mesh position={[-0.4, 0.3, 0.76]}>
            <circleGeometry args={[0.1, 16]} />
            <meshStandardMaterial color={patternColor} />
          </mesh>
          <mesh position={[0.4, -0.3, 0.76]}>
            <circleGeometry args={[0.1, 16]} />
            <meshStandardMaterial color={patternColor} />
          </mesh>
          <mesh position={[0.4, 0.3, 0.76]}>
            <circleGeometry args={[0.08, 16]} />
            <meshStandardMaterial color={patternColor} />
          </mesh>
          <mesh position={[-0.4, -0.3, 0.76]}>
            <circleGeometry args={[0.08, 16]} />
            <meshStandardMaterial color={patternColor} />
          </mesh>
        </>
      )}

      {/* Floating Letter Text - only show when revealed or matched */}
      {(isRevealed || isMatched) && (
        <Text
          position={[0, 0, 0.8]}
          fontSize={1.2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.08}
          outlineColor="#ffffff"
        >
          {displayLetter || letterData.letter}
        </Text>
      )}
    </group>
  );
}

