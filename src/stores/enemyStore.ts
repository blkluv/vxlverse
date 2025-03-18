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

      // If we couldn't find a good position after max attempts, don't spawn
      if (attempts >= maxAttempts) return;

      const types = Object.keys(ENEMY_TYPES) as (keyof typeof ENEMY_TYPES)[];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const baseEnemy = ENEMY_TYPES[randomType];

      // Get player level and scale enemy accordingly
      const playerLevel = useGameStore.getState().playerStats.level;

      // Enemy level will be -2 to +2 of player level
      const levelDiff = Math.floor(Math.random() * 5) - 2;
      const enemyLevel = Math.max(1, playerLevel + levelDiff);

      // Scale enemy stats based on level
      const levelScale = enemyLevel / baseEnemy.level;
      const health = Math.floor(baseEnemy.health * levelScale * 1.5); // 50% more HP than equivalent player level
      const damage = Math.floor(baseEnemy.damage * levelScale);
      const xp = Math.floor(baseEnemy.xp * levelScale);

      do {
        position = {
          x: (Math.random() - 0.5) * SPAWN_RADIUS * 2,
          y: 0,
          z: (Math.random() - 0.5) * SPAWN_RADIUS * 2,
        };

        // Check distance from all NPCs
        const isFarEnough = npcPositions.every((npcPos) => {
          const dx = position.x - npcPos.x;
          const dz = position.z - npcPos.z;
          return Math.sqrt(dx * dx + dz * dz) >= MIN_DISTANCE_FROM_NPC;
        });

        if (isFarEnough) break;
        attempts++;
      } while (attempts < maxAttempts);

      const enemy: Enemy = {
        id: nanoid(),
        type: randomType,
        position,
        health,
        maxHealth: health,
        damage,
        xp,
        level: enemyLevel,
        loot: baseEnemy.loot,
        model: baseEnemy.model,
        scale: baseEnemy.scale,
        name: `${baseEnemy.name}`,
        attackRange: baseEnemy.attackRange,
        attackSpeed: baseEnemy.attackSpeed,
        moveSpeed: baseEnemy.moveSpeed,
      };

      set((state) => ({ enemies: [...state.enemies, enemy] }));
    },

    removeEnemy: (id: string) => {
      const enemy = get().enemies.find((e) => e.id === id);
      if (!enemy) return;

      // Add to dying enemies list
      set((state) => ({ dyingEnemies: [...state.dyingEnemies, id] }));

      // Calculate dropped loot
      const droppedLoot: { itemId: string; amount: number }[] = [];
      const randomLoot = enemy.loot[Math.floor(Math.random() * enemy.loot.length)];

      if (Math.random() <= randomLoot.chance) {
        const itemId = randomLoot.itemId;
        const amount = randomLoot.amount * Math.floor(Math.random() * 5);
        droppedLoot.push({ itemId, amount });
        useGameStore.getState().addToInventory(itemId, amount);
      }

      // Add XP to player
      const gameStore = useGameStore.getState();
      const currentXP = gameStore.playerStats.xp;
      gameStore.updatePlayerStats({ xp: currentXP + enemy.xp });

      // Remove enemy from list after delay and show rewards
      setTimeout(() => {
        set((state) => ({
          enemies: state.enemies.filter((e) => e.id !== id),
          dyingEnemies: state.dyingEnemies.filter((e) => e !== id),
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
