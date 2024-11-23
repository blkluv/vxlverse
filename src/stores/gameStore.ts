import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import { Quest } from '../types';

// Default scene ID
const DEFAULT_SCENE_ID = 'village-scene';

interface GameState {
  playerStats: {
    level: number;
    xp: number;
    money: number;
    health: number;
    maxHealth: number;
  };
  timeOfDay: 'morning' | 'noon' | 'evening' | 'night';
  gameTime: {
    hours: number;
    minutes: number;
    day: number;
  };
  currentSceneId: string;
  activeQuest: Quest | null;
  activeDialogue: number | null;
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

  // Actions
  setCurrentSceneId: (id: string) => void;
  updatePlayerStats: (updates: Partial<GameState['playerStats']>) => void;
  advanceTime: (minutes: number) => void;
  setActiveQuest: (quest: Quest | null) => void;
  setActiveDialogue: (dialogueId: number | null) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  addToInventory: (itemId: string, amount: number) => void;
  removeFromInventory: (itemId: string, amount: number) => boolean;
  hasItem: (itemId: string, amount?: number) => boolean;
  getItemCount: (itemId: string) => number;

  // UI Actions
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
        money: 100,
        health: 100,
        maxHealth: 100,
      },
      timeOfDay: 'morning',
      gameTime: {
        hours: 6,
        minutes: 0,
        day: 1,
      },
      currentSceneId: DEFAULT_SCENE_ID,
      activeQuest: null,
      activeDialogue: null,
      inventory: [],
      questLog: {
        active: [],
        completed: [],
        failed: [],
      },

      // UI State
      inventoryOpen: false,
      questLogOpen: false,
      merchantOpen: false,
      questGiverOpen: false,
      travelMasterOpen: false,
      mapOpen: false,

      // Actions
      setCurrentSceneId: (id) => set({ currentSceneId: id }),
      updatePlayerStats: (updates) =>
        set((state) => ({
          playerStats: { ...state.playerStats, ...updates },
        })),

      advanceTime: (minutes) =>
        set((state) => {
          const totalMinutes =
            state.gameTime.hours * 60 + state.gameTime.minutes + minutes;
          const newHours = Math.floor(totalMinutes / 60) % 24;
          const newMinutes = totalMinutes % 60;
          const addedDays = Math.floor(totalMinutes / (24 * 60));

          let timeOfDay: GameState['timeOfDay'] = state.timeOfDay;
          if (newHours >= 5 && newHours < 12) timeOfDay = 'morning';
          else if (newHours >= 12 && newHours < 17) timeOfDay = 'noon';
          else if (newHours >= 17 && newHours < 20) timeOfDay = 'evening';
          else timeOfDay = 'night';

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
          if (quest && !state.questLog.active.find(q => q.id === quest.id)) {
            return {
              activeQuest: quest,
              questLog: {
                ...state.questLog,
                active: [...state.questLog.active, quest]
              }
            };
          }
          return { activeQuest: quest };
        }),
      
      setActiveDialogue: (dialogueId) => set({ activeDialogue: dialogueId }),
      
      completeQuest: (questId) =>
        set((state) => {
          const quest = state.questLog.active.find(q => q.id === questId);
          if (!quest) return state;

          const newStats = { ...state.playerStats };
          const newInventory = [...state.inventory];
          
          if (quest.rewards.xp) newStats.xp += quest.rewards.xp;
          if (quest.rewards.money) newStats.money += quest.rewards.money;
          
          if (quest.rewards.items) {
            quest.rewards.items.forEach(({ id, amount }) => {
              const existingItem = newInventory.find(item => item.id === id);
              if (existingItem) {
                existingItem.amount += amount;
              } else {
                newInventory.push({ id, amount });
              }
            });
          }
          
          if (newStats.xp >= 100) {
            const levelsGained = Math.floor(newStats.xp / 100);
            newStats.level += levelsGained;
            newStats.xp = newStats.xp % 100;
            newStats.maxHealth += levelsGained * 10;
            newStats.health = newStats.maxHealth;
          }

          return {
            playerStats: newStats,
            inventory: newInventory,
            activeQuest: null,
            activeDialogue: null,
            questLog: {
              ...state.questLog,
              active: state.questLog.active.filter(q => q.id !== questId),
              completed: [...state.questLog.completed, { ...quest, completed: true }]
            }
          };
        }),

      failQuest: (questId) =>
        set((state) => ({
          questLog: {
            ...state.questLog,
            active: state.questLog.active.filter(q => q.id !== questId),
            failed: [
              ...state.questLog.failed,
              state.questLog.active.find(q => q.id === questId)!
            ]
          },
          activeQuest: null,
          activeDialogue: null
        })),

      addToInventory: (itemId, amount) =>
        set((state) => {
          const newInventory = [...state.inventory];
          const existingItem = newInventory.find(item => item.id === itemId);
          
          if (existingItem) {
            existingItem.amount += amount;
          } else {
            newInventory.push({ id: itemId, amount });
          }
          
          return { inventory: newInventory };
        }),

      removeFromInventory: (itemId, amount) => {
        const state = get();
        const item = state.inventory.find(i => i.id === itemId);
        
        if (!item || item.amount < amount) return false;
        
        set((state) => ({
          inventory: state.inventory.map(item =>
            item.id === itemId
              ? { ...item, amount: item.amount - amount }
              : item
          ).filter(item => item.amount > 0)
        }));
        
        return true;
      },

      hasItem: (itemId, amount = 1) => {
        const state = get();
        const item = state.inventory.find(i => i.id === itemId);
        return item ? item.amount >= amount : false;
      },

      getItemCount: (itemId) => {
        const state = get();
        const item = state.inventory.find(i => i.id === itemId);
        return item ? item.amount : 0;
      },

      // UI Actions
      setInventoryOpen: (open) => set({ inventoryOpen: open }),
      setQuestLogOpen: (open) => set({ questLogOpen: open }),
      setMerchantOpen: (open) => set({ merchantOpen: open }),
      setQuestGiverOpen: (open) => set({ questGiverOpen: open }),
      setTravelMasterOpen: (open) => set({ travelMasterOpen: open }),
      setMapOpen: (open) => set({ mapOpen: open }),
    })),
    {
      name: 'game-storage',
      partialize: (state) => ({
        playerStats: state.playerStats,
        inventory: state.inventory,
        questLog: state.questLog,
        currentSceneId: state.currentSceneId
      })
    }
  )
);