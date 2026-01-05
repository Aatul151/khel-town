// import { Suspense } from "react";
// import { useGLTF } from "@react-three/drei";
// import * as THREE from "three";

interface ObjectModelProps {
  modelPath: string;
  position: [number, number, number];
  scale?: number;
}

// Fallback component when model is not available
function FallbackModel({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[1.5 * scale, 1.5 * scale, 1.5 * scale]} />
      <meshStandardMaterial color="#fbbf24" />
    </mesh>
  );
}

// Component that loads the GLB model
// function LoadedModel({ modelPath, position, scale = 1 }: ObjectModelProps) {
//   // useGLTF must be called unconditionally
//   // If the model doesn't exist, drei will handle it
//   // For MVP, we'll use a simple approach: try to load, fallback on error
//   try {
//     const gltf = useGLTF(modelPath);
//     return (
//       <primitive
//         object={gltf.scene.clone()}
//         position={position}
//         scale={scale}
//         castShadow
//         receiveShadow
//       />
//     );
//   } catch {
//     // If model loading fails, return fallback
//     return <FallbackModel position={position} scale={scale} />;
//   }
// }

export function ObjectModel(props: ObjectModelProps) {
  // For MVP: Use fallback until models are added
  // When models are ready, uncomment the Suspense version below
  return <FallbackModel position={props.position} scale={props.scale} />;

  // Uncomment when GLB models are available:
  // return (
  //   <Suspense fallback={<FallbackModel position={props.position} scale={props.scale} />}>
  //     <LoadedModel {...props} />
  //   </Suspense>
  // );
}

