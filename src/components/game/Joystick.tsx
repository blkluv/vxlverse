import { EcctrlJoystick, useJoystickControls } from "ecctrl";
import { MeshStandardMaterial, SphereGeometry } from "three";
import { useGameStore } from "../../stores/gameStore";
import { cn } from "../UI";
export function Joystick() {
  const { activeNpc } = useGameStore();
  const joystick = useJoystickControls();

  const attack = () => {
    joystick.pressButton5();
  };

  const jump = () => {
    joystick.pressButton1();

    setTimeout(() => {
      joystick.releaseAllButtons();
    }, 100);
  };
  return (
    <div
      className={cn("md:hidden pointer-events-none z-40 fixed", {
        hidden: activeNpc,
      })}
    >
      <EcctrlJoystick
        joystickStickProps={{
          material: new MeshStandardMaterial({
            color: 0x000,
            transparent: true,
            opacity: 0,
          }),
        }}
        joystickHandleProps={{
          geometry: new SphereGeometry(1, 20, 20),
          material: new MeshStandardMaterial({
            emissive: "#aaa",
            emissiveIntensity: 0.8,
          }),
        }}
        joystickBaseProps={{
          geometry: new SphereGeometry(2, 40, 40),
          material: new MeshStandardMaterial({
            transparent: true,
            opacity: 0.8,
          }),
        }}
        buttonNumber={2}
      />
    </div>
  );
}
