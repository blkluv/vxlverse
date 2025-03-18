<div align="center">

# VXLverse

### _Create, Play, Share: The Ultimate 3D Voxel Game Creation Platform_

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with: React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://reactjs.org/)
[![3D Engine: Three.js](https://img.shields.io/badge/3D%20Engine-Three.js-black.svg)](https://threejs.org/)
[![AI: Mistral](https://img.shields.io/badge/AI-Mistral-8A2BE2.svg)](https://mistral.ai/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5BB974.svg)](https://web.dev/progressive-web-apps/)

</div>

## 🌟 Welcome to VXLverse

VXLverse is a revolutionary browser-based platform that empowers creators to build, customize, and share immersive 3D voxel games—**no coding required**. Combining intuitive design tools with powerful AI capabilities, VXLverse makes game development accessible to everyone while offering advanced features for experienced developers.

<div align="center">

![VXLverse Editor Interface](/public/demo-images/Editor.png)
_The powerful VXLverse editor with real-time 3D rendering, scene hierarchy, and properties panel_

</div>

## 🎮 Complete Game Creation Suite

### ⚔️ Dynamic Combat System

<div align="center">

![Combat Mechanics](/public/demo-images/fight_mechanics.png)
_Engaging combat with projectiles, health systems, and dynamic interactions_

</div>

Create thrilling action gameplay with minimal setup:

- **Projectile-Based Combat** - Implement throwing mechanics, fireballs, and ranged attacks
- **Health & Damage Systems** - Configure hit points, damage values, and combat balancing
- **Enemy AI Behaviors** - Define patrol paths, aggression ranges, and combat strategies
- **Visual Effects** - Add impact animations, particle effects, and combat feedback

### 📜 Quest & Progression System

<div align="center">

![Quest System](/public/demo-images/Quests.png)
_Comprehensive quest system with objectives, rewards, and progression tracking_

</div>

Build engaging gameplay loops with our flexible quest system:

- **Experience-Based Rewards** - Grant XP, items, or abilities upon quest completion
- **Multi-Stage Quests** - Create complex quest chains with branching paths
- **Condition Triggers** - Set up quest availability based on player level, inventory, or previous actions
- **Visual Quest Markers** - Guide players with intuitive quest indicators and waypoints

### 🤖 AI-Powered NPC Conversations

<div align="center">

![AI NPC Dialogue System](/public/demo-images/Npc_Dialogue.png)
_Create dynamic NPCs with unique personalities using our Mistral AI integration_

</div>

Bring your game world to life with intelligent NPCs powered by Mistral's Large Language Model:

- **Rich Character Backstories** - Simply provide character backgrounds and let the AI handle the rest
- **Dynamic Memory** - NPCs remember previous conversations and player choices
- **Natural Language Processing** - Players can interact using natural language instead of predefined options
- **Persistent Conversations** - All dialogues are saved to PocketBase for continuity across game sessions
- **Emotion & Personality** - NPCs respond with appropriate emotions based on their defined traits

## 🛠️ Professional-Grade Tools

### 🏗️ Intuitive Editor

- **Scene Hierarchy Management** - Organize complex game worlds with nested objects and groups
- **Properties Panel** - Configure every aspect of your game objects with visual controls
- **Grid & Snapping System** - Achieve pixel-perfect placement with customizable grid settings
- **3D Model Library** - Access hundreds of pre-made assets with one-click importing
- **Real-time Lighting** - Set the mood with dynamic lighting, shadows, and time-of-day effects

### 🎨 Advanced Game Design

- **Visual Scripting** - Create complex game logic without writing code
- **Behavior Trees** - Define sophisticated AI behaviors and enemy patterns
- **Physics System** - Implement realistic object interactions and collision responses
- **Animation Editor** - Create and modify character animations with intuitive controls
- **Particle Effects** - Add visual flair with customizable particle systems

### 🧠 Cutting-Edge Technology

- **Mistral AI Integration** - Enterprise-grade LLM for dynamic NPC conversations
- **Real-time 3D Rendering** - Optimized Three.js and React Three Fiber implementation
- **Efficient State Management** - Zustand-powered state handling for complex game systems
- **PocketBase Backend** - Secure storage for models, conversations, and player data
- **Progressive Web App** - Install and play offline on desktop and mobile devices
- **Responsive Design** - Beautiful UI built with Tailwind CSS and Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/mpoapostolis/vxlverse-v3.git
cd vxlverse-v3

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000`

## 📖 Create Your First Game

### 1. Setting Up Your Game World

- **Create a New Scene** - Click the "+" button and choose a template or start from scratch
- **Design Your Environment** - Add terrain, buildings, and decorative elements
- **Configure Lighting** - Set the mood with ambient, directional, and point lights
- **Add Interactive Objects** - Place NPCs, items, and interactive elements

### 2. Implementing Game Mechanics

- **Combat System** - Configure projectiles, health systems, and enemy behaviors
- **Quest Framework** - Create objectives with experience rewards and progression
- **Inventory System** - Set up collectible items and equipment
- **Movement Controls** - Fine-tune character movement, jumping, and interactions

### 3. Creating Intelligent NPCs

- **Write Character Backstories** - Provide rich backgrounds for the AI to build upon
- **Configure Dialogue Triggers** - Set up interaction zones and conversation starters
- **Link Quests to Dialogues** - Connect conversations to quest objectives and rewards
- **Test Conversations** - Interact with NPCs to ensure natural dialogue flow

### 4. Polishing Your Game

- **Playtest in Preview Mode** - Experience your game as players would
- **Refine Game Balance** - Adjust difficulty, rewards, and progression
- **Add Sound Effects & Music** - Enhance immersion with audio elements
- **Optimize Performance** - Ensure smooth gameplay across different devices

## 🏗️ Technical Architecture

VXLverse employs a sophisticated component-based architecture built with React and TypeScript:

```
VXLverse/
├── Editor/                # Main workspace components
│   ├── ScenePanel         # Hierarchy and object management
│   ├── PropertiesPanel    # Object configuration interface
│   ├── EditorScene        # 3D rendering environment
│   └── ToolsPanel         # Creation and manipulation tools
├── Game/                  # In-game components
│   ├── GameHUD            # Pixel-art style interface
│   ├── DialogueModal      # AI-powered conversation system
│   ├── CombatSystem       # Fighting mechanics and projectiles
│   ├── QuestManager       # Quest tracking and rewards
│   └── Inventory          # Item management system
├── AI/                    # AI integration components
│   ├── MistralService     # LLM API communication layer
│   ├── ConversationManager# Dialogue history and context handling
│   └── CharacterMemory    # Persistent NPC memory system
└── Stores/                # State management
    ├── editorStore.ts     # Editor state container
    ├── gameStore.ts       # Game runtime state
    └── userStore.ts       # User preferences and authentication
```

The architecture follows a clean separation of concerns, with dedicated modules for editor functionality, game systems, and AI integration. State management is handled through Zustand stores, providing efficient state updates and persistence with minimal re-renders.

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Whether you're fixing bugs, adding features, or improving documentation, your help makes VXLverse better for everyone.

1. Fork the repository
2. Create your feature branch: `git checkout -b amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin amazing-feature`
5. Open a Pull Request

Check our [Contributing Guidelines](CONTRIBUTING.md) for more detailed information.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Three.js](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D rendering engine
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [PocketBase](https://pocketbase.io/) - Open source backend
- [Mistral AI](https://mistral.ai/) - Advanced language model for NPC conversations
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## ✨ Why Choose VXLverse?

### For Game Creators

- **Zero Coding Required** - Build sophisticated games with visual tools and AI assistance
- **Browser-Based** - Create anywhere with no downloads or installations
- **Complete Game Systems** - Pre-built combat, quests, inventory, and dialogue systems
- **AI-Powered NPCs** - Create lifelike characters with minimal effort
- **Real-Time Collaboration** - Work together with friends simultaneously

### For Players

- **Immersive Experiences** - Enjoy authentic pixel-art RPG interfaces with modern gameplay
- **Dynamic Characters** - Have meaningful conversations with AI-powered NPCs
- **Engaging Combat** - Master projectile-based combat with strategic depth
- **Rewarding Progression** - Complete quests for experience and rewards
- **Cross-Platform Play** - Access games on web, mobile, and desktop as PWAs

## 🌐 Community & Resources

- [Discord Community](https://discord.gg/vxlverse) - Join thousands of creators
- [Documentation](https://docs.vxlverse.com) - Comprehensive guides and API references
- [Tutorials](https://vxlverse.com/learn) - Step-by-step learning resources
- [Showcase](https://vxlverse.com/showcase) - Explore games created with VXLverse
- [Feature Requests](https://github.com/mpoapostolis/vxlverse-v3/issues) - Share your ideas

---

<div align="center">

**VXLverse** combines voxel design, AI-powered conversations, combat mechanics, and quest systems to create the ultimate game creation platform.

Created with ❤️ by [Apostolis Bostanis](https://github.com/mpoapostolis)

[Visit VXLverse Website](https://vxlverse.com)

</div>

<!-- Keywords: voxel editor, 3D game creation, browser game maker, no-code game development, three.js game engine, voxel modeling, interactive 3D, web-based game editor, game design platform, 3D world builder, pixel-art UI, retro RPG interface, game HUD design, AI-powered NPCs, LLM integration, dynamic conversations, character backstories, combat mechanics, projectile combat, experience rewards, quest system, PWA -->
