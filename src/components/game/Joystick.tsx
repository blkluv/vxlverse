import { EcctrlJoystick } from "ecctrl";
import { MeshStandardMaterial, SphereGeometry } from "three";
export function Joystick() {
  return (
    <div className="md:hidden">
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
        buttonNumber={0}
      />
    </div>
  );
}
