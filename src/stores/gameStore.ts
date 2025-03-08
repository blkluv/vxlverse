import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { Dialogue, Quest } from "../types";
import { Vector3 } from "three";

// Default scene ID
const DEFAULT_SCENE_ID = "village-scene";

interface PlayerStats {
  level: number;
  xp: number;
  xpNeeded: number;
  money: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  damage: number;
}

interface GameState {
  attack?: {
    initial: Vector3;
    target: Vector3;
  } | null;
  setAttack: (attack: GameState["attack"]) => void;
  playerStats: PlayerStats;
  timeOfDay: "morning" | "noon" | "evening" | "night";
  gameTime: {
    hours: number;
    minutes: number;
    day: number;
  };
  currentEnemy?: string | null;
  setCurrentEnemy: (id: string | null) => void;
  currentSceneId: string;
  activeQuest: Quest | null;
  activeNpc: string | null;
  dialogues: Dialogue[];
  inventory: { id: string; amount: number }[];
  questLog: {
    active: Quest[];
    completed: Quest[];
    failed: Quest[];
  };

  // UI State
  inventoryOpen: boolean;
  questLogOpen: boolean;
  merchantOpen: boolean;
  questGiverOpen: boolean;
  travelMasterOpen: boolean;
  mapOpen: boolean;
  showLevelUp: boolean;

  // Actions
  setCurrentSceneId: (id: string) => void;
  updatePlayerStats: (updates: Partial<GameState["playerStats"]>) => void;
  advanceTime: (minutes: number) => void;
  setActiveQuest: (quest: Quest | null) => void;
  setActiveNpc: (npcId: string | null) => void;
  addDialogue: (dialogue: Dialogue) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  addToInventory: (itemId: string, amount: number) => void;
  removeFromInventory: (itemId: string, amount: number) => boolean;
  hasItem: (itemId: string, amount?: number) => boolean;
  getItemCount: (itemId: string) => number;

  // UI Actions
  setShowLevelUp: (show: boolean) => void;
  setInventoryOpen: (open: boolean) => void;
  setQuestLogOpen: (open: boolean) => void;
  setMerchantOpen: (open: boolean) => void;
  setQuestGiverOpen: (open: boolean) => void;
  setTravelMasterOpen: (open: boolean) => void;
  setMapOpen: (open: boolean) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    subscribeWithSelector((set, get) => ({
      playerStats: {
        level: 1,
        xp: 0,
        xpNeeded: 125,
        money: 0,
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        damage: 10, // Starting damage
      },
      setAttack: (attack) => set({ attack }),
      currentEnemy: null,
      setCurrentEnemy: (id) => set({ currentEnemy: id }),
      timeOfDay: "morning",
      gameTime: {
        hours: 6,
        minutes: 0,
        day: 1,
      },
      currentSceneId: DEFAULT_SCENE_ID,
      activeQuest: null,
      activeNpc: null,
      dialogues: [],
      inventory: [],
      questLog: {
        active: [],
        completed: [],
        failed: [],
      },

      // UI State
      showLevelUp: false,
      inventoryOpen: false,
      questLogOpen: false,
      merchantOpen: false,
      questGiverOpen: false,
      travelMasterOpen: false,
      mapOpen: false,

      // Actions
      setCurrentSceneId: (id) => set({ currentSceneId: id }),
      updatePlayerStats: (updates: Partial<PlayerStats>) => {
        set((state) => {
          const newStats = { ...state.playerStats };

          // Update stats with validation
          if (updates.level !== undefined) newStats.level = updates.level;
          if (updates.xp !== undefined) newStats.xp = updates.xp;
          if (updates.money !== undefined)
            newStats.money = Math.max(0, updates.money);
          if (updates.energy !== undefined) {
            const newEnergy = Number(updates.energy);
            if (!isNaN(newEnergy)) {
              newStats.energy = Math.max(
                0,
                Math.min(newEnergy, newStats.maxEnergy)
              );
            }
          }
          if (updates.damage !== undefined) newStats.damage = updates.damage;

          // Calculate XP needed for next level
          const xpForNextLevel = (level: number) =>
            level * 100 + level * level * 25;
          newStats.xpNeeded = xpForNextLevel(newStats.level);

          // Level up logic
          while (newStats.xp >= newStats.xpNeeded) {
            newStats.xp -= newStats.xpNeeded;
            newStats.level += 1;
            newStats.energy = 100; // Restore energy to 100 on level up
            newStats.maxEnergy = 100; // Set max energy to 100
            newStats.damage += 5; // Increase damage by 5 per level
            newStats.xpNeeded = xpForNextLevel(newStats.level);
            get().setShowLevelUp(true);
          }

          return { playerStats: newStats };
        });
      },

      advanceTime: (minutes) =>
        set((state) => {
          const totalMinutes =
            state.gameTime.hours * 60 + state.gameTime.minutes + minutes;
          const newHours = Math.floor(totalMinutes / 60) % 24;
          const newMinutes = totalMinutes % 60;
          const addedDays = Math.floor(totalMinutes / (24 * 60));

          let timeOfDay: GameState["timeOfDay"] = state.timeOfDay;
          if (newHours >= 5 && newHours < 12) timeOfDay = "morning";
          else if (newHours >= 12 && newHours < 17) timeOfDay = "noon";
          else if (newHours >= 17 && newHours < 20) timeOfDay = "evening";
          else timeOfDay = "night";

          return {
            gameTime: {
              hours: newHours,
              minutes: newMinutes,
              day: state.gameTime.day + addedDays,
            },
            timeOfDay,
          };
        }),

      setActiveQuest: (quest) =>
        set((state) => {
          if (quest && !state.questLog.active.find((q) => q.id === quest.id)) {
            return {
              activeQuest: quest,
              questLog: {
                ...state.questLog,
                active: [...state.questLog.active, quest],
              },
            };
          }
          return { activeQuest: quest };
        }),

      setActiveNpc: (dialogueId) => set({ activeNpc: dialogueId }),

      addDialogue: (dialogue) =>
        set((state) => ({
          dialogues: [...state.dialogues, dialogue],
        })),

      completeQuest: (questId) =>
        set((state) => {
          const quest = state.questLog.active.find((q) => q.id === questId);
          if (!quest) return state;

          const newStats = { ...state.playerStats };
          const newInventory = [...state.inventory];

          // Add rewards
          if (quest.rewards.xp) newStats.xp += quest.rewards.xp;
          if (quest.rewards.money) newStats.money += quest.rewards.money;
          if (quest.rewards.health !== undefined) {
            newStats.health = Math.min(
              newStats.maxHealth,
              newStats.health + quest.rewards.health
            );
          }
          if (quest.rewards.energy !== undefined) {
            newStats.energy = Math.min(
              newStats.maxEnergy,
              newStats.energy + quest.rewards.energy
            );
          }

          // Remove requirements
          if (quest.requirements?.health) {
            newStats.health = Math.max(
              0,
              newStats.health - quest.requirements.health
            );
          }
          if (quest.requirements?.money) {
            newStats.money = Math.max(
              0,
              newStats.money - quest.requirements.money
            );
          }
          if (quest.requirements?.energy) {
            newStats.energy = Math.max(
              0,
              newStats.energy - quest.requirements.energy
            );
          }

          // Add reward items
          if (quest.rewards.items) {
            quest.rewards.items.forEach(({ id, amount }) => {
              const existingItem = newInventory.find((item) => item.id === id);
              if (existingItem) {
                existingItem.amount += amount;
              } else {
                newInventory.push({ id, amount });
              }
            });
          }

          // Remove required items
          if (quest.requirements?.items) {
            quest.requirements.items.forEach(({ id, amount }) => {
              const existingItem = newInventory.find((item) => item.id === id);
              if (existingItem) {
                existingItem.amount = Math.max(0, existingItem.amount - amount);
                if (existingItem.amount === 0) {
                  newInventory.splice(newInventory.indexOf(existingItem), 1);
                }
              }
            });
          }

          if (newStats.xp >= 100) {
            const levelsGained = Math.floor(newStats.xp / 100);
            newStats.level += levelsGained;
            newStats.xp = newStats.xp % 100;
            newStats.health = newStats.maxHealth; // Refill health on level up
            newStats.energy = newStats.maxEnergy; // Refill energy on level up
          }

          return {
            playerStats: newStats,
            inventory: newInventory,
            activeQuest: null,
            activeNpc: null,
            questLog: {
              ...state.questLog,
              active: state.questLog.active.filter((q) => q.id !== questId),
              completed: [
                ...state.questLog.completed,
                { ...quest, completed: true },
              ],
            },
          };
        }),

      failQuest: (questId) =>
        set((state) => ({
          questLog: {
            ...state.questLog,
            active: state.questLog.active.filter((q) => q.id !== questId),
            failed: [
              ...state.questLog.failed,
              state.questLog.active.find((q) => q.id === questId)!,
            ],
          },
          activeQuest: null,
          activeNpc: null,
        })),

      addToInventory: (itemId, amount) =>
        set((state) => {
          const newInventory = [...state.inventory];
          const existingItem = newInventory.find((item) => item.id === itemId);

          if (existingItem) {
            existingItem.amount += amount;
          } else {
            newInventory.push({ id: itemId, amount });
          }

          return { inventory: newInventory };
        }),

      removeFromInventory: (itemId, amount) => {
        const state = get();
        const item = state.inventory.find((i) => i.id === itemId);

        if (!item || item.amount < amount) return false;

        set((state) => ({
          inventory: state.inventory
            .map((item) =>
              item.id === itemId
                ? { ...item, amount: item.amount - amount }
                : item
            )
            .filter((item) => item.amount > 0),
        }));

        return true;
      },

      hasItem: (itemId, amount = 1) => {
        const state = get();
        const item = state.inventory.find((i) => i.id === itemId);
        return item ? item.amount >= amount : false;
      },

      getItemCount: (itemId) => {
        const state = get();
        const item = state.inventory.find((i) => i.id === itemId);
        return item ? item.amount : 0;
      },

      // UI Actions
      setShowLevelUp: (show) => set({ showLevelUp: show }),
      setInventoryOpen: (open) => set({ inventoryOpen: open }),
      setQuestLogOpen: (open) => set({ questLogOpen: open }),
      setMerchantOpen: (open) => set({ merchantOpen: open }),
      setQuestGiverOpen: (open) => set({ questGiverOpen: open }),
      setTravelMasterOpen: (open) => set({ travelMasterOpen: open }),
      setMapOpen: (open) => set({ mapOpen: open }),
    })),
    {
      name: "game-storage",
      partialize: (state) => ({
        playerStats: state.playerStats,
        inventory: state.inventory,
        questLog: state.questLog,
        currentSceneId: state.currentSceneId,
      }),
    }
  )
);
