# Neural Hub Changelog

## v3-performance (Current)
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
