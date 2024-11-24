import { useRef } from "react";
import { useEditorStore } from "../stores/editorStore";
import { Environment, Grid, Sky } from "@react-three/drei";
import { GameObject } from "./GameObject";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Scene as SceneType } from "../types";
import { Hero } from "./game/Hero";

interface SceneProps {
  sceneData?: SceneType;
  isPreview?: boolean;
}

export function Scene({ sceneData, isPreview }: SceneProps) {
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const currentScene =
    sceneData || scenes.find((scene) => scene.id === currentSceneId);
  const updateObject = useEditorStore((state) => state.updateObject);
  const setSelectedObject = useEditorStore((state) => state.setSelectedObject);

  const handleBackgroundClick = (e: THREE.Event) => {
    if (e.target === e?.currentTarget && !isPreview) {
      setSelectedObject(null);
    }
  };

  if (!currentScene) return null;

  return (
    <group onClick={handleBackgroundClick}>
      {currentScene.environment && (
        <Environment
          preset={currentScene.environment as any}
          background={currentScene.background === "environment"}
        />
      )}

      {currentScene.background === "sky" && (
        <Sky sunPosition={[100, 20, 100]} />
      )}

      <ambientLight intensity={currentScene.ambientLight || 0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <Hero position={[0, 2, 0]} />
      {!isPreview && (
        <Grid
          infiniteGrid
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#6e6e6e"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
      )}

      {currentScene.objects.map((object) => (
        <GameObject
          key={object.id}
          modelUrl={object.modelUrl}
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          isSelected={selectedObjectId === object.id && !isPreview}
          quests={object.quests}
          onClick={() => {
            !isPreview && setSelectedObject(object.id);
          }}
          onTransform={(newPosition, newRotation, newScale) => {
            if (!isPreview && currentSceneId) {
              updateObject(currentSceneId, object.id, {
                position: newPosition,
                rotation: newRotation,
                scale: newScale,
              });
            }
          }}
        />
      ))}
    </group>
  );
}
