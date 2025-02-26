import { useRef } from "react";
import * as THREE from "three";
import { EditorGameObject } from "./editor/EditorGameObject";
import { GameGameObject } from "./game/GameGameObject";
import { Quest } from "../types";

interface GameObjectProps {
  modelUrl: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  isSelected: boolean;
  quests?: Quest[];
  thumbnail?: string;
  activeAnimation?: string;
  interactionSound?: string;
  onClick?: (e: THREE.Event) => void;
  transformMode?: "translate" | "rotate" | "scale";
  onTransform?: (
    position: THREE.Vector3,
    rotation: THREE.Euler,
    scale: THREE.Vector3
  ) => void;
}

export function GameObject(props: GameObjectProps) {
  const isGameMode = window.location.pathname.includes("/game");

  if (isGameMode) {
    return (
      <GameGameObject
        modelUrl={props.modelUrl}
        position={props.position}
        rotation={props.rotation}
        scale={props.scale}
        quests={props.quests}
        activeAnimation={props.activeAnimation}
        interactionSound={props.interactionSound}
        onClick={props.onClick}
      />
    );
  } else {
    return (
      <EditorGameObject
        modelUrl={props.modelUrl}
        position={props.position}
        rotation={props.rotation}
        scale={props.scale}
        isSelected={props.isSelected}
        thumbnail={props.thumbnail}
        transformMode={props.transformMode}
        onClick={props.onClick}
        onTransform={props.onTransform}
      />
    );
  }
}
