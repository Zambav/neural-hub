# Neural Hub — Interactive 3D AI Memory Visualization

## Project Overview
- **Name:** Neural Hub
- **Type:** Interactive 3D Web Application (Data-driven)
- **Core Functionality:** Real-time 3D visualization of OpenClaw's workspace - projects, files, memory logs, and system identity
- **Target Users:** OpenClaw admin/owner viewing their AI assistant's "mind"

## Current Version: v4.5 (2026-03-05)

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
- All other nodes distributed on Fibonacci sphere shell
- Lines radiate FROM core TO identity nodes

### 2. Node Sizing (Current)
```
Core:       radius 16   (largest, center, white/gold pulsing)
Projects:   radius 7-12 (based on priority: 5=12, 4=9, 3=7)
Identity:   radius 4    (cyan)
Folders:    radius 2.5  (darker teal)
Memory:     radius 1.8  (dark cyan-green)
Files:      radius 1.0  (smallest)
```

### 3. Color Palette (Cyan/Teal ONLY)
```
Core:       #FFFFFF / #FFFFEE (white) with #FFD700 (gold) emissive, pulsing
Identity:   #00FFFF (cyan)
Project:    #00FFFF (brightest cyan)
File:       #008B8B (dark teal)
Memory:     #2E8B57 (dark cyan-green)
Folder:     #00CED1 (darker cyan)
```
- NO purple, orange, green variants (except memory), or red
- All colors must be in cyan/teal family

### 4. Core Node Appearance
- Color: White/yellow (#FFFFFF, #FFFFEE)
- Emissive: Gold (#FFD700)
- Bloom: Pulsing intensity (sine wave, ~2 sec cycle, range 1.2-2.8)
- Size: radius 16
- Geometry: Sphere with 48 segments

### 5. Sphere Distribution (v4.5 - Current)
- **PURE Fibonacci sphere** - NO randomness
- All non-core nodes at ~350 radius on single shell
- Slight radius variation by priority only (each level +15 units)
- Looks like a planet/solar system, not a galaxy

### 6. Connections
- Core connects to ALL identity nodes (radial lines)
- Mesh network: Projects→8 connections, Identity→4, Folders→4, Files/Memory→3

## Technical Stack
- Vite + React + TypeScript
- React Three Fiber (@react-three/fiber)
- Drei (@react-three/drei)
- @react-three/postprocessing (Bloom)
- CSS Modules / App.css

## Data Generators
- **Real data**: `src/data/generateNeuralData.ts` → reads workspace → `neural-data.json`
- **Fake data**: `src/data/generateFakeData.ts` → 2030 mock nodes
- Run: `npx tsx src/data/generateNeuralData.ts`

## Data Structure
```json
{
  "nodes": [
    { "id": "core_openclaw", "type": "core", "title": "OpenClaw", "priority": 5, "status": "active" },
    { "id": "identity_agents", "type": "identity", "title": "AGENTS.md", "priority": 5, "status": "active" },
    { "id": "proj_job_hunt", "type": "project", "title": "Job Search Tracker", "priority": 4, "status": "active" },
    { "id": "file_keywords", "type": "file", "title": "keywords.md", "priority": 2, "status": "active" },
    { "id": "mem_2026_03_05", "type": "memory", "title": "Daily Memory Log", "priority": 1, "status": "active" }
  ],
  "links": [
    { "source": "core_openclaw", "target": "identity_agents", "relationType": "core_to_identity" }
  ]
}
```

## Node Types
| Type | Description | Count (Real) | Size |
|------|-------------|--------------|------|
| core | OpenClaw itself | 1 | 16 |
| identity | System files (AGENTS, SOUL, USER, etc) | ~8 | 4 |
| project | Major workspace folders | varies | 7-12 |
| folder | Subdirectories | varies | 2.5 |
| file | Individual files | varies | 1.0 |
| memory | Daily activity logs | varies | 1.8 |

## Interactions
- **Click** → Select node, highlight connections
- **Hover** → Show tooltip with name, type, priority stars, status
- **Zoom** → Mouse wheel, range 200-1200
- **Pan** → Click and drag (orbit controls)
- **Search** → Type in search bar to filter nodes
- **ESC** → Deselect

## Proximity Tooltips (NEW in v4.5)
When camera is within 200 units of a large project node (priority 4+), a small label appears showing the project name without needing to hover. Hover takes priority over proximity labels.

---

## Future Features (See FUTURE.md for full list)

1. **Animation Speed Control** - Slow animations after interaction for usability
2. **Health Layer Toggle** - Color nodes by health (green/amber/red/grey)
3. **Contextual Right Panel** - Edit projects, mark tasks done, add notes
4. **Real Dashboard Data** - Replace left panel mock with real OpenClaw metrics
5. **Timeline Scrubber** - Watch sphere grow over time
6. **Live Pulse** - Show when OpenClaw is actively working
7. **Surface Tension Effect** - Nodes emerge from parents like bubbles

---

## Pain Points (To Address)
1. Animation too aggressive → need speed control
2. Panel is read-only → need editable panel
3. Left panel has mock data → need real metrics
4. No time perspective → need timeline scrubber
5. Can't see active work → need live pulse

---

## Reference
- Tony Stark JARVIS neural interface
- Brain MRI scans
- Neural network visualizations
- Deep space with glowing elements
