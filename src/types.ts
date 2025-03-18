import { items } from "./stores/items";
import * as THREE from "three";

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
  type: "knight" | "mage" | "dragon" | "demon";
  position: { x: number; y: number; z: number };
  health: number;
  maxHealth: number;
  damage: number;
  xp: number;
  loot: { itemId: string; chance: number; amount: number }[];
  model: string;
  scale: number;
  name: string;
  level: number;
  attackRange: number;
  attackSpeed: number;
  moveSpeed: number;
  animations?: {
    idle?: string;
    walk?: string;
    attack?: string;
    hit?: string;
    death?: string;
  };
}

export const ENEMY_TYPES = {
  knight: {
    name: "Dark Knight",
    health: 100,
    xp: 120,
    damage: 15,
    level: 5,
    attackRange: 2,
    attackSpeed: 1.5,
    moveSpeed: 2,
    model:
      "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_elPqhAENKG.glb",
    scale: 1,
    loot: items.map((item) => ({
      itemId: item.id,
      chance: Math.random() + 0.4,
      amount: 1,
    })),
  },
  mage: {
    name: "Evil Mage",
    health: 80,
    damage: 25,
    xp: 150,
    level: 7,
    attackRange: 8,
    attackSpeed: 1,
    moveSpeed: 1.5,
    model:
      "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_dnm6fkRN7J.glb",
    scale: 1,
    loot: items.map((item) => ({
      itemId: item.id,
      chance: Math.random(),
      amount: 1,
    })),
  },
  dragon: {
    name: "Fire Dragon",
    health: 200,
    xp: 300,
    damage: 35,
    level: 12,
    attackRange: 5,
    attackSpeed: 0.8,
    moveSpeed: 3,
    model:
      "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_p49uuKHYJc.glb",
    scale: 2,
    loot: items.map((item) => ({
      itemId: item.id,
      chance: Math.random() * 0.5 + 0.5, // Higher chance for better loot
      amount: Math.floor(Math.random() * 3) + 1,
    })),
  },
  demon: {
    name: "Demon Lord",
    health: 300,
    xp: 500,
    damage: 45,
    level: 15,
    attackRange: 3,
    attackSpeed: 1.2,
    moveSpeed: 2.5,
    model:
      "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_DQ3wuTlaxb.glb",
    scale: 1.5,
    loot: items.map((item) => ({
      itemId: item.id,
      chance: Math.random() * 0.7 + 0.3, // Highest chance for best loot
      amount: Math.floor(Math.random() * 4) + 2,
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
  animated: boolean;
  attribution_url: string;
  attribution_owner: string;
}

export interface Dialogue {
  role: "user" | "assistant";
  content: string;
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
    | "spawn_npc"
    | "custom";
  params: {
    itemId?: string;
    amount?: number;
    position?: { x: number; y: number; z: number };
    npcId?: string;
    message?: string;
    stageId?: number;
    callback?: () => void;
  };
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  backstory: string;
  dialogues: Dialogue[];
  requirements: {
    level: number;
    energy: number;
    money: number;
    time?: {
      start?: string;
      end?: string;
    };
    items: Item[];
  };
  rewards: {
    xp: number;
    money: number;
    energy: number;
    items: Item[];
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
  tracking?: {
    type: "manual" | "item_collection" | "location" | "npc_talk" | "enemy_defeat";
    quantity?: number;
    targetId?: string;
    targetName?: string;
  };
  status?: "active" | "completed" | "failed";
  completionText?: string;
  completed: boolean;
}

export interface FarmZone {
  enabled: boolean;
  enemyType: "knight" | "mage" | "dragon" | "demon";
  spawnRate: number; // in seconds
  maxEnemies: number;
  items: (string | { id: string; dropChance: number })[]; // item IDs that can be dropped with individual drop chances
  dropChance: number; // global drop chance percentage
}

export interface Scene {
  id: string;
  showGrid: boolean;
  gridSize?: number;
  snapPrecision?: number;
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
  clouds?: {
    enabled: boolean;
    speed: number;
    opacity: number;
    count: number;
  };
  stars?: {
    enabled: boolean;
    count: number;
    depth: number;
    fade: boolean;
  };
  music?: {
    url: string;
    volume: number;
    loop: boolean;
  };
  description?: string;
  farmZone?: FarmZone;
}

export interface GameObject {
  id: string;
  name: string;
  modelUrl: string;
  type?: "prop" | "npc" | "enemy" | "item" | "portal" | "trigger";
  requiredLvl?: number;
  requiredItems?: Item[];
  description?: string;

  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  quests?: Quest[];
  activeAnimation?: string;
  isAnimationPlaying?: boolean;
  animations?: {
    idle?: string;
    click?: string;
    hit?: string;
  };
  interactionSound?: string;
  physics?: {
    enabled: boolean;
    type: "fixed" | "dynamic" | "kinematicPosition" | "kinematicVelocity";
    mass?: number;
    colliders?: "cuboid" | "ball" | "capsule" | "trimesh" | "hull";
    restitution?: number;
    friction?: number;
  };
}
