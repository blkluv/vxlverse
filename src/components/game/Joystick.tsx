import { EcctrlJoystick, useJoystickControls } from "ecctrl";
import { MeshStandardMaterial, SphereGeometry, OctahedronGeometry } from "three";
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
        joystickPositionLeft={-20}
        joystickStickProps={{
          geometry: new OctahedronGeometry(1, 1),

          material: new MeshStandardMaterial({
            color: 0x00,
            transparent: true,
            opacity: 0,
          }),
        }}
        joystickHandleProps={{
          geometry: new SphereGeometry(1.5, 4, 4),
          material: new MeshStandardMaterial({
            emissive: "#7FE4FF", // Orange-red glow
            emissiveIntensity: 1.0, // Very intense glow
            roughness: 0.3, // Slightly rough
            metalness: 0.7, // Somewhat metallic
            envMapIntensity: 2.0, // Strong reflections
            // wireframe removed for solid appearance
            transparent: true, // Enable transparency
            opacity: 1, // Slightly transparent
          }),
        }}
        joystickBaseProps={{
          geometry: new SphereGeometry(2, 8, 8),
          material: new MeshStandardMaterial({
            emissive: "#7FE4FF", // Orange-red glow
            emissiveIntensity: 0.5, // Very intense glow
            roughness: 0.3, // Slightly rough
            metalness: 0.7, // Somewhat metallic
            envMapIntensity: 2.0, // Strong reflections
            // wireframe removed for solid appearance
            transparent: true, // Enable transparency
            opacity: 0.5, // Slightly transparent
          }),
        }}
        buttonLargeBaseProps={{
          geometry: new SphereGeometry(1, 6, 6),
          material: new MeshStandardMaterial({
            color: "#000000", // Deep blue base
            emissive: "#7FE4FF", // Sky blue glow
            emissiveIntensity: 2.5, // Intense glow
            roughness: 0.1, // Very glossy
            metalness: 1.0, // Fully metallic
            envMapIntensity: 3.0, // Strong reflections
            // wireframe removed for solid appearance
            transparent: true, // Enable transparency
            opacity: 1, // Slightly transparent
          }),
        }}
        buttonSmallBaseProps={{
          geometry: new SphereGeometry(1, 6, 6),
          material: new MeshStandardMaterial({
            color: "#000000", // Deep blue base
            emissive: "#7FE4FF", // Sky blue glow
            emissiveIntensity: 2.5, // Intense glow
            roughness: 0.1, // Very glossy
            metalness: 1.0, // Fully metallic
            envMapIntensity: 3.0, // Strong reflections
            // wireframe removed for solid appearance
            transparent: true, // Enable transparency
            opacity: 1, // Slightly transparent
          }),
        }}
        buttonTop1Props={{
          // Using a low-poly geometry for a crystal-like appearance
          geometry: new SphereGeometry(1.5, 6, 6),
          material: new MeshStandardMaterial({
            color: "#0d47a1", // Deep blue base
            emissive: "#7FE4FF", // Sky blue glow
            emissiveIntensity: 2.5, // Intense glow
            roughness: 0.1, // Very glossy
            metalness: 1.0, // Fully metallic
            envMapIntensity: 3.0, // Strong reflections
            // wireframe removed for solid appearance
            transparent: true, // Enable transparency
            opacity: 0.5, // Slightly transparent
          }),
        }}
        buttonTop5Props={{
          // Using a low-poly geometry for a fiery appearance
          geometry: new SphereGeometry(1.5, 6, 6),
          material: new MeshStandardMaterial({
            color: "#b71c1c", // Deep red base
            emissive: "#ff9100", // Orange-red glow
            emissiveIntensity: 3.0, // Very intense glow
            roughness: 0.3, // Slightly rough
            metalness: 0.7, // Somewhat metallic
            envMapIntensity: 2.0, // Strong reflections
            // wireframe removed for solid appearance
            transparent: true, // Enable transparency
            opacity: 0.5, // Slightly transparent
          }),
        }}
        buttonGroup1Position={[-0.5, -1, 0]}
        buttonGroup2Position={[-10, 0, 0]}
        buttonGroup3Position={[-10, 0, 0]}
        buttonGroup4Position={[-10, 0, 0]}
        buttonGroup5Position={[1.7, 0.3, 0]}
        buttonNumber={5}
      />
    </div>
  );
}
