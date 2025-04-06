import { Box, useGLTF, useTexture } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import { useEditorStore } from "../../stores/editorStore";
import * as THREE from "three";
import { GameObject } from "../../types";

function Paint({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);
  return (
    <group>
      <mesh>
        <boxGeometry args={[10, 10, 0.5]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

export function PhysicsArea() {
  const { scene } = useGLTF("/models/artgallery.glb", true);
  const galleryRef = useRef<THREE.Group>(null);
  const paintingRef = useRef<THREE.Group>(null);

  const { scenes, currentSceneId, addObject, selectedObjectId, gridSnap, brushActive } =
    useEditorStore();
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.position.set(0, 0, 0);
      galleryRef.current.scale.set(1, 1, 1);

      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
    }
  }, [clonedScene]);

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!paintingRef.current) return;
    const [first] = event.intersections;
    if (!first) return;
    const normal = first.face?.normal;
    const position = first.point;
    if (!normal || !position) return;

    position.add(normal);

    if (gridSnap) {
      position.set(Math.round(position.x), Math.round(position.y), Math.round(position.z));
    }

    paintingRef.current.position.copy(position);

    if (Math.abs(normal.y) > 0.9) {
      paintingRef.current.rotation.set(0, 0, 0);
    } else {
      const lookAtPos = position.clone().sub(normal);
      lookAtPos.y = position.y;
      paintingRef.current.lookAt(lookAtPos);
      paintingRef.current.rotation.x = 0;
      paintingRef.current.rotation.z = 0;
    }
  };

  const selectedPainting = useMemo(() => {
    if (!selectedObjectId) return null;
    const currObj = scenes
      ?.find((s) => s.id === currentSceneId)
      ?.objects?.find((o) => o.id === selectedObjectId);
    return currObj;
  }, [scenes, selectedObjectId, currentSceneId]);

  const addPainting = () => {
    if (!selectedObjectId) return;
    const currObj = scenes
      ?.find((s) => s.id === currentSceneId)
      ?.objects?.find((o) => o.id === selectedObjectId);
    if (!currObj) return;
    const id = new THREE.Object3D().uuid;
    const newPainting = {
      id,
      position: paintingRef.current?.position,
      rotation: paintingRef.current?.rotation,
      scale: paintingRef.current?.scale,
      name: `Painting ${id.slice(-6)}`,
      imageUrl: currObj.imageUrl ?? "",
    } as GameObject;
    if (!currentSceneId) return;
    addObject(currentSceneId, newPainting);
  };

  return (
    <>
      {selectedPainting && brushActive && (
        <group ref={paintingRef}>
          <Paint imageUrl={selectedPainting.imageUrl ?? ""} />
        </group>
      )}
      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[28.074240273245735, 10.320066228859993, -50.53513854087428]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 19.967514259002275, 138.31675726719357]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-28.099190510049553, 10.320066228859993, -50.53513854087428]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 19.967514259002275, 138.31675726719357]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-30.673658891111664, 11.924236094015406, 63.20601066471109]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 23.235346438996714, 91.05860062666117]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[30.573658891111664, 11.924236094015406, 63.20601066471109]}
        rotation={[0, 0, 0]}
        scale={[0.32569991534527143, 23.235346438996714, 91.05860062666117]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-0.39954031579897986, 12.809816915989206, 108.43256308749729]}
        rotation={[0, 0, 0]}
        scale={[60.5779367504754, 21.781123064288085, 1.4396012563922178]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[0.39954031579897986, 10.119850165385632, -119.93882746000172]}
        rotation={[0, 0, 0]}
        scale={[60.5779367504754, 21.781123064288085, 1.4396012563922178]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[20.660679450910656, 8.526142687932246, -30.75974006989552]}
        rotation={[0, 0, 0]}
        scale={[17.751554863310194, 14.003651999383852, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-21.753696967218218, 8.526142687932246, -30.75974006989552]}
        rotation={[0, 0, 0]}
        scale={[17.751554863310194, 14.003651999383852, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-18.186416420525397, 8.526142687932246, 18.012148880007576]}
        rotation={[0, 0, 0]}
        scale={[21.496307677764424, 22.826380486218813, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[18.022778670184913, 8.526142687932246, 18.012148880007576]}
        rotation={[0, 0, 0]}
        scale={[21.496307677764424, 22.826380486218813, 0.8348785536016097]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <Box
        onDoubleClick={addPainting}
        onPointerMove={handlePointerMove}
        position={[-0.3178609843752156, 8.673026543030618, -74.29217556618775]}
        rotation={[0, 0, 0]}
        scale={[23.667055730843213, 13.126795246184962, 0.8699142340470483]}
        args={[1, 1, 1]}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Box>
    </>
  );
}
