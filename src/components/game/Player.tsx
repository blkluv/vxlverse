import { useRef } from "react";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { KeyboardControls } from "@react-three/drei";
import { Hero } from "./Hero";
import { RapierRigidBody } from "@react-three/rapier";
const animationSet = {
  idle: "Idle",
  walk: "Walk",
  run: "Run",
  jump: "Jump",
  jumpIdle: "Jump",
  jumpLand: "Land",
  fall: "Jump", // Falling now uses the valid "jump" action
  action1: "Attack",
};

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action1", keys: ["1", "!"] },
];

export function Player() {
  const ref = useRef<RapierRigidBody>(null);
  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl ref={ref} animated camMinDis={30} camMaxDis={10}>
        <EcctrlAnimation characterURL="/player.glb" animationSet={animationSet}>
          <Hero ref={ref} />
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
  );
}
