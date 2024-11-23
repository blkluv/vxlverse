export interface Item {
  id: string;
  name: string;
  emoji: string;
  description: string;
  value: number;
  type: 'weapon' | 'armor' | 'potion' | 'material' | 'quest' | 'food';
}

export const GAME_ITEMS: Item[] = [
  { id: 'sword', name: 'Steel Sword', emoji: '⚔️', description: 'A sharp blade', value: 100, type: 'weapon' },
  { id: 'bow', name: 'Wooden Bow', emoji: '🏹', description: 'For ranged attacks', value: 80, type: 'weapon' },
  { id: 'staff', name: 'Magic Staff', emoji: '🪄', description: 'Channels magical power', value: 120, type: 'weapon' },
  { id: 'shield', name: 'Iron Shield', emoji: '🛡️', description: 'Solid protection', value: 90, type: 'armor' },
  { id: 'helmet', name: 'Knight Helmet', emoji: '⛑️', description: 'Head protection', value: 70, type: 'armor' },
  { id: 'chestplate', name: 'Steel Armor', emoji: '🥋', description: 'Body protection', value: 150, type: 'armor' },
  { id: 'boots', name: 'Leather Boots', emoji: '👢', description: 'Fast movement', value: 50, type: 'armor' },
  { id: 'health_potion', name: 'Health Potion', emoji: '❤️', description: 'Restores health', value: 30, type: 'potion' },
  { id: 'mana_potion', name: 'Mana Potion', emoji: '🌟', description: 'Restores mana', value: 30, type: 'potion' },
  { id: 'strength_potion', name: 'Strength Potion', emoji: '💪', description: 'Increases strength', value: 40, type: 'potion' },
  { id: 'wood', name: 'Wood', emoji: '🪵', description: 'Building material', value: 10, type: 'material' },
  { id: 'stone', name: 'Stone', emoji: '🪨', description: 'Building material', value: 15, type: 'material' },
  { id: 'iron_ore', name: 'Iron Ore', emoji: '⛰️', description: 'Metal resource', value: 25, type: 'material' },
  { id: 'gold_ore', name: 'Gold Ore', emoji: '💎', description: 'Precious metal', value: 50, type: 'material' },
  { id: 'ancient_scroll', name: 'Ancient Scroll', emoji: '📜', description: 'Contains secrets', value: 200, type: 'quest' },
  { id: 'magic_crystal', name: 'Magic Crystal', emoji: '💎', description: 'Magical power source', value: 150, type: 'quest' },
  { id: 'dragon_scale', name: 'Dragon Scale', emoji: '🐉', description: 'Rare material', value: 300, type: 'quest' },
  { id: 'bread', name: 'Fresh Bread', emoji: '🍞', description: 'Restores energy', value: 15, type: 'food' },
  { id: 'apple', name: 'Apple', emoji: '🍎', description: 'Healthy food', value: 10, type: 'food' },
  { id: 'meat', name: 'Cooked Meat', emoji: '🍖', description: 'Protein rich', value: 25, type: 'food' }
];

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
  type: 'complete' | 'fail' | 'update_stage' | 'give_item' | 'remove_item' | 'teleport' | 'spawn_npc';
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
    timeOfDay: ('morning' | 'noon' | 'evening' | 'night')[];
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
  background?: 'environment' | 'sky' | 'none';
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