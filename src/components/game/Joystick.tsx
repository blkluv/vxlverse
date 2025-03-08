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
        buttonNumber={0}
      />
      <div className="fixed pointer-events-auto bottom-6 right-6 flex flex-col gap-5">
        <button
          className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 text-white flex items-center justify-center border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] active:shadow-[0_0_8px_rgba(245,158,11,0.8)] active:scale-95 transition-all duration-150 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-amber-300/20"
          onClick={attack}
          aria-label="Attack"
        >
          <div
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]"
            opacity-30
          ></div>
          <span className="text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] z-10">
            🗡️
          </span>
        </button>

        <button
          className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] active:shadow-[0_0_8px_rgba(16,185,129,0.8)] active:scale-95 transition-all duration-150 relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-emerald-300/20"
          onClick={jump}
          aria-label="Jump"
        >
          <div
            className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz48L3N2Zz4=')]"
            opacity-30
          ></div>
          <span className="text-xs drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)] z-10">
            Jump
          </span>
        </button>
      </div>
    </div>
  );
}
