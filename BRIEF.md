# Neural Hub — Interactive 3D AI Memory Visualization

## Project Overview
- **Name:** Neural Hub
- **Type:** Interactive 3D Web Application (Data-driven)
- **Core Functionality:** Real-time 3D visualization of OpenClaw's workspace - projects, files, memory logs, and system identity
- **Target Users:** OpenClaw admin/owner viewing their AI assistant's "mind"

## Current Version: v4-data-driven (2026-03-05)

## Vision
A spherical web of memories in WebGL/Three.js - "MRI scan of an AI's mind"
- Core node at center (OpenClaw identity)
- Projects as large nodes with file children orbiting
- Memory nodes scattered in outer sphere
- Lines connecting everything (radial from core + mesh network)
- Tony Stark's JARVIS neural interface aesthetic

## Core Design Requirements (MANDATORY)

### 1. Core Node Position
- **MUST** be at exact center (0, 0, 0)
- All other nodes distributed around it on Fibonacci sphere
- Lines radiate FROM core TO all other nodes

### 2. Node Sizing (by priority)
```
Core:       radius 14  (largest, center)
Projects:   radius 4-5 (based on priority)
Identity:   radius 3.5
Memory:     radius 1.5
Files:      radius 1.2 (smallest)
```

### 3. Color Palette (Cyan/Teal ONLY)
```
Core:       #FFFFFF / #FFFFEE (white) with #FFD700 (gold) emissive
Identity:   #00FFFF (cyan)
Project:    #00D9FF (bright cyan)
File:       #008B8B (dark teal)
Memory:     #20B2AA (light sea green)
```
- NO purple, orange, green variants, or red
- All colors must be in cyan/teal family

### 4. Core Node Appearance
- Color: White/yellow (#FFFFFF, #FFFFEE)
- Emissive: Gold (#FFD700)
- Bloom: Pulsing intensity (sine wave, ~2 sec cycle, range 1.2-2.8)
- Size: radius 14
- Geometry: Icosahedron or Sphere with 24 segments

### 5. Sphere Distribution
- Fibonacci sphere algorithm for even node distribution
- NOT galaxy clustering (no orbiting around larger nodes)
- All non-core nodes at ~350 radius with slight depth variation

### 6. Connections
- Core connects to EVERY node (radial lines)
- Additional mesh: Projects→4 connections, Identity→3, Files/Memory→2

## Technical Stack
- Vite + React + TypeScript
- React Three Fiber (@react-three/fiber)
- Drei (@react-three/drei)
- @react-three/postprocessing (Bloom)
- Tailwind CSS

## Data Generator
- Script: `src/data/generateNeuralData.ts`
- Input: Workspace folders (job-hunt, memory, CLIENT_OUTREACH, projects/neural-hub)
- Output: `src/data/neural-data.json`
- Runs via: `npx tsx src/data/generateNeuralData.ts`

## Data Structure
```json
{
  "nodes": [
    { "id": "core_openclaw", "type": "core", "title": "OpenClaw", "priority": 5, ... },
    { "id": "identity_agents", "type": "identity", "title": "Agent Workspace Rules", ... },
    { "id": "proj_job_hunt", "type": "project", "title": "Job Search Tracker", "fileCount": 3, ... },
    { "id": "proj_job_hunt_file_00_keywords", "type": "file", "parentId": "proj_job_hunt", ... },
    { "id": "mem_2026_03_05_xxx", "type": "memory", "parentId": "...", ... }
  ],
  "links": [
    { "source": "core_openclaw", "target": "proj_job_hunt", "relationType": "core_to_project" }
  ]
}
```

## Node Types
- **core**: OpenClaw itself (1 node, center)
- **identity**: System files (AGENTS.md, SOUL.md, USER.md, TOOLS.md, MEMORY.md, HEARTBEAT.md)
- **project**: Major workspace folders (job-hunt, memory, CLIENT_OUTREACH, neural-hub)
- **file**: Individual files within projects (small nodes orbiting projects)
- **memory**: Daily activity logs from `memory/` folder

## Workspace Mapping
| Folder | Project ID | File Children |
|--------|------------|---------------|
| job-hunt | proj_job_hunt | 7 files |
| memory | proj_memory | 13 files |
| CLIENT_OUTREACH | proj_client_outreach | 11 files |
| projects/neural-hub | proj_neural_hub | 22 files |

## Changelog
See `CHANGELOG.md` for detailed iteration history.

## Reference
- Tony Stark JARVIS neural interface
- Brain MRI scans
- Neural network visualizations
- Deep space with glowing elements

## Future Features (See FUTURE.md for full list)

1. **Health Layer Toggle** - Color nodes by health (green/amber/red/grey) instead of type
2. **Timeline Scrubber** - Watch the sphere grow over time with a time slider
3. **Contextual Right Panel** - Edit projects, mark tasks done, add notes directly
4. **Real Dashboard Data** - Replace left panel mock data with real OpenClaw metrics
5. **Animation Speed Control** - Slow animations after user interaction for usability
6. **Live Pulse** - Show when OpenClaw is actively working on a task
7. **Surface Tension Effect** - New nodes emerge from parents like bubbles