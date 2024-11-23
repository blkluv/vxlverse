import { Canvas } from '@react-three/fiber';
import { Scene } from '../components/Scene';
import { ScenePanel } from '../components/editor/ScenePanel';
import { PropertiesPanel } from '../components/editor/PropertiesPanel';
import { Loader, OrbitControls } from '@react-three/drei';
import { useEffect } from 'react';
import { useEditorStore } from '../stores/editorStore';
import * as THREE from 'three';

// Clear localStorage
localStorage.clear();

const DEFAULT_QUESTS = {
  merchant: {
    id: 'merchant-quest',
    title: 'The Art of Trade',
    description: 'Learn about trading and commerce from the local merchant.',
    dialogues: [
      {
        id: 0,
        speaker: 'Merchant',
        text: 'Welcome to my humble shop! Would you like to learn about trading?',
        choices: [
          {
            text: 'Yes, teach me',
            nextDialogue: 1
          },
          {
            text: 'Maybe later',
            nextDialogue: null
          }
        ]
      },
      {
        id: 1,
        speaker: 'Merchant',
        text: 'Excellent! Complete this simple task and I\'ll reward you handsomely.',
        choices: [
          {
            text: 'What do you need?',
            nextDialogue: 2
          }
        ]
      },
      {
        id: 2,
        speaker: 'Merchant',
        text: 'Bring me 5 wood and 3 stone, and I\'ll teach you the secrets of trade.',
        choices: [
          {
            text: 'I\'ll get right on it',
            nextDialogue: null
          }
        ]
      }
    ],
    requirements: {
      level: 1,
      energy: 10,
      money: 0,
      timeOfDay: ['morning', 'noon', 'evening'],
      items: [
        { id: 'wood', amount: 5 },
        { id: 'stone', amount: 3 }
      ]
    },
    rewards: {
      xp: 100,
      money: 50,
      energy: 0,
      items: [
        { id: 'gold_ore', amount: 1 }
      ]
    },
    completion: {
      conditions: {
        items: [
          { id: 'wood', amount: 5 },
          { id: 'stone', amount: 3 }
        ]
      },
      actions: [
        {
          type: 'complete',
          params: { message: 'You\'ve learned the basics of trading!' }
        }
      ]
    },
    completed: false
  },
  questGiver: {
    id: 'main-quest',
    title: 'A Hero\'s Beginning',
    description: 'Start your journey as a hero in this magical world.',
    dialogues: [
      {
        id: 0,
        speaker: 'Quest Master',
        text: 'Ah, a new adventurer! Are you ready to begin your journey?',
        choices: [
          {
            text: 'I\'m ready',
            nextDialogue: 1
          },
          {
            text: 'Not yet',
            nextDialogue: null
          }
        ]
      },
      {
        id: 1,
        speaker: 'Quest Master',
        text: 'To prove your worth, defeat 3 monsters in the nearby forest.',
        choices: [
          {
            text: 'I accept this challenge',
            nextDialogue: null
          }
        ]
      }
    ],
    requirements: {
      level: 1,
      energy: 20,
      money: 0,
      timeOfDay: ['morning', 'noon', 'evening', 'night'],
      items: []
    },
    rewards: {
      xp: 200,
      money: 100,
      energy: 50,
      items: [
        { id: 'sword', amount: 1 }
      ]
    },
    completion: {
      conditions: {
        enemyDefeat: ['forest_monster']
      },
      actions: [
        {
          type: 'complete',
          params: { message: 'You are now a recognized hero!' }
        }
      ]
    },
    completed: false
  },
  travelMaster: {
    id: 'travel-quest',
    title: 'Paths Unknown',
    description: 'Learn about the various locations in this world.',
    dialogues: [
      {
        id: 0,
        speaker: 'Travel Master',
        text: 'Looking to explore the world? I can help you with that!',
        choices: [
          {
            text: 'Tell me more',
            nextDialogue: 1
          },
          {
            text: 'Maybe later',
            nextDialogue: null
          }
        ]
      },
      {
        id: 1,
        speaker: 'Travel Master',
        text: 'Visit the ancient temple to the north, and I\'ll grant you access to fast travel.',
        choices: [
          {
            text: 'I\'ll head there now',
            nextDialogue: null
          }
        ]
      }
    ],
    requirements: {
      level: 2,
      energy: 30,
      money: 50,
      timeOfDay: ['morning', 'noon'],
      items: []
    },
    rewards: {
      xp: 150,
      money: 75,
      energy: 0,
      items: [
        { id: 'magic_crystal', amount: 1 }
      ]
    },
    completion: {
      conditions: {
        location: { x: 0, y: 0, z: -50, radius: 5 }
      },
      actions: [
        {
          type: 'complete',
          params: { message: 'You can now use fast travel!' }
        }
      ]
    },
    completed: false
  }
};

export function Editor() {
  const { scenes, addScene } = useEditorStore();

  useEffect(() => {
    if (scenes.length === 0) {
      const defaultScene = {
        id: new THREE.Object3D().uuid,
        name: 'Main Scene',
        objects: []
      };
      addScene(defaultScene);
    }
  }, [scenes.length, addScene]);

  return (
    <div className="w-full h-screen flex bg-slate-900">
      <ScenePanel />
      
      <div className="flex-1 relative">
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: true }}
          camera={{ position: [5, 5, 5], fov: 50 }}
          className="w-full h-full"
        >
          <Scene />
          <OrbitControls makeDefault />
        </Canvas>
        <Loader />
        <PropertiesPanel />
      </div>
    </div>
  );
}