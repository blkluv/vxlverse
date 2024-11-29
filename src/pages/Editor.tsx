import { Canvas } from "@react-three/fiber";
import { Scene } from "../components/Scene";
import { ScenePanel } from "../components/editor/ScenePanel";
import { PropertiesPanel } from "../components/editor/PropertiesPanel";
import { Loader, OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useEditorStore } from "../stores/editorStore";
import * as THREE from "three";
import { AIGenerationInput } from "../components/editor/AIGenerationInput";

export function Editor() {
  const { scenes, addScene } = useEditorStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      // Here you would integrate with your AI generation service
      console.log("Generating from prompt:", prompt);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (scenes.length === 0) {
      const defaultScene = {
        id: new THREE.Object3D().uuid,
        name: "Main Scene",
        objects: [],
      };
      addScene(defaultScene);
    }
  }, [scenes.length, addScene]);

  return (
    <div className="flex w-full h-screen bg-slate-900">
      <ScenePanel />

      <div className="relative flex-1">
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [5, 5, 5], fov: 50 }}
          className="w-full h-full"
        >
          <Scene />
          <OrbitControls makeDefault />
        </Canvas>
        <Loader />

        <PropertiesPanel />
        <AIGenerationInput
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
