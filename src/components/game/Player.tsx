import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { KeyboardControls } from "@react-three/drei";
import { Hero } from "./Hero";

const animationSet = {
  idle: "HumanArmature|Man_Idle",
  walk: "HumanArmature|Man_Walk",
  run: "HumanArmature|Man_Run",
  jump: "HumanArmature|Man_Jump",
  jumpIdle: "HumanArmature|Man_RunningJump",
  jumpLand: "HumanArmature|Man_Standing",
  fall: "HumanArmature|Man_Death", // Falling could be represented by a death animation
  action1: "HumanArmature|Man_Clapping",
  action2: "HumanArmature|Man_Sitting",
  action3: "HumanArmature|Man_Punch",
  action4: "HumanArmature|Man_SwordSlash", // Attack action
};

export function Player() {
  return (
    <Ecctrl
      mode="PointToMove"
      maxVelLimit={5}
      camCollision={false} // disable camera collision detect (useless in FP mode)
      camFollowMult={1000} // give a big number here, so the camera follows the target (character) instantly
      camLerpMult={1000} // give a big number here, so the camera lerp to the followCam position instantly
      turnVelMultiplier={1} // Turning speed same as moving speed
      turnSpeed={100} // give it big turning speed to prevent turning wait time
      animated
    >
      <EcctrlAnimation
        characterURL={"/player.glb"} // Must have property
        animationSet={animationSet} // Must have property
      >
        <Hero />
      </EcctrlAnimation>
    </Ecctrl>
  );
}
