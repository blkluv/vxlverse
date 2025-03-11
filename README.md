# VXLverse - 3D Voxel Game Creation Platform

![VXLverse Logo](https://via.placeholder.com/200x60/4F46E5/FFFFFF?text=VXLverse)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Built with: React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://reactjs.org/)
[![3D Engine: Three.js](https://img.shields.io/badge/3D%20Engine-Three.js-black.svg)](https://threejs.org/)

## Overview

VXLverse is a powerful browser-based 3D game creation platform that allows users to build, customize, and share interactive voxel experiences without writing code. Combining the flexibility of voxel-based design with modern web technologies, VXLverse makes game development accessible to creators of all skill levels - from beginners to experienced developers.

![VXLverse Demo](/public/demo-images/Demo.png)

> **Create, Play, Share** - Build immersive 3D worlds and games directly in your browser with our intuitive voxel editor.

### Pixel-Art RPG Interface

![VXLverse Pixel-Art RPG UI](/public/demo-images/Demo2.png)

> **Immersive Game Experience** - Engage players with authentic pixel-art RPG interfaces, dialogue systems, and game HUD.

### AI-Powered NPC Conversations

![VXLverse NPC Dialogue](/public/demo-images/Npc_Dialogue.png)

> **Dynamic Character Interactions** - Create NPCs with rich backstories and personalities using our LLM integration for natural, AI-driven conversations.

## Features

### Intuitive Editor

- **Scene Hierarchy Management**: Easily organize and manipulate 3D objects in your game world
- **Properties Panel**: Customize object properties, appearance, and behaviors
- **Grid & Snapping System**: Precise object placement with customizable grid settings
- **3D Model Library**: Access a growing collection of pre-made 3D models
- **Quest System**: Create interactive game objectives and storylines with pixel-art RPG-style UI
- **Requirements System**: Set up game progression mechanics and conditions
- **AI-Powered NPCs**: Give your characters rich backstories and enable natural conversations using LLM integration

### Advanced Tools

- **Transform Tools**: Move, rotate, and scale objects with precision
- **Brush Tool**: Paint and modify voxel-based objects
- **Preview Mode**: Test your game in real-time within the editor
- **Pixel-Art RPG UI**: Immersive game interface with retro-style HUD, dialogue system, and inventory
- **LLM Integration**: Create AI-driven NPC conversations by providing character backstories

### Technical Capabilities

- **Real-time 3D Rendering**: Powered by Three.js and React Three Fiber
- **State Management**: Efficient state handling with Zustand
- **Responsive UI**: Modern interface built with Tailwind CSS and Framer Motion
- **Asset Management**: Integrated with PocketBase for model storage and retrieval
- **Pixel-Perfect Styling**: Authentic pixel-art aesthetics with consistent design language
- **AI Integration**: Powered by Mistral AI for natural language processing and dynamic NPC interactions

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/mpoapostolis/vxlverse-v3.git
   cd vxlverse-v3
   ```

2. Install dependencies:

   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating a New Scene

1. Launch the VXLverse editor
2. Click the "+" button in the scene tabs area
3. Start adding objects from the Models Library

### Adding Objects to Your Scene

1. Browse the Models Library in the left panel
2. Click the "+" button on any model to add it to your scene
3. Use the transform tools to position, rotate, and scale your object

### Setting Up Game Logic

1. Select an object in your scene
2. Navigate to the Properties Panel on the right
3. Use the Quest and Requirements tabs to set up game interactions
4. Add NPC backstories to enable AI-powered conversations

### Customizing Game UI

1. Access the game components in the src/components/game directory
2. Modify the pixel-art RPG styling to match your game's aesthetic
3. Test your changes in Preview Mode to see the immersive UI in action

## Architecture

VXLverse is built with a component-based architecture using React and TypeScript. The main components include:

- **Editor**: The main workspace where scenes are created and edited
- **ScenePanel**: Manages scene hierarchy and object library
- **PropertiesPanel**: Controls object properties and game logic
- **EditorScene**: Handles 3D rendering and object manipulation
- **GameHUD**: Pixel-art style heads-up display for in-game information
- **DialogueModal**: Immersive RPG-style dialogue system with AI-powered conversations
- **Inventory/QuestLog**: Retro-styled game systems with consistent pixel aesthetics

State management is handled through Zustand stores, with the primary store being `editorStore.ts`.

## Contributing

We welcome contributions to VXLverse! Please feel free to submit pull requests or open issues to improve the platform.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Three.js](https://threejs.org/) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for 3D rendering
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [PocketBase](https://pocketbase.io/) for backend services
- All the amazing 3D model creators who contribute to the library

## Why VXLverse?

- **No Coding Required**: Create complex 3D games without writing a single line of code
- **Browser-Based**: No downloads or installations needed - works on any modern browser
- **Voxel-Based Design**: Intuitive building blocks make 3D creation accessible to everyone
- **Real-Time Collaboration**: Work together with friends on the same project simultaneously
- **Cross-Platform Publishing**: Deploy your games to web, mobile, and desktop platforms
- **Authentic Pixel-Art UI**: Immersive retro-style game interfaces that enhance player experience
- **Cohesive RPG Systems**: Integrated dialogue, inventory, and quest systems with consistent styling
- **AI-Powered Characters**: Create NPCs with unique personalities and dynamic conversations using LLM integration

## Community and Support

- [Discord Community](https://discord.gg/vxlverse)
- [Documentation](https://docs.vxlverse.com)
- [Tutorials](https://vxlverse.com/learn)
- [Feature Requests](https://github.com/mpoapostolis/vxlverse-v3/issues)

## Keywords

voxel editor, 3D game creation, browser game maker, no-code game development, three.js game engine, voxel modeling, interactive 3D, web-based game editor, game design platform, 3D world builder, pixel-art UI, retro RPG interface, game HUD design, AI-powered NPCs, LLM integration, dynamic conversations, character backstories

---

Created with ❤️ by [Apostolis Bostanis](https://github.com/mpoapostolis)

[Visit VXLverse Website](https://vxlverse.com)
