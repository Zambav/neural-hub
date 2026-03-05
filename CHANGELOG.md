# Neural Hub Changelog

## v4-data-driven (Current)
*2026-03-05*

### Data Architecture v4.3
- **Real data generator v3** reads entire workspace
- Includes: job-hunt, memory, CLIENT_OUTREACH, projects/neural-hub, skills, .learnings
- **110 nodes**: 1 core, 8 identity (ALL root .md files!), 6 projects, 72 files, 12 folders, 11 memory
- **Identity nodes connected to core**: AGENTS.md, SOUL.md, USER.md, TOOLS.md, MEMORY.md, HEARTBEAT.md, IDENTITY.md, job-search-keywords.md

### Visualization Updates (v4.3) - 2026-03-05
- **Core connects to ALL identity nodes** (8 lines from center)
- **Projects MUCH bigger**: priority 5 = radius 12, priority 4 = 9, priority 3 = 7
- **Projects with pulsing glow** - emissive oscillates with sine wave
- **More random spherical distribution** - angle jitter, depth variation by type
- **More connections**: projects → 8 nodes, identity → 4, folders → 4, files/memory → 3
- **Memory darker cyan-green** (#2E8B57)
- **Fibonacci sphere with randomness** - projects/identity closer to core, files scattered

### Node Size Hierarchy (v4.3)
```
Core:       radius 16  (white/yellow, center, pulsing)
Project:    radius 7-12 (brightest cyan, based on priority, MORE GLOW)
Identity:   radius 4   (cyan)
Folder:     radius 2.5 (darker teal)
Memory:     radius 1.8 (dark cyan-green)
File:       radius 1.0 (smallest)
```

### Node Size Hierarchy
```
Core:       radius 14  (white/yellow, center)
Project:    radius 5-8 (brightest cyan, based on priority)
Identity:   radius 3.5 (cyan)
Folder:     radius 2.0 (darker teal)
Memory:     radius 1.5 (dark cyan-green)
File:       radius 1.0 (smallest)
```

### Color Palette (Cyan/Teal ONLY)
```
Core:       #FFFFFF (white) with #FFD700 (gold) pulsing
Identity:   #00FFFF (cyan)
Project:    #00FFFF (brightest cyan)
Folder:     #00CED1 (darker cyan)
File:       #008B8B (dark teal)
Memory:     #2E8B57 (dark cyan-green)
```

### Interactions
- Click to select (highlights connected nodes)
- Double-click for detail panel
- Search filters nodes in real-time
- ESC to deselect
- Hover for tooltips
- Auto-rotation when idle

### Performance
- 108 nodes (was 64)
- ~90 connections
- Reduced geometry segments for mobile
- GPU-accelerated with bloom post-processing

---

## v3-performance
*2026-03-04*

### Performance
- Reduced idle animation speed by 50%
- Reduced idle movement distance by 60%
- Canvas GPU optimizations (`willReadFrequently: false`, `alpha: false`)
- 30fps frame throttling
- 80 nodes (optimized from 300)
- 120 connections (optimized from 450)

### Navigation
- Click+drag to rotate around sphere (inverted for natural feel)
- Mouse wheel zoom (scroll up = zoom in)
- Default zoom 0.5x (more zoomed out)
- Zoom range: 0.2x to 2x

### UI/UX
- Scroll inverted drag feels natural
- Background image support (`/assets/background.JPG`)
- Proximity labels for project nodes (appear when mouse within 80px)
- Hover tooltips with node info
- Click opens detail modal panel

### Visual
- Node sizes: Projects=28, Tasks=8, Memories=3.5
- Project nodes: cyan (#00D9FF)
- Hologram background spheres (later removed)

---

## v2-optimization
*2026-03-04*

### Initial v2 Release
- Complete Canvas-based 3D visualization
- Search filtering with node highlighting
- Fibonacci sphere distribution
- Particle burst effects on click
- Full UI: header, left panel (metrics), right panel (log), footer

### Performance Optimizations Applied
- Node count: 300 → 80
- Sphere radius: 380 → 500 → 700
- Large nodes: r=14px (was 8-10px)
- Connections: 450 → 120
- Removed expensive SVG filters
- Removed particle system (replaced with instant flash)
- Canvas optimizations (pre-calculated positions, LOD culling)
- 30fps throttling
- O(1) hover/search lookups

---

## v1 (Original)
*2026-03-04*

- React + Three.js based visualization
- Basic node rendering with OrbitControls
- Simple modal for node details