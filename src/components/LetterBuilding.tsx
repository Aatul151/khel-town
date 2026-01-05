import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { LearningItem } from "../data/types";

interface LetterBuildingProps {
  letterData: LearningItem;
  position: [number, number, number];
  onClick: (item: LearningItem) => void;
}

export function LetterBuilding({ letterData, position, onClick }: LetterBuildingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [bouncing, setBouncing] = useState(false);
  const bounceStartTime = useRef<number | null>(null);
  
  // Add slight rotation variation for visual interest
  const rotationY = useRef(Math.random() * 0.1 - 0.05);

  // Bounce animation on click
  useFrame((state: any) => {
    if (!meshRef.current || !groupRef.current) return;

    if (bouncing) {
      if (bounceStartTime.current === null) {
        bounceStartTime.current = state.clock.elapsedTime;
      }
      
      if (bounceStartTime.current !== null) {
        const elapsed = state.clock.elapsedTime - bounceStartTime.current;
        const bounceHeight = Math.sin(elapsed * 10) * 0.3 * Math.max(0, 1 - elapsed * 2);
        groupRef.current.position.y = position[1] + Math.max(0, bounceHeight);
        
        // Stop bouncing after 0.5 seconds
        if (elapsed > 0.5) {
          setBouncing(false);
          bounceStartTime.current = null;
          groupRef.current.position.y = position[1];
        }
      }
    }

    // Hover glow effect - subtle scale and rotation
    if (hovered && !bouncing) {
      meshRef.current.scale.setScalar(1.15);
      meshRef.current.rotation.y += 0.02;
    } else if (!bouncing) {
      meshRef.current.scale.setScalar(1);
      meshRef.current.rotation.y = rotationY.current;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setBouncing(true);
    onClick(letterData);
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Letter building base - make it more interesting with varied shapes */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
        rotation-y={rotationY.current}
      >
        {/* Main building body */}
        <boxGeometry args={[2, 3, 2]} />
        <meshStandardMaterial
          color={letterData.color}
          emissive={hovered ? letterData.color : "#000000"}
          emissiveIntensity={hovered ? 0.4 : 0}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      
      {/* Decorative roof */}
      <mesh
        position={[0, 2, 0]}
        rotation={[0, rotationY.current, 0]}
        castShadow
      >
        <coneGeometry args={[1.5, 0.8, 4]} />
        <meshStandardMaterial
          color={letterData.color}
          emissive={hovered ? letterData.color : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      
      {/* Base platform */}
      <mesh
        position={[0, -0.3, 0]}
        rotation={[0, rotationY.current, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[1.3, 1.3, 0.2, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* 3D Label on top - using Text component from drei */}
      <Text
        position={[0, 2, 0.1]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        {letterData.label}
      </Text>
    </group>
  );
}

