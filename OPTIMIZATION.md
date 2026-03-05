# Neural Hub v2 — Performance Optimization Notes

## Overview
This document tracks the performance optimizations for v2 of the Neural Hub project.

---

## Performance Optimizations Applied

### Node Count Reduction
- **Before:** 300 nodes
- **After:** 80 nodes (30 large, 30 medium, 20 small)
- **Impact:** ~73% reduction in geometry/mesh objects

### Sphere Layout
- **Before:** radius = 380
- **After:** radius = 500
- **Impact:** More spread out nodes, better visual separation

### Node Sizing
- **Before:** Large nodes at r=8-10px
- **After:** Large nodes at r=14px
- **Impact:** Large nodes (projects/sprints) stand out more prominently

### Connection Lines
- **Before:** ~450 connections
- **After:** ~120 connections (only near neighbors)
- **Impact:** Significant reduction in line rendering overhead

### Visual Effects
- **Before:** Expensive SVG filters for glow effects
- **After:** Removed SVG filters, simplified glow
- **Impact:** Faster rendering, less GPU overhead

### Particles System
- **Before:** Heavy particle system
- **After:** Removed particles, replaced with instant flash effect
- **Impact:** Massive performance gain (most expensive feature removed)

### Canvas Rendering Optimizations
- Pre-calculated Fibonacci sphere positions
- Camera culling (LOD) for nodes behind camera
- Cached canvas styling (no repeated DOM style calculations)
- Batch drawing operations
- Reused typed arrays (no allocation per frame)

### Frame Rate
- **Before:** 60fps target
- **After:** 30fps throttling
- **Impact:** Reduced CPU/GPU load on lower-end devices

### Hover/Search Filtering
- **Before:** O(n) linear search
- **After:** O(1) hash lookups
- **Impact:** Instant hover detection and search filtering

---

## Expected Results

✅ Much faster/smoother interaction (no lag)
✅ Larger orange nodes standing out more (projects/sprints)
✅ Better spacing between nodes (more room to breathe)
✅ Instant click response (no heavy particle system)
✅ Cleaner visual (no jittery animations)
✅ Better hover interaction (simpler but faster)

---

## v3 Performance Optimizations (2026-03-05)

### Vite Build Optimizations
- [x] Code splitting with manual chunks (three-vendor, postprocessing, react-vendor)
- [x] Terser minification with console/debugger removal
- [x] ESNext target for smaller bundles
- [x] Optimized deps include for faster dev builds

### React/R3F Optimizations
- [x] Added memo() to NeuralGraph component
- [x] useCallback for stable event handlers
- [x] useMemo for filtered nodes and positions
- [x] Pre-computed highlighted IDs set for O(1) lookup
- [x] Pre-created geometry objects to avoid recreation
- [x] Canvas DPR limited to [1, 2]
- [x] Canvas gl: antialias: false, powerPreference: 'high-performance'

### HTML/Network Optimizations
- [x] Added preconnect hints for external resources
- [x] Added dns-prefetch for iconify

### Vanilla JS Canvas Optimizations
- [x] 30fps throttling (fpsInterval = 1000/30)
- [x] Node count reduced to 80 (30 large, 30 medium, 20 small)
- [x] Connection limit capped at 120
- [x] Camera culling for nodes behind camera
- [x] Search filtering with O(1) hash lookups
- [x] Breathing animation amplitude reduced 60%
- [x] Simplified glow effects

---

## Future Optimization Ideas

- [ ] Make large nodes even bigger
- [ ] Adjust color scheme
- [ ] Add back specific effects selectively
- [ ] Fine-tune spacing further
- [ ] Implement WebGL instancing for nodes
- [ ] Consider Web Workers for data processing
- [ ] Add lazy loading for node details

---

## Testing Checklist

- [ ] Verify 3D visualization renders without errors
- [ ] Test node interactions (hover, click)
- [ ] Check frame rate on different devices
- [ ] Verify visual appearance matches design goals
- [ ] Test search functionality performance
- [ ] Validate mobile responsiveness
