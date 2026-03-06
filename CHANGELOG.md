# Neural Hub Changelog

## v4.6 - 2026-03-06

### UI/Visual Updates
- **Background**: Fixed dark gradient issue (root Tailwind class was overriding CSS)
  - Final gradient: `radial-gradient(circle at center, #050a1f 0%, #050510 100%)`
- **Outer rings**: Reduced by 15% (320→272, 480→408)
- **Default zoom**: Increased 5% (0.75→0.79)
- **Header spacing**: Moved down for better positioning
- **Left/right panels**: Adjusted vertical positioning

### Node Colors & Specs
- PROJECT: #00D9FF (bright cyan), 14px radius
- TASK: #5BC8C0 (teal), 7px radius
- MEMORY: #4A90D9 (soft blue), 3px radius
- CORE: #FFD700 (gold) with glow

### Node Opacity
- Default (idle): 0.1-1.0 based on Z-depth
- Hovered: 1.0 (hovered), 0.7 (connected), 0.15 (other)
- Selected: 1.0 (selected), 0.8 (connected), 0.02 (other)

### Link Colors
- Default: #00D9FF, 0.1 opacity, 0.5px
- Hovered: #FFFFFF, 1.0 opacity, 1.0px
- Selected: #FFFFFF, 1.0 opacity, 1.5px

### Debug Notes
- CSS fix: Removed hardcoded Tailwind `bg-[#050510]` from root div in App.tsx
- Solution: Used inline style + `!important` in CSS

---

## v4.5 - 2026-03-05 (Current)

### Tonight's Updates
- **Pure Fibonacci Sphere Distribution**: Removed all randomness, nodes now evenly distributed on spherical shell (like a planet/solar system)
- **Proximity Tooltips**: When camera is within 200 units of large project nodes (priority 4+), small labels appear showing project name
- **Hover Tooltip Fix**: Tooltip now properly hides when mouse leaves any sphere (previously stayed visible if node was selected)
- **Smoother Spheres**: Increased sphere geometry from 24x24 to 48x48 segments
- **Float Animation Reduced**: Decreased from 12/8/5 to 10/7/4 for less erratic movement

### Visualization Specs
- Core at center (0,0,0), radius 16, white/gold pulsing
- Projects: radius 7-12 based on priority (5=12, 4=9, 3=7)
- Identity: radius 4
- Folders: radius 2.5
- Files: radius 1.0
- Memory: radius 1.8
- All non-core nodes on single Fibonacci shell at ~350 radius

### Interactions
- Click to select (highlights node + connected nodes)
- Hover shows tooltip with node info (name, type, priority stars, status)
- Proximity labels appear on large projects when zoomed in
- Tooltip follows mouse position
- ESC or click empty space to deselect

---

## v4.4 - 2026-03-05

### Visualization Updates
- **Fake data generator** creates 2030 nodes (100 projects, 1387 files, 304 folders)
- **Node limit increased** from 100 to 600 for full sphere rendering
- **LOD fix**: Reduced dimming by 20% - nodes stay visible when zoomed out
- **Tooltip fix**: Shows hovered node info even when a node is selected
- **More connections**: projects → 8 nodes, identity → 4, folders → 4, files/memory → 3
- **Pulsing glow** on projects - emissive oscillates with sine wave

### Node Size Hierarchy
```
Core:       radius 16  (white/yellow, center, pulsing)
Project:    radius 7-12 (brightest cyan, based on priority)
Identity:   radius 4   (cyan)
Folder:     radius 2.5 (darker teal)
Memory:     radius 1.8 (dark cyan-green)
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

### Data
- **Real data**: 110 nodes (run `npx tsx src/data/generateNeuralData.ts`)
- **Fake data**: 2030 nodes (run `npx tsx src/data/generateFakeData.ts`)

---

## v4.3 - 2026-03-04
- Real data generator reads entire workspace
- Fibonacci sphere distribution with randomness
- Core at exact center (0,0,0)
- Identity nodes connected to core

---

## v3 - 2026-03-04
- Performance optimizations
- Canvas-based 3D visualization

---

## v2 - 2026-03-04
- Initial React Three Fiber implementation

---

## v1 - 2026-03-04
- Original prototype
