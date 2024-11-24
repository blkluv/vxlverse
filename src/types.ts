import { items } from "./stores/items";

export interface Item {
  id: string;
  name: string;
  emoji: string;
  description: string;
  value: number;
  type: "weapon" | "armor" | "potion" | "material" | "quest" | "food";
}

export const GAME_ITEMS: Item[] = items;

export interface Enemy {
  id: string;
  type: "slime" | "goblin" | "skeleton";
  position: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  damage: number;
  xp: number;
  loot: { itemId: string; chance: number; amount: number }[];
  model: string;
  scale: number;
  name: string;
}

export const ENEMY_TYPES = {
  slime: {
    name: "Slime",
    health: 50,
    xp: 90,

    damage: 10,
    model:
      "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_2TXu5Mesap.glb",
    scale: 0.5,
    loot: items.map((item) => ({
      itemId: item.id,
      chance: 0.1 * Math.random(),
      amount: 1,
    })),
  },
  goblin: {
    name: "Goblin",
    health: 80,
    damage: 15,
    xp: 90,
    model:
      "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_UwHJLq89uV.glb",
    scale: 0.8,
    loot: items.map((item) => ({
      itemId: item.id,
      chance: 0.2 * Math.random(),
      amount: 1,
    })),
  },
  skeleton: {
    name: "Skeleton",
    health: 100,
    xp: 10,
    damage: 20,
    model:
      "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_PNlrY0F4pW.glb",
    scale: 1,
    loot: items.map((item) => ({
      itemId: item.id,
      chance: 0.3 * Math.random(),
      amount: 1,
    })),
  },
} as const;

export interface Model3D {
  id: string;
  name: string;
  category: string;
  creator: string;
  licence: string;
  tags: string;
  thumbnail: string;
  glb: string;
  attribution: string;
  created: string;
}

export interface Dialogue {
  id: number;
  speaker: string;
  text: string;
  choices?: DialogueChoice[];
}

export interface DialogueChoice {
  text: string;
  nextDialogue?: number;
  requirements?: {
    level?: number;
    energy?: number;
    money?: number;
    items?: { id: string; amount: number }[];
  };
  action?: QuestAction;
}

export interface QuestAction {
  type:
    | "complete"
    | "fail"
    | "update_stage"
    | "give_item"
    | "remove_item"
    | "teleport"
    | "spawn_npc";
  params: {
    itemId?: string;
    amount?: number;
    position?: { x: number; y: number; z: number };
    npcId?: string;
    message?: string;
    stageId?: number;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  dialogues: Dialogue[];
  requirements: {
    level: number;
    energy: number;
    money: number;
    timeOfDay: ("morning" | "noon" | "evening" | "night")[];
    items: { id: string; amount: number }[];
  };
  rewards: {
    xp: number;
    money: number;
    energy: number;
    items: { id: string; amount: number }[];
  };
  completion: {
    conditions: {
      items?: { id: string; amount: number }[];
      location?: { x: number; y: number; z: number; radius: number };
      npcTalk?: string[];
      objectInteract?: string[];
      enemyDefeat?: string[];
    };
    actions: QuestAction[];
  };
  completed: boolean;
}

export interface Scene {
  id: string;
  name: string;
  objects: GameObject[];
  environment?: string;
  background?: "environment" | "sky" | "none";
  ambientLight?: number;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  music?: {
    url: string;
    volume: number;
    loop: boolean;
  };
}

export interface GameObject {
  id: string;
  name: string;
  modelUrl: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  quests?: Quest[];
}
