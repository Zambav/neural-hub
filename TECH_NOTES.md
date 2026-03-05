# Neural Hub - Performance & Tech Notes

## Current Performance Optimizations

### Rendering
- 30fps frame throttling (was 60fps)
- 80 nodes with Fibonacci sphere distribution
- ~120 connection lines
- LOD culling for nodes behind camera
- Canvas: `willReadFrequently: false, alpha: false`

### Animation
- Pulse animation speed: 0.25 + priority*0.075
- Movement amplitude: 0.02 + priority*0.012 (60% smaller than v1)
- Auto-rotation when idle

### Interaction
- Click+drag navigation (inverted for natural feel)
- Mouse wheel zoom (0.2x to 2x range)
- Proximity labels for project nodes (80px threshold)
- Hover detection with tooltips

---

## Potential Future Optimizations

### High Priority
1. **Reduce node count to 50** - Most users won't notice with size variance
2. **Disable connection lines** - Draw to offscreen canvas once, then blit
3. **Pre-render static elements** - Grid/background to offscreen canvas

### Medium Priority
4. **Lower to 24fps** - Save 20% CPU, barely noticeable
5. **Remove auto-rotation** - Only rotate on drag
6. **Batch canvas operations** - Use path2D for similar operations
7. **Pre-calculate colors with opacity** - Avoid globalAlpha state changes

### Low Priority / Experimental
8. **Use Float32Array instead of objects** - More cache-friendly node data
9. **Document visibility check** - Skip frames when tab hidden
10. **Web Workers** - Offload calculation to background thread
11. **WebGL** - Switch from Canvas 2D to WebGL for better GPU usage
12. **Level of Detail (LOD)** - Different node detail at different zoom levels

---

## GPU Optimization Checklist

- [x] `willReadFrequently: false`
- [x] `alpha: false` 
- [x] Minimize `globalAlpha` changes
- [x] LOD culling behind camera
- [x] Batch similar draw operations

---

## File Structure

```
neural-hub/
├── public/
│   └── assets/
│       └── background.JPG    # Background image
├── src/
│   ├── components/           # React components (v1)
│   ├── data/                 # Mock data
│   └── App.tsx               # Main React app (v1)
├── index.html                # Standalone Canvas version (v2/v3)
├── CHANGELOG.md              # This file
├── BRIEF.md                  # Project brief
├── PROGRESS.md               # Progress tracking
└── README.md                 # Project readme
```

---

## Browser Support

Tested on:
- Chrome 90+
- Firefox 88+
- Edge 90+

Requirements:
- Canvas API
- ES6+ JavaScript
- CSS backdrop-filter (for glass panels)
