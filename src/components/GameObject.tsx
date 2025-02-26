import { useMemo, useRef, useState, useEffect } from "react";
import { useGLTF, TransformControls, useAnimations } from "@react-three/drei";
import { useGameStore } from "../stores/gameStore";
import * as THREE from "three";
import { useSound } from "../hooks/useSound";
import { useThree } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import { useEditorStore } from "../stores/editorStore";
import { toast } from "./UI/Toast";

// same url multiple GLTF instances
function useGltfMemo(url: string) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => {
    const clonedScene = SkeletonUtils.clone(gltf.scene);

    // Make all meshes in the scene interactive
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData.selectable = true;
        // Ensure the mesh has proper raycast behavior
        child.raycast = (raycaster, intersects) => {
          THREE.Mesh.prototype.raycast.call(child, raycaster, intersects);
        };
      }
    });

    return clonedScene;
  }, [gltf.scene]);

  return { ...gltf, animations: [...gltf.animations], scene: scene };
}

interface GameObjectProps {
  modelUrl: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  isSelected: boolean;
  quests?: any[];
  thumbnail?: string;
  onClick?: (e: THREE.Event) => void;
  transformMode?: "translate" | "rotate" | "scale";
  onTransform?: (
    position: THREE.Vector3,
    rotation: THREE.Euler,
    scale: THREE.Vector3
  ) => void;
}

export function GameObject({
  modelUrl,
  position,
  rotation,
  scale,
  isSelected,
  quests,
  thumbnail,
  transformMode,
  onClick,
  onTransform,
}: GameObjectProps) {
  const { scene, animations } = useGltfMemo(modelUrl);
  const setActiveQuest = useGameStore((state) => state.setActiveQuest);
  const questLog = useGameStore((state) => state.questLog);
  const setActiveDialogue = useGameStore((state) => state.setActiveDialogue);
  const { playSound } = useSound();
  const isGameMode = window.location.pathname === "/game" || "/";
  const isEditor = window.location.pathname === "/editor";
  const groupRef = useRef<THREE.Group>(null);
  const objectRef = useRef<THREE.Group>(null);

  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const gridSnap = useEditorStore((state) => state.gridSnap);

  // Get the selected object to access its activeAnimation property
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const scenes = useEditorStore((state) => state.scenes);
  const currentScene = scenes.find((scene) => scene.id === currentSceneId);
  const selectedObject = currentScene?.objects.find(
    (obj) => obj.id === selectedObjectId
  );

  // Animation setup
  const { actions, mixer } = useAnimations(animations, objectRef);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  // Get brush mode state from editorStore
  const brushActive = useEditorStore((state) => state.brushActive);
  const placeObjectWithBrush = useEditorStore(
    (state) => state.placeObjectWithBrush
  );

  // Update the object's position when the position prop changes
  useEffect(() => {
    if (objectRef.current) {
      objectRef.current.position.copy(position);
      objectRef.current.rotation.copy(rotation);
      objectRef.current.scale.copy(scale);
    }
  }, [position, rotation, scale]);

  // Handle animations when activeAnimation changes
  useEffect(() => {
    // Safety check for actions
    if (!actions || Object.keys(actions).length === 0) return;
    
    // If this is the selected object and it has an activeAnimation
    if (isSelected && selectedObject?.activeAnimation) {
      const animationName = selectedObject.activeAnimation;
      
      // Check if the animation exists in the actions object
      if (actions[animationName]) {
        try {
          // Stop any current animation if it exists
          if (currentAnimation && actions[currentAnimation]) {
            actions[currentAnimation].fadeOut(0.5);
          }
          
          // Play the new animation with fade in
          actions[animationName].reset().fadeIn(0.5).play();
          setCurrentAnimation(animationName);
        } catch (error) {
          console.error("Error playing animation:", error);
          setCurrentAnimation(null);
        }
      }
    } else if (currentAnimation) {
      // Stop animation when object is deselected
      try {
        if (actions[currentAnimation]) {
          actions[currentAnimation].fadeOut(0.5);
        }
      } catch (error) {
        console.error("Error stopping animation:", error);
      }
      setCurrentAnimation(null);
    }
  }, [actions, isSelected, selectedObject?.activeAnimation]);

  // Clean up animations when component unmounts
  useEffect(() => {
    return () => {
      if (mixer) {
        try {
          mixer.stopAllAction();
        } catch (error) {
          console.error("Error cleaning up animations:", error);
        }
      }
    };
  }, [mixer]);

  const handleClick = (e: THREE.Event) => {
    // Only stop propagation when necessary
    if (!brushActive) {
      e.stopPropagation();
    }

    // Play interaction sound if available
    if (selectedObject?.interactionSound) {
      playSound(selectedObject.interactionSound);
    }

    // If brush mode is active, place an object at the intersection point
    if (brushActive && currentSceneId) {
      // Get the intersection point
      if (e.point) {
        let position = e.point.clone();

        // Apply grid snap if needed
        if (gridSnap) {
          position.x = Math.round(position.x * 2) / 2; // Snap to 0.5 unit grid
          position.y = Math.round(position.y * 2) / 2;
          position.z = Math.round(position.z * 2) / 2;
        }

        // Place the object at the intersection point
        placeObjectWithBrush(currentSceneId, position);

        // Show success toast
        toast.success("Object placed successfully");
        return;
      }
    }

    if (isGameMode && quests && quests.length > 0) {
      const quest = quests[0];
      if (quest.dialogues && quest.dialogues.length > 0) {
        setActiveDialogue(quest.dialogues[0]);
      }
      setActiveQuest(quest);
    }

    if (onClick) {
      onClick(e);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    if (!objectRef.current || !onTransform) return;

    // Only update the store when dragging ends
    const newPosition = objectRef.current.position.clone();
    const newRotation = objectRef.current.rotation.clone();
    const newScale = objectRef.current.scale.clone();

    // Update the store with the new values
    onTransform(newPosition, newRotation, newScale);
    setIsDragging(false);
  };

  // Apply grid snapping during transformation
  const handleObjectChange = () => {
    if (!objectRef.current || !gridSnap) return;

    // Apply grid snapping during transformation for immediate visual feedback
    if (transformMode === "translate") {
      // Snap position to 0.5 unit grid
      objectRef.current.position.x =
        Math.round(objectRef.current.position.x * 2) / 2;
      objectRef.current.position.y =
        Math.round(objectRef.current.position.y * 2) / 2;
      objectRef.current.position.z =
        Math.round(objectRef.current.position.z * 2) / 2;
    } else if (transformMode === "rotate") {
      // Snap rotation to 15-degree increments (Math.PI/12 radians)
      objectRef.current.rotation.x =
        Math.round(objectRef.current.rotation.x / (Math.PI / 12)) *
        (Math.PI / 12);
      objectRef.current.rotation.y =
        Math.round(objectRef.current.rotation.y / (Math.PI / 12)) *
        (Math.PI / 12);
      objectRef.current.rotation.z =
        Math.round(objectRef.current.rotation.z / (Math.PI / 12)) *
        (Math.PI / 12);
    } else if (transformMode === "scale") {
      // Snap scale to 0.25 increments
      objectRef.current.scale.x = Math.round(objectRef.current.scale.x * 4) / 4;
      objectRef.current.scale.y = Math.round(objectRef.current.scale.y * 4) / 4;
      objectRef.current.scale.z = Math.round(objectRef.current.scale.z * 4) / 4;
    }
  };

  return (
    <group ref={groupRef}>
      <group
        ref={objectRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handleClick}
        onPointerDown={(e) => {
          // Only stop propagation when not in brush mode
          if (!brushActive) {
            e.stopPropagation();
          }

          // Change cursor on pointer down
          document.body.style.cursor = "pointer";

          // Immediately call the onClick handler to make selection more responsive
          if (onClick && !brushActive) {
            onClick(e);
          }
        }}
        onPointerOver={() => {
          document.body.style.cursor = brushActive ? "crosshair" : "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <primitive
          object={scene}
          // Make the primitive object interactive
          onClick={(e) => {
            // Don't stop propagation when in brush mode
            if (!brushActive) {
              e.stopPropagation();
            }
            handleClick(e);
          }}
        />
      </group>

      {isSelected && (
        <TransformControls
          object={objectRef}
          onObjectChange={handleObjectChange}
          mode={transformMode}
          size={0.7}
          showX={true}
          showY={true}
          showZ={true}
          camera={camera}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          position={position}
        />
      )}
    </group>
  );
}
