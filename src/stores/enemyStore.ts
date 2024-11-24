import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Enemy, ENEMY_TYPES } from "../types";
import { nanoid } from "nanoid";
import { useGameStore } from "./gameStore";
import { useEditorStore } from "./editorStore";

const SPAWN_RADIUS = 30; // Increased spawn radius
const MAX_ENEMIES = 5;
const SPAWN_INTERVAL = 5000;
const MIN_DISTANCE_FROM_NPC = 10; // Increased minimum distance from NPCs

interface EnemyState {
  enemies: Enemy[];
  rewards: { itemId: string; amount: number; xp: number } | null;
  dyingEnemies: string[];
  spawnEnemy: () => void;
  removeEnemy: (id: string) => void;
  damageEnemy: (id: string, damage: number) => void;
  startSpawning: () => void;
  stopSpawning: () => void;
  clearRewards: () => void;
}

export const useEnemyStore = create<EnemyState>()(
  subscribeWithSelector((set, get) => ({
    enemies: [],
    rewards: null,
    dyingEnemies: [],

    spawnEnemy: () => {
      const { enemies } = get();
      if (enemies.length >= MAX_ENEMIES) return;

      // Get NPC positions from the editor store
      const currentScene = useEditorStore.getState().scenes[0];
      const npcPositions =
        currentScene?.objects.map((obj) => ({
          x: obj.position.x,
          z: obj.position.z,
        })) || [];

      // Keep trying positions until we find one far enough from NPCs
      let position;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        const angle = Math.random() * Math.PI * 2;
        const radius = SPAWN_RADIUS * Math.sqrt(Math.random()); // Better distribution
        position = {
          x: Math.cos(angle) * radius,
          y: 0,
          z: Math.sin(angle) * radius,
        };

        // Check distance from all NPCs
        const isFarEnough = npcPositions.every((npc) => {
          const dx = npc.x - position.x;
          const dz = npc.z - position.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          return distance > MIN_DISTANCE_FROM_NPC;
        });

        // Also check distance from other enemies
        const isFarFromEnemies = enemies.every((enemy) => {
          const dx = enemy.position.x - position.x;
          const dz = enemy.position.z - position.z;
          const distance = Math.sqrt(dx * dx + dz * dz);
          return distance > 5; // Minimum distance between enemies
        });

        if (isFarEnough && isFarFromEnemies) break;
        attempts++;
      } while (attempts < maxAttempts);

      // If we couldn't find a good position after max attempts, don't spawn
      if (attempts >= maxAttempts) return;

      const types = Object.keys(ENEMY_TYPES) as (keyof typeof ENEMY_TYPES)[];
      const type = types[Math.floor(Math.random() * types.length)];
      const enemyType = ENEMY_TYPES[type];

      const enemy: Enemy = {
        id: nanoid(),
        type,
        name: enemyType.name,
        position,
        health: enemyType.health,
        maxHealth: enemyType.health,
        damage: enemyType.damage,
        xp: enemyType.xp,
        loot: enemyType.loot,
        model: enemyType.model,
        scale: enemyType.scale,
      };

      set({ enemies: [...enemies, enemy] });
    },

    removeEnemy: (id: string) => {
      const enemy = get().enemies.find((e) => e.id === id);
      if (!enemy) return;

      // Add to dying enemies list
      set((state) => ({ dyingEnemies: [...state.dyingEnemies, id] }));

      // Calculate dropped loot
      const droppedLoot: { itemId: string; amount: number }[] = [];
      enemy.loot.forEach(({ itemId, chance, amount }) => {
        if (Math.random() <= chance) {
          droppedLoot.push({ itemId, amount });
          useGameStore.getState().addToInventory(itemId, amount);
        }
      });

      const baseXP = 100; // Base XP for the first level
      const increment = 50; // Increment factor

      // Function to calculate XP required for a given level
      function getXPForLevel(level: number) {
        return baseXP + increment * Math.pow(level, 2);
      }

      // Function to calculate the current level based on total XP
      function calculateLevel(totalXP: number) {
        let level = 1;
        let xpForNextLevel = getXPForLevel(level);

        while (totalXP >= xpForNextLevel) {
          level++;
          xpForNextLevel = getXPForLevel(level);
        }

        return Math.max(level - 1, 1); // Adjust to the correct level
      }

      // Update player XP
      const gameStore = useGameStore.getState();
      const currentStats = gameStore.playerStats;
      const newXP = currentStats.xp + enemy.xp;
      const newLevel = calculateLevel(newXP);

      gameStore.updatePlayerStats({
        xp: newXP,
        level: newLevel,
      });

      // Remove enemy after death animation
      setTimeout(() => {
        set((state) => ({
          enemies: state.enemies.filter((e) => e.id !== id),
          dyingEnemies: state.dyingEnemies.filter((eId) => eId !== id),
          // Only show rewards after enemy disappears
          rewards:
            droppedLoot.length > 0
              ? {
                  itemId: droppedLoot[0].itemId,
                  amount: droppedLoot[0].amount,
                  xp: enemy.xp,
                }
              : null,
        }));
      }, 1000);
    },

    damageEnemy: (id: string, damage: number) => {
      set({
        enemies: get().enemies.map((enemy) => {
          if (enemy.id === id) {
            const newHealth = enemy.health - damage;
            if (newHealth <= 0) {
              // Enemy died, handle loot
              get().removeEnemy(id);
              return enemy;
            }
            return { ...enemy, health: newHealth };
          }
          return enemy;
        }),
      });
    },

    startSpawning: () => {
      const interval = setInterval(() => {
        get().spawnEnemy();
      }, SPAWN_INTERVAL);

      // Store interval ID in window for cleanup
      (window as any).enemySpawnInterval = interval;
    },

    stopSpawning: () => {
      if ((window as any).enemySpawnInterval) {
        clearInterval((window as any).enemySpawnInterval);
      }
    },

    clearRewards: () => set({ rewards: null }),
  }))
);
