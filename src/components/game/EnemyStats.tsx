import { Html } from "@react-three/drei";
import { Enemy } from "../../types";

interface EnemyStatsProps {
  enemy: Enemy;
}

export function EnemyStats({ enemy }: EnemyStatsProps) {
  const healthPercentage = (enemy.health / enemy.maxHealth) * 100;

  return (
    <Html
      position={[0, 2, 0]} // Position above the enemy
      center
      distanceFactor={8}
      occlude
    >
      <div className="pointer-events-none select-none">
        {/* Name and Level */}
        <div className="text-center mb-1">
          <div className="text-white text-sm font-bold bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-lg">
            {enemy.name}
          </div>
        </div>

        {/* Health Bar */}
        <div className="w-24 bg-black/80 backdrop-blur-sm rounded-lg p-1">
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
          <div className="text-center text-xs text-white/90 mt-0.5">
            {enemy.health}/{enemy.maxHealth}
          </div>
        </div>

        {/* XP Indicator */}
        <div className="text-center mt-1">
          <div className="text-yellow-400 text-xs bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-lg">
            +{enemy.xp} XP
          </div>
        </div>
      </div>
    </Html>
  );
}
