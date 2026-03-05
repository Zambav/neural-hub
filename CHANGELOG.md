# Neural Hub Changelog

## v4.4 - 2026-03-05 (Current)

### Visualization Updates
- **Fake data generator** creates 2030 nodes (100 projects, 1387 files, 304 folders)
- **Node limit increased** from 100 to 600 for full sphere rendering
- **LOD fix**: Reduced dimming by 20% - nodes stay visible when zoomed out
  - Dimmed opacity: 0.15 → 0.35
  - Non-highlighted opacity: 0.75 → 0.8
  - Dimmed emissive: 0.05 → 0.15
  - Connection line opacity: 0.02 → 0.2
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
Task:       radius 1.5 (cyan-green)
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
- Identity nodes: 8 (ALL root .md files connected to core)
- Projects: 100 (in fake data)

### Interactions
- Click to select (highlights connected nodes)
- Hover shows tooltip with node info
- Tooltip updates on hover even when node selected
- Search filters nodes in real-time
- ESC to deselect
- Auto-rotation when idle

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
