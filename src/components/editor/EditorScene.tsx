import { useRef, useEffect, Suspense } from "react";
import { useEditorStore } from "../../stores/editorStore";
import {
  Environment,
  Grid,
  Sky,
  Cloud,
  Stars,
  GizmoHelper,
  GizmoViewport,
} from "@react-three/drei";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { Scene as SceneType } from "../../types";
import { EditorGameObject } from "./EditorGameObject";
import { EditorBoxCollider } from "./EditorBoxCollider";

interface EditorSceneProps {
  sceneData?: SceneType;
  isPreview?: boolean;
  showGrid?: boolean;
  gridSnap?: boolean;
  transformMode?: "translate" | "rotate" | "scale";
  focusOnObject?: boolean;
  orbitControlsRef?: React.MutableRefObject<any>;
}

export function EditorScene({
  sceneData,
  showGrid = true,
  gridSnap = false,
  transformMode = "translate",
  focusOnObject = false,
  orbitControlsRef,
}: EditorSceneProps = {}) {
  const { camera } = useThree();
  const selectedObjectId = useEditorStore((state) => state.selectedObjectId);
  const setSelectedObjectId = useEditorStore((state) => state.setSelectedObject);
  const updateObject = useEditorStore((state) => state.updateObject);
  const currentSceneId = useEditorStore((state) => state.currentSceneId);
  const scenes = useEditorStore((state) => state.scenes);
  const currentScene = sceneData || scenes.find((scene) => scene.id === currentSceneId);
  const brushActive = useEditorStore((state) => state.brushActive);
  const setBrushActive = useEditorStore((state) => state.setBrushActive);
  const placeObjectWithBrush = useEditorStore((state) => state.placeObjectWithBrush);

  // Ref to track if we've focused on the selected object
  const hasFocusedRef = useRef(false);

  // Reset focus flag when selected object changes
  useEffect(() => {
    hasFocusedRef.current = false;
  }, [selectedObjectId]);

  // Focus camera on selected object if needed
  useEffect(() => {
    if (
      focusOnObject &&
      selectedObjectId &&
      !hasFocusedRef.current &&
      orbitControlsRef?.current &&
      currentScene
    ) {
      const selectedObject = currentScene.objects.find((obj) => obj.id === selectedObjectId);
      if (selectedObject) {
        // Focus the camera on the selected object
        const target = new THREE.Vector3(
          selectedObject.position.x,
          selectedObject.position.y,
          selectedObject.position.z
        );
        orbitControlsRef.current.target.copy(target);

        // Move the camera to a position that gives a good view of the object
        const offset = new THREE.Vector3(5, 5, 5);
        camera.position.copy(target).add(offset);

        // Update the orbit controls
        orbitControlsRef.current.update();

        // Mark that we've focused on this object
        hasFocusedRef.current = true;
      }
    }
  }, [selectedObjectId, focusOnObject, orbitControlsRef, currentScene, camera.position]);

  // Handle background click to deselect objects
  const handleBackgroundClick = (e: THREE.Event) => {
    if (brushActive && currentSceneId) {
      // If brush mode is active, place an object at the intersection point
      if (e.point) {
        // Stop event propagation to prevent multiple placements
        e.stopPropagation();

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
      }
    } else {
      // Check if we're currently transforming an object
      const isTransforming = useEditorStore.getState().isTransforming;

      // Only deselect if we're not currently transforming
      if (!isTransforming) {
        setSelectedObjectId(null);
      }
    }
  };

  // Handle object selection and transformation
  const handleObjectClick = (objectId: string) => {
    setSelectedObjectId(objectId);
  };
  const targetRef = useRef<THREE.Mesh>(null);
  const handleObjectTransform = (
    objectId: string,
    position: THREE.Vector3,
    rotation: THREE.Euler,
    scale: THREE.Vector3
  ) => {
    if (currentSceneId) {
      updateObject(currentSceneId, objectId, {
        position,
        rotation,
        scale,
      });
    }
  };
  const selectedObject = currentScene?.objects.find((obj) => obj.id === selectedObjectId);
  if (!currentScene) return null;

  return (
    <>
      {/* Environment */}
      {currentScene.environment && (
        <Environment
          preset={currentScene.environment as any}
          background={currentScene.background === "environment"}
        />
      )}

      {/* Sky */}
      {currentScene.background === "sky" && (
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
      )}

      {/* Ambient Light */}
      <ambientLight intensity={currentScene.ambientLight || 0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* Grid */}
      {showGrid && (
        <Grid
          position={[0, 0.5, 0]}
          args={[100, 100]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={gridSnap ? "#4080ff" : "#6f6f6f"}
          sectionSize={3}
          sectionThickness={1}
          sectionColor={gridSnap ? "#4080ff" : "#9d4b4b"}
          fadeDistance={100}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />
      )}

      {brushActive && (
        <mesh ref={targetRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshBasicMaterial color="#f0215e" transparent />
        </mesh>
      )}

      {/* Background plane for click detection */}
      <mesh
        onPointerMove={(v) => {
          if (targetRef.current) {
            targetRef.current.position.copy(v.point).add(new THREE.Vector3(0, 0.01, 0));
          }
        }}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onDoubleClick={handleBackgroundClick}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.0} side={THREE.DoubleSide} />
      </mesh>

      {/* Scene Objects */}
      {currentScene.objects
        ?.filter((object) => object.type !== "boxCollider")
        ?.map((object) => (
          <Suspense key={object.id} fallback={"loading"}>
            <EditorGameObject
              id={object.id}
              modelUrl={object.modelUrl}
              position={object.position}
              rotation={object.rotation}
              scale={object.scale}
              type={object.type}
              isSelected={object.id === selectedObjectId}
              transformMode={transformMode}
              onClick={() => handleObjectClick(object.id)}
              onTransform={(position, rotation, scale) =>
                handleObjectTransform(object.id, position, rotation, scale)
              }
              thumbnail={object.modelUrl.replace("scene_", "thumbnail_").replace(".glb", ".webp")}
            />
          </Suspense>
        ))}

      {/* Box Colliders */}
      {currentScene.objects
        ?.filter((object) => object.type === "boxCollider")
        ?.map((boxCollider) => (
          <Suspense key={boxCollider.id} fallback={"loading"}>
            <EditorBoxCollider
              id={boxCollider.id}
              position={boxCollider.position}
              rotation={boxCollider.rotation}
              scale={boxCollider.scale}
              isSelected={boxCollider.id === selectedObjectId}
              transformMode={transformMode}
              onClick={() => handleObjectClick(boxCollider.id)}
              onTransform={(position, rotation, scale) =>
                handleObjectTransform(boxCollider.id, position, rotation, scale)
              }
            />
          </Suspense>
        ))}

      {/* Clouds */}
      {currentScene.clouds?.enabled && (
        <>
          {Array.from({ length: currentScene.clouds.count || 10 }).map((_, i) => (
            <Cloud
              key={i}
              position={[
                (Math.random() - 0.5) * 50,
                10 + Math.random() * 10,
                (Math.random() - 0.5) * 50,
              ]}
              opacity={currentScene.clouds.opacity || 0.5}
              speed={currentScene.clouds.speed || 0.4}
              width={10 + Math.random() * 10}
              depth={1.5}
            />
          ))}
        </>
      )}

      <GizmoHelper
        alignment="top-right" // widget alignment within scene
        margin={[100, 100]}
      >
        <GizmoViewport axisColors={["#f48", "#00e676", "#00b0ff"]} labelColor="black" />
      </GizmoHelper>
      {/* Stars */}
      {currentScene.stars?.enabled && (
        <Stars
          radius={100}
          depth={currentScene.stars.depth || 50}
          count={currentScene.stars.count || 5000}
          factor={4}
          saturation={0}
          fade={currentScene.stars.fade !== false}
        />
      )}

      {/* Fog */}
      {currentScene.fog && (
        <fog
          attach="fog"
          args={[
            currentScene.fog.color || "#ffffff",
            currentScene.fog.near || 10,
            currentScene.fog.far || 100,
          ]}
        />
      )}
    </>
  );
}
