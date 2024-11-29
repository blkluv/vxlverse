import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { persist } from "zustand/middleware";
import * as THREE from "three";
import { Scene, GameObject } from "../types";

const DEFAULT_SCENES = [
  {
    id: "tutorial-scene",
    name: "Welcome to VXLverse",
    objects: [
      {
        id: "tutorial-guide",
        name: "VXLverse Guide",
        modelUrl: "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_6wg76XCtWr.glb",
        position: new THREE.Vector3(0, 0, -2),
        rotation: new THREE.Euler(0, Math.PI, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [
          {
            id: "welcome-tutorial",
            title: "Welcome to VXLverse!",
            description: "Learn the basics of VXLverse and how to create your own virtual worlds.",
            dialogues: [
              {
                id: 0,
                speaker: "VXLverse Guide",
                text: "Welcome to VXLverse! I'm your guide to this amazing platform. Ready to learn how to create and explore virtual worlds?",
                choices: [
                  { text: "Yes, teach me!", nextDialogue: 1 },
                  { text: "Tell me more", nextDialogue: 2 }
                ]
              },
              {
                id: 1,
                speaker: "VXLverse Guide",
                text: "Great! First, let's learn about movement. Use WASD keys to move around, and your mouse to look around. Try moving to the Creation Station ahead!",
                choices: [{ text: "Got it!", nextDialogue: 3 }]
              },
              {
                id: 2,
                speaker: "VXLverse Guide",
                text: "VXLverse is a platform where you can create, share, and explore virtual worlds. You can build games, create interactive experiences, and connect with others!",
                choices: [{ text: "Let's start learning!", nextDialogue: 1 }]
              },
              {
                id: 3,
                speaker: "VXLverse Guide",
                text: "Perfect! Now let's learn about interacting with objects. Press 'E' to interact with objects and NPCs. Try interacting with the Creation Station.",
                choices: [{ text: "Will do!", nextDialogue: null }]
              }
            ],
            requirements: {
              level: 1,
              energy: 0,
              money: 0,
              timeOfDay: ["morning", "noon", "evening", "night"],
              items: []
            },
            rewards: {
              xp: 100,
              money: 0,
              energy: 100,
              items: []
            },
            completion: {
              conditions: {
                objectInteract: ["creation-station"]
              },
              actions: [
                {
                  type: "complete",
                  params: { message: "You've learned the basics of movement and interaction!" }
                }
              ]
            },
            completed: false
          }
        ]
      },
      {
        id: "creation-station",
        name: "Creation Station",
        modelUrl: "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_m7jN5RbDsK.glb",
        position: new THREE.Vector3(3, 0, -2),
        rotation: new THREE.Euler(0, -Math.PI / 4, 0),
        scale: new THREE.Vector3(1.5, 1.5, 1.5),
        quests: [
          {
            id: "creation-basics",
            title: "World Creation 101",
            description: "Learn how to create and customize your own virtual world.",
            dialogues: [
              {
                id: 0,
                speaker: "Creation Station",
                text: "Welcome to the Creation Station! Here you'll learn how to build your own worlds. Would you like to start with the basics?",
                choices: [
                  { text: "Yes, show me how!", nextDialogue: 1 },
                  { text: "What can I create?", nextDialogue: 2 }
                ]
              },
              {
                id: 1,
                speaker: "Creation Station",
                text: "To create a world, you'll use the Editor. You can add objects, set up quests, and create interactive stories. Let's start by learning about the object library.",
                choices: [{ text: "Show me the library", nextDialogue: 3 }]
              },
              {
                id: 2,
                speaker: "Creation Station",
                text: "In VXLverse, you can create games, interactive stories, educational experiences, virtual galleries, and much more! The possibilities are endless.",
                choices: [{ text: "Let's start creating!", nextDialogue: 1 }]
              },
              {
                id: 3,
                speaker: "Creation Station",
                text: "The object library contains 3D models you can use in your world. Try clicking the 'Assets' button to browse available models!",
                choices: [{ text: "I'll check it out", nextDialogue: null }]
              }
            ],
            requirements: {
              level: 1,
              energy: 0,
              money: 0,
              timeOfDay: ["morning", "noon", "evening", "night"],
              items: []
            },
            rewards: {
              xp: 200,
              money: 100,
              energy: 50,
              items: []
            },
            completion: {
              conditions: {},
              actions: [
                {
                  type: "complete",
                  params: { message: "You've learned about world creation!" }
                }
              ]
            },
            completed: false
          }
        ]
      }
    ],
    environment: "sunset",
    background: "environment",
    ambientLight: 1.0,
    fog: {
      color: "#c9e3ff",
      near: 5,
      far: 30
    },
    music: {
      url: "/music/tutorial-theme.mp3",
      volume: 0.3,
      loop: true
    }
  },
  {
    id: "village-scene",
    name: "Peaceful Village",
    objects: [
      {
        id: "village-center",
        name: "Village Square",
        modelUrl: "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_61UyhW3CPc.glb",
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(2, 2, 2),
        quests: [
          {
            id: "welcome-quest",
            title: "Welcome to VXLverse",
            description: "Learn the basics of the village and meet key characters.",
            dialogues: [
              {
                id: 0,
                speaker: "Village Elder",
                text: "Welcome to our village, traveler! I see you're new here. Would you like a tour?",
                choices: [
                  { text: "Yes, please!", nextDialogue: 1 },
                  { text: "Maybe later", nextDialogue: null },
                ],
              },
              {
                id: 1,
                speaker: "Village Elder",
                text: "Excellent! First, visit our merchant at the marketplace. He has some supplies you might need.",
                choices: [{ text: "I'll head there now", nextDialogue: null }],
              }
            ],
            requirements: {
              level: 1,
              energy: 10,
              money: 0,
              timeOfDay: ["morning", "noon", "evening"],
              items: []
            },
            rewards: {
              xp: 100,
              money: 50,
              energy: 20,
              items: [{ id: "basic_potion", amount: 1 }]
            },
            completion: {
              conditions: {
                npcTalk: ["merchant"]
              },
              actions: [
                {
                  type: "complete",
                  params: { message: "Welcome to the village!" }
                }
              ]
            },
            completed: false
          }
        ]
      },
      {
        id: "merchant",
        name: "Village Merchant",
        modelUrl: "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_6wg76XCtWr.glb",
        position: new THREE.Vector3(5, 0, 5),
        rotation: new THREE.Euler(0, -Math.PI / 4, 0),
        scale: new THREE.Vector3(1, 1, 1),
        quests: [
          {
            id: "trade-quest",
            title: "Art of Trading",
            description: "Learn how to trade with the village merchant.",
            dialogues: [
              {
                id: 0,
                speaker: "Merchant",
                text: "Ah, a new face! Looking to trade?",
                choices: [
                  { text: "Yes, show me what you have", nextDialogue: 1 },
                  { text: "Just browsing", nextDialogue: null },
                ],
              },
              {
                id: 1,
                speaker: "Merchant",
                text: "Here's what I have in stock. I'll give you a special discount on your first purchase!",
                choices: [{ text: "Let's see what you have", nextDialogue: null }],
              }
            ],
            requirements: {
              level: 1,
              energy: 5,
              money: 0,
              timeOfDay: ["morning", "noon", "evening"],
              items: []
            },
            rewards: {
              xp: 50,
              money: 0,
              energy: 10,
              items: []
            },
            completion: {
              conditions: {},
              actions: [
                {
                  type: "complete",
                  params: { message: "You've learned about trading!" }
                }
              ]
            },
            completed: false
          }
        ]
      },
      {
        id: "mysterious-tower",
        name: "Mysterious Tower",
        modelUrl: "https://raw.githubusercontent.com/mpoapostolis/3d-assets/refs/heads/master/storage/scene_UwHJLq89uV.glb",
        position: new THREE.Vector3(-8, 0, -8),
        rotation: new THREE.Euler(0, Math.PI / 6, 0),
        scale: new THREE.Vector3(1.5, 1.5, 1.5),
        quests: [
          {
            id: "tower-mystery",
            title: "The Tower's Secret",
            description: "Investigate the mysterious tower on the edge of the village.",
            dialogues: [
              {
                id: 0,
                speaker: "???",
                text: "This tower holds many secrets... but are you ready to discover them?",
                choices: [
                  { text: "I'm ready", nextDialogue: 1 },
                  { text: "Not yet", nextDialogue: null },
                ],
              },
              {
                id: 1,
                speaker: "???",
                text: "Return when you've proven yourself worthy...",
                choices: [{ text: "I'll be back", nextDialogue: null }],
              }
            ],
            requirements: {
              level: 5,
              energy: 50,
              money: 100,
              timeOfDay: ["night"],
              items: []
            },
            rewards: {
              xp: 500,
              money: 200,
              energy: 100,
              items: [{ id: "mysterious_key", amount: 1 }]
            },
            completion: {
              conditions: {
                items: [{ id: "magic_crystal", amount: 3 }]
              },
              actions: [
                {
                  type: "complete",
                  params: { message: "You've unlocked the tower's secret!" }
                }
              ]
            },
            completed: false
          }
        ]
      }
    ],
    environment: "sunset",
    background: "environment",
    ambientLight: 0.8,
    fog: {
      color: "#b9d5ff",
      near: 1,
      far: 100
    },
    music: {
      url: "/music/village-theme.mp3",
      volume: 0.5,
      loop: true
    }
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
