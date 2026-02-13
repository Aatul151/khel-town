import { useEffect, useMemo, useState, useRef } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { LearningItem } from "../../../../data/types";
import * as THREE from "three";

interface AlphabetGridProps {
  items: LearningItem[];
  onItemClick: (item: LearningItem, position: [number, number, number]) => void;
  completedItems: string[];
  avatarPosition: [number, number, number];
  shuffleKey?: number; // Key to force reshuffle on reset
  onBoxPositionUpdate?: (positions: Map<string, [number, number, number]>) => void;
  hintedItemId?: string | null; // ID of the item currently being hinted
  isHintActive?: boolean; // Whether hint is currently active
}

export function AlphabetGrid({ items, onItemClick, completedItems, avatarPosition, shuffleKey = 0, onBoxPositionUpdate, hintedItemId = null, isHintActive = false }: AlphabetGridProps) {
  // Create a grid layout - 6x6 grid for 26 letters (with 10 empty spaces)
  const gridSize = 6;

  // Store shuffled items in state - only shuffle once per unique item set or shuffleKey
  const [shuffledItems, setShuffledItems] = useState<LearningItem[]>(() => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Track the items key and shuffle key to detect when items actually change or reset happens
  const itemsKey = useMemo(() => items.map(i => i.id).sort().join(','), [items]);
  const prevItemsKeyRef = useRef<string>(itemsKey);
  const prevShuffleKeyRef = useRef<number>(shuffleKey);

  // Reshuffle if items have changed OR shuffleKey changed (reset game)
  useEffect(() => {
    if (prevItemsKeyRef.current !== itemsKey || prevShuffleKeyRef.current !== shuffleKey) {
      // Items changed or reset triggered, create new shuffle
      const shuffled = [...items];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledItems(shuffled);
      prevItemsKeyRef.current = itemsKey;
      prevShuffleKeyRef.current = shuffleKey;
    }
  }, [items, itemsKey, shuffleKey]);

  const gridItems: (LearningItem | null)[] = useMemo(() => {
    const result: (LearningItem | null)[] = [];

    // Fill grid with ALL items in shuffled order
    // Completed items will be shown but can be visually distinguished
    shuffledItems.forEach((item) => {
      result.push(item);
    });

    // Pad with nulls to fill 6x6 grid (36 total spaces, 26 letters = 10 empty)
    while (result.length < gridSize * gridSize) {
      result.push(null);
    }

    return result;
  }, [shuffledItems, gridSize]);

  // Calculate positions and notify parent for collision detection
  useEffect(() => {
    if (!onBoxPositionUpdate) return;

    const boxPositions = new Map<string, [number, number, number]>();
    const boxHeight = 3.5; // Box height
    const boxYPosition = boxHeight / 2; // Position box so bottom sits on ground (Y=0)
    
    gridItems.forEach((item, index) => {
      if (item) {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const spacing = 9; // Increased space between boxes for better navigation
        const x = (col - (gridSize - 1) / 2) * spacing;
        const z = (row - (gridSize - 1) / 2) * spacing;
        boxPositions.set(item.id, [x, boxYPosition, z]);
      }
    });

    // Notify parent of box positions for collision detection
    onBoxPositionUpdate(boxPositions);
  }, [gridItems, onBoxPositionUpdate, gridSize]);

  return (
    <group>
      {gridItems.map((item, index) => {
        if (!item) return null;
        
        // Skip rendering completed items - remove them from scene
        if (completedItems.includes(item.id)) return null;

        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        const spacing = 9; // Increased space between boxes for better navigation
        const x = (col - (gridSize - 1) / 2) * spacing;
        const z = (row - (gridSize - 1) / 2) * spacing;
        const boxHeight = 3.5; // Box height
        const boxYPosition = boxHeight / 2; // Position box so bottom sits on ground (Y=0)

        return (
          <AlphabetBox
            key={item.id}
            item={item}
            position={[x, boxYPosition, z]}
            onClick={() => onItemClick(item, [x, boxYPosition, z])}
            avatarPosition={avatarPosition}
            isCompleted={false}
            isHinted={isHintActive && hintedItemId === item.id}
          />
        );
      })}
    </group>
  );
}

interface AlphabetBoxProps {
  item: LearningItem;
  position: [number, number, number];
  onClick: () => void;
  avatarPosition: [number, number, number];
  isCompleted?: boolean;
  isHinted?: boolean; // Whether this box is currently being hinted
}

function AlphabetBox({ item, position, onClick, avatarPosition, isCompleted = false, isHinted = false }: AlphabetBoxProps) {
  // Calculate distance from avatar to box
  const distance = Math.sqrt(
    Math.pow(position[0] - avatarPosition[0], 2) +
    Math.pow(position[2] - avatarPosition[2], 2)
  );

  const isNear = distance < 3.5; // Avatar must be within 3.5 units to click (adjusted for larger boxes)

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Don't allow clicking on completed items
    if (isCompleted) return;

    if (isNear) {
      onClick();
    } else {
      // Show message that avatar needs to be closer
      console.log("Get closer to the box!");
    }
  };

  // Completed items are not rendered, so always use full opacity and scale
  const opacity = 1;
  const scale = 1;

  // Hint animation refs
  const hintPulseRef = useRef(0);
  const hintGlowRef = useRef<THREE.Mesh>(null);
  const hintRingRef = useRef<THREE.Mesh>(null);

  // Animate hint glow effect
  useFrame(() => {
    if (isHinted) {
      hintPulseRef.current += 0.15;
      const pulse = Math.sin(hintPulseRef.current) * 0.3 + 0.7; // Pulse between 0.4 and 1.0
      
      if (hintGlowRef.current) {
        const material = hintGlowRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = pulse * 1.5;
      }
      
      if (hintRingRef.current) {
        const scale = 1 + Math.sin(hintPulseRef.current * 2) * 0.3;
        hintRingRef.current.scale.set(scale, scale, scale);
        const material = hintRingRef.current.material as THREE.MeshStandardMaterial;
        material.opacity = pulse * 0.8;
      }
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Box with letter on all sides */}
      <mesh
        ref={hintGlowRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = isNear ? "pointer" : "not-allowed";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3.5, 3.5, 3.5]} />
        <meshStandardMaterial
          color={item.color}
          emissive={isHinted ? "#00ff00" : item.color}
          emissiveIntensity={isHinted ? 1.2 : (isNear ? 0.5 : 0.2)}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* Hint indicator - bright pulsing green glow when hinted */}
      {isHinted && (
        <>
          {/* Large pulsing ring around box */}
          <mesh ref={hintRingRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 3.5, 32]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={2}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Vertical pulsing rings */}
          <mesh position={[0, 1.75, 0]} rotation={[0, 0, 0]}>
            <ringGeometry args={[2.2, 2.8, 32]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={1.5}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, -1.75, 0]} rotation={[0, 0, 0]}>
            <ringGeometry args={[2.2, 2.8, 32]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={1.5}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* Proximity indicator - glow when near (only show if not hinted) */}
      {isNear && !isHinted && (
        <mesh position={[0, 2, 0]}>
          <ringGeometry args={[2, 2.3, 16]} />
          <meshStandardMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.8}
            transparent
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Letter on front */}
      <mesh position={[0, 0, 1.76]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Letter on back */}
      <mesh position={[0, 0, -1.76]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Letter on left */}
      <mesh position={[-1.76, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Letter on right */}
      <mesh position={[1.76, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Letter on top */}
      <mesh position={[0, 1.76, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Letter on bottom */}
      <mesh position={[0, -1.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* 3D Text label on each face - larger and more visible */}
      <>
        <Text
            position={[0, 0.2, 1.77]}
            fontSize={2.2}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.15}
            outlineColor="#ffffff"
          >
            {item.label}
          </Text>
          <Text
            position={[0, 0.2, -1.77]}
            rotation={[0, Math.PI, 0]}
            fontSize={2.2}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.15}
            outlineColor="#ffffff"
          >
            {item.label}
          </Text>
          <Text
            position={[-1.77, 0.2, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={2.2}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.15}
            outlineColor="#ffffff"
          >
            {item.label}
          </Text>
          <Text
            position={[1.77, 0.2, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            fontSize={2.2}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.15}
            outlineColor="#ffffff"
          >
            {item.label}
          </Text>
      </>
    </group>
  );
}
