import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { persist } from "zustand/middleware";
import * as THREE from "three";
import { Scene, GameObject } from "../types";

const DEFAULT_SCENES = [
  {
    id: "village-scene",
    name: "Village",
    objects: [
      {
        id: "house-1",
        name: "Main House",
        modelUrl:
          "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_61UyhW3CPc.glb",
        position: new THREE.Vector3(-5, 0, -5),
        rotation: new THREE.Euler(0, Math.PI / 4, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [
          {
            id: "village-quest",
            title: "Village Mystery",
            description: "Investigate the strange occurrences in the village.",
            dialogues: [
              {
                id: 0,
                speaker: "Village Elder",
                text: "Welcome, traveler. Our village has been experiencing some... unusual events.",
                choices: [
                  { text: "Tell me more", nextDialogue: 1 },
                  { text: "Not interested", nextDialogue: null },
                ],
              },
              {
                id: 1,
                speaker: "Village Elder",
                text: "Strange lights have been seen at night, and items have gone missing.",
                choices: [{ text: "I'll help investigate", nextDialogue: 2 }],
              },
              {
                id: 2,
                speaker: "Village Elder",
                text: "Thank you! First, we need to gather some evidence. Find 3 mysterious objects around the village.",
                choices: [{ text: "I'll start looking", nextDialogue: null }],
              },
            ],
            requirements: {
              level: 1,
              energy: 20,
              money: 0,
              timeOfDay: ["evening", "night"],
              items: [],
            },
            rewards: {
              xp: 200,
              money: 150,
              energy: 0,
              items: [{ id: "magic_crystal", amount: 1 }],
            },
            completion: {
              conditions: {
                items: [{ id: "mysterious_object", amount: 3 }],
              },
              actions: [
                {
                  type: "complete",
                  params: { message: "You've solved the village mystery!" },
                },
              ],
            },
            completed: false,
          },
        ],
      },
      {
        id: "house-2",
        name: "Open House",
        modelUrl:
          "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_ZOxj74x3At.glb",
        position: new THREE.Vector3(5, 0, -5),
        rotation: new THREE.Euler(0, -Math.PI / 4, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [],
      },
      {
        id: "bush-1",
        name: "Garden Bush",
        modelUrl:
          "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_4p3ub4DfTl.glb",
        position: new THREE.Vector3(-3, 0, -3),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [],
      },
      {
        id: "merchant",
        name: "Village Merchant",
        modelUrl:
          "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_6wg76XCtWr.glb",
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, Math.PI, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [
          {
            id: "merchant-quest",
            title: "The Art of Trade",
            description: "Learn about trading from the village merchant.",
            dialogues: [
              {
                id: 0,
                speaker: "Merchant",
                text: "Ah, a potential customer! Would you like to learn the art of trade?",
                choices: [
                  { text: "Yes, teach me", nextDialogue: 1 },
                  { text: "Maybe later", nextDialogue: null },
                ],
              },
              {
                id: 1,
                speaker: "Merchant",
                text: "Excellent! Bring me some goods and I'll teach you the secrets of bargaining.",
                choices: [{ text: "What do you need?", nextDialogue: 2 }],
              },
              {
                id: 2,
                speaker: "Merchant",
                text: "Bring me 3 flowers and 2 bushes, and I'll make it worth your while.",
                choices: [{ text: "I'll gather them", nextDialogue: null }],
              },
            ],
            requirements: {
              level: 1,
              energy: 10,
              money: 0,
              timeOfDay: ["morning", "noon", "evening"],
              items: [],
            },
            rewards: {
              xp: 100,
              money: 200,
              energy: 0,
              items: [{ id: "gold_ore", amount: 1 }],
            },
            completion: {
              conditions: {
                items: [],
              },
              actions: [
                {
                  type: "complete",
                  params: { message: "You've learned the basics of trading!" },
                },
              ],
            },
            completed: false,
          },
        ],
      },
    ],
    environment: "sunset",
    background: "environment",
    ambientLight: 0.8,
    fog: {
      color: "#b99f8e",
      near: 10,
      far: 30,
    },
    music: {
      url: "https://example.com/village-ambience.mp3",
      volume: 0.5,
      loop: true,
    },
  },
  {
    id: "nature-scene",
    name: "Enchanted Forest",
    objects: [
      {
        id: "tree-1",
        name: "Mystical Tree",
        modelUrl:
          "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_3pHhvPmrhE.glb",
        position: new THREE.Vector3(-3, 0, -3),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1.5, 1.5, 1.5),
        quests: [],
      },
      {
        id: "flower-patch",
        name: "Magic Flowers",
        modelUrl:
          "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_i135puuBOq.glb",
        position: new THREE.Vector3(3, 0, -2),
        rotation: new THREE.Euler(0, Math.PI / 3, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [],
      },
      {
        id: "grass-patch",
        name: "Whispering Grass",
        modelUrl:
          "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_zBz7cYcBcK.glb",
        position: new THREE.Vector3(0, 0, -4),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [],
      },
      {
        id: "forest-guardian",
        name: "Forest Guardian",
        modelUrl:
          "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_FXCFR5mM0D.glb",
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, Math.PI, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [
          {
            id: "nature-quest",
            title: "Nature's Calling",
            description:
              "Help the Forest Guardian restore balance to the forest.",
            dialogues: [
              {
                id: 0,
                speaker: "Forest Guardian",
                text: "The forest's magic is fading. Will you help restore it?",
                choices: [
                  { text: "I will help", nextDialogue: 1 },
                  { text: "Not now", nextDialogue: null },
                ],
              },
              {
                id: 1,
                speaker: "Forest Guardian",
                text: "We need to collect magical essences from the plants around the forest.",
                choices: [{ text: "How do I help?", nextDialogue: 2 }],
              },
              {
                id: 2,
                speaker: "Forest Guardian",
                text: "Gather 5 flower essences and 3 magical herbs. Be gentle with the plants.",
                choices: [{ text: "I'll start gathering", nextDialogue: null }],
              },
            ],
            requirements: {
              level: 2,
              energy: 30,
              money: 0,
              timeOfDay: ["morning", "evening"],
              items: [
                { id: "flower_essence", amount: 5 },
                { id: "magical_herb", amount: 3 },
              ],
            },
            rewards: {
              xp: 250,
              money: 100,
              energy: 50,
              items: [{ id: "nature_blessing", amount: 1 }],
            },
            completion: {
              conditions: {
                items: [
                  { id: "flower_essence", amount: 5 },
                  { id: "magical_herb", amount: 3 },
                ],
              },
              actions: [
                {
                  type: "complete",
                  params: { message: "The forest's magic has been restored!" },
                },
              ],
            },
            completed: false,
          },
        ],
      },
    ],
    environment: "forest",
    background: "environment",
    ambientLight: 0.6,
    fog: {
      color: "#8ba892",
      near: 5,
      far: 25,
    },
    music: {
      url: "https://example.com/forest-ambience.mp3",
      volume: 0.4,
      loop: true,
    },
  },
];

interface EditorState {
  scenes: Scene[];
  currentSceneId: string | null;
  selectedObjectId: string | null;
  showModelSelector: boolean;
  editingSceneName: string | null;

  addScene: (scene: Scene) => void;
  removeScene: (id: string) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  setCurrentScene: (id: string) => void;
  addObject: (sceneId: string, object: GameObject) => void;
  updateObject: (
    sceneId: string,
    objectId: string,
    updates: Partial<GameObject>
  ) => void;
  removeObject: (sceneId: string, objectId: string) => void;
  setSelectedObject: (id: string | null) => void;
  setShowModelSelector: (show: boolean) => void;
  setEditingSceneName: (id: string | null) => void;
  updateSceneName: (id: string, name: string) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    subscribeWithSelector((set) => ({
      scenes: DEFAULT_SCENES,
      currentSceneId: DEFAULT_SCENES[0].id,
      selectedObjectId: null,
      showModelSelector: false,
      editingSceneName: null,

      addScene: (scene) => {
        set((state) => {
          const exists = state.scenes.some((s) => s.id === scene.id);
          if (!exists) {
            return {
              scenes: [...state.scenes, scene],
              currentSceneId: scene.id,
            };
          }
          return state;
        });
      },

      removeScene: (id) =>
        set((state) => {
          const newScenes = state.scenes.filter((s) => s.id !== id);
          const newCurrentId =
            state.currentSceneId === id
              ? newScenes[0]?.id || null
              : state.currentSceneId;
          return {
            scenes: newScenes,
            currentSceneId: newCurrentId,
            selectedObjectId: null,
          };
        }),

      updateScene: (id, updates) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === id ? { ...scene, ...updates } : scene
          ),
        })),

      setCurrentScene: (id) => set({ currentSceneId: id }),

      addObject: (sceneId, object) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === sceneId
              ? { ...scene, objects: [...scene.objects, object] }
              : scene
          ),
          selectedObjectId: object.id,
        })),

      updateObject: (sceneId, objectId, updates) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  objects: scene.objects.map((obj) =>
                    obj.id === objectId ? { ...obj, ...updates } : obj
                  ),
                }
              : scene
          ),
        })),

      removeObject: (sceneId, objectId) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  objects: scene.objects.filter((obj) => obj.id !== objectId),
                }
              : scene
          ),
          selectedObjectId:
            state.selectedObjectId === objectId ? null : state.selectedObjectId,
        })),

      setSelectedObject: (id) => set({ selectedObjectId: id }),

      setShowModelSelector: (show) => set({ showModelSelector: show }),

      setEditingSceneName: (id) => set({ editingSceneName: id }),

      updateSceneName: (id, name) =>
        set((state) => ({
          scenes: state.scenes.map((scene) =>
            scene.id === id ? { ...scene, name } : scene
          ),
          editingSceneName: null,
        })),
    })),
    {
      name: "editor-storage",
      partialize: (state) => ({
        scenes: state.scenes.map((scene) => ({
          ...scene,
          objects: scene.objects.map((obj) => ({
            ...obj,
            position: {
              x: obj.position.x,
              y: obj.position.y,
              z: obj.position.z,
            },
            rotation: {
              x: obj.rotation.x,
              y: obj.rotation.y,
              z: obj.rotation.z,
            },
            scale: {
              x: obj.scale.x,
              y: obj.scale.y,
              z: obj.scale.z,
            },
          })),
        })),
        currentSceneId: state.currentSceneId,
        selectedObjectId: state.selectedObjectId,
      }),
      merge: (persistedState: any, currentState: EditorState) => {
        const convertedState = {
          ...persistedState,
          scenes: persistedState.scenes.map((scene: any) => ({
            ...scene,
            objects: scene.objects.map((obj: any) => ({
              ...obj,
              position: new THREE.Vector3(
                obj.position.x,
                obj.position.y,
                obj.position.z
              ),
              rotation: new THREE.Euler(
                obj.rotation.x,
                obj.rotation.y,
                obj.rotation.z
              ),
              scale: new THREE.Vector3(obj.scale.x, obj.scale.y, obj.scale.z),
            })),
          })),
        };
        return {
          ...currentState,
          ...convertedState,
        };
      },
    }
  )
);
