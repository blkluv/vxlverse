import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { KeyboardControls } from "@react-three/drei";
import { Hero } from "./Hero";
const animationSet = {
  idle: "Idle",
  walk: "Walk",
  run: "run",
  jump: "jump",
  jumpIdle: "jump",
  jumpLand: "land",
  fall: "jump", // Falling now uses the valid "jump" action
  action1: "Attack",
};

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  // Optional animation key map
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];
export function Player() {
  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl animated camMinDis={30} camMaxDis={20}>
        <EcctrlAnimation
          characterURL={"/player.glb"} // Must have property
          animationSet={animationSet} // Must have property
        >
          <Hero />
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
  );
}
