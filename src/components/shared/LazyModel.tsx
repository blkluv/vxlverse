import { Suspense, useState, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

interface LazyModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

// Simple placeholder component while model is loading
function ModelPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#cccccc" wireframe />
    </mesh>
  );
}

export function LazyModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: LazyModelProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Only load the model when component is mounted
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) {
    return <ModelPlaceholder />;
  }

  return (
    <Suspense fallback={<ModelPlaceholder />}>
      <LoadedModel url={url} position={position} rotation={rotation} scale={scale} />
    </Suspense>
  );
}

function LoadedModel({ url, position, rotation, scale }: LazyModelProps) {
  // Configure DRACO loader for better compression
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

  // Use the GLTF loader with DRACO support
  const gltf = useLoader(GLTFLoader, url, (loader) => {
    (loader as GLTFLoader).setDRACOLoader(dracoLoader);
  });

  return <primitive object={gltf.scene} position={position} rotation={rotation} scale={scale} />;
}
