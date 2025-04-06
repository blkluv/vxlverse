import { useEffect, useState, forwardRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface PaintingProps {
  imageUrl: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  width?: number;
  height?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export const Painting = forwardRef<THREE.Group, PaintingProps>(
  (
    {
      imageUrl,
      position,
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
      width = 10,
      height = 10,
      isSelected = false,
      onClick,
    },
    ref
  ) => {
    // Load the texture
    const texture = useTexture(imageUrl);
    const [hovered, setHovered] = useState(false);

    // Set texture properties
    useEffect(() => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
      }
    }, [texture]);

    // Calculate frame dimensions (slightly larger than the painting)
    const frameWidth = width + 0.1;
    const frameHeight = height + 0.1;
    const frameDepth = 0.05;

    return (
      <group
        position={position}
        rotation={rotation as unknown as THREE.Euler}
        scale={scale as unknown as THREE.Vector3}
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        ref={ref}
      >
        {/* Frame */}
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[frameWidth, frameHeight, frameDepth]} />
          <meshStandardMaterial
            color={isSelected ? "#3b82f6" : hovered ? "#64748b" : "#1e293b"}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Canvas/Painting */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial
            map={texture}
            emissive="#ffffff"
            emissiveIntensity={0.1}
            emissiveMap={texture}
          />
        </mesh>

        {/* Selection indicator */}
        {isSelected && (
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[width + 0.05, height + 0.05, 0.01]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
          </mesh>
        )}
      </group>
    );
  }
);
