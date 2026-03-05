# Neural Hub — Interactive 3D AI Memory Visualization

## Project Overview
- **Name:** Neural Hub
- **Type:** Interactive 3D Web Application (Demo/MVP)
- **Core Functionality:** Browser-based 3D neural network visualization with mock data — visual demo only, no backend
- **Target Users:** Demo for showcasing AI memory visualization concept

## Business Context
- OpenClaw memory tracker — Neural Hub interactive 3D visualization

## Vision
A spherical web of memories in WebGL/Three.js
- Memories as interactive nodes (clickable)
- Sphere reacts to mouse proximity & interaction
- AI generates images for each memory (future feature)
- Central reactive core node with breathing animation

## Reference Aesthetic
Tony Stark's UI meets a neural brain scan. Living AI neural sphere floating in deep space with:
- Glowing nodes
- Thin connection lines
- Floating label callouts
- Dark glass HUD panels (IcosahedronGeometry)
- Bright central core node with strong bloom
- Memory thumbnail cards on click

## Technical Stack
- Vite + React + TypeScript
- React Three Fiber (@react-three/fiber)
- Drei (@react-three/drei)
- r3f-forcegraph
- @react-three/postprocessing
- Tailwind CSS

## Color System
- **Background**: #050510 (deep space black)
- **Primary Accent**: #00CFFF / #00D9FF (cyan glow)
- **Node Colors**:
  - Memory: #4A90D9 (blue)
  - Project: #5BC8C0 (teal)
  - Task: #F5A623 (orange)
  - Interaction: #9B59B6 (purple)
- **Active Status**: #00FF88 (bright green)
- **Panel BG**: rgba(10, 12, 30, 0.85) with backdrop blur
- **Text Primary**: #E2E8F0 (light slate)
- **Text Secondary**: #94A3B8 (muted slate)

## Typography
- **Display/Headers**: Space Grotesk Bold (Google Fonts)
- **Body/UI**: General Sans Medium (Fontshare)
- **Monospace/Labels**: JetBrains Mono Regular

## Data
- All local mock JSON (120 nodes, ~180 links, 20 interaction entries)
- No backend, no API calls

## Workspace
- **Code/Memory:** `C:\Users\zam-top\.openclaw\workspace\projects\neural-hub\`
- **Deliverables/Images:** `G:\My Drive\Nueral network AI vizualisation\`

## Reference Files
- HTML Design Reference: Provided in project context
- Reference Image: `G:\My Drive\Nueral network AI vizualisation\Reference images\AI network reference image.png`
