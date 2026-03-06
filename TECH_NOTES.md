# Neural Hub - Technical Notes

## Current Stack (v4+)

- **Renderer**: React Three Fiber (@react-three/fiber) - WebGL
- **Post-processing**: @react-three/postprocessing (Bloom)
- **Helpers**: Drei (@react-three/drei) for Html, Line, etc.
- **Build**: Vite with code splitting

## Current Performance Settings

### Rendering
- Node limit: 600 nodes
- Sphere geometry: 48x48 segments
- Fibonacci sphere distribution (no randomness)
- Canvas DPR: Limited to 2

### React Optimization
- `memo()` on NeuralGraph component
- `useCallback` for event handlers
- `useMemo` for filtered nodes, positions, colors
- Node positions computed once in useMemo

### Animation
- Breathing animation via useFrame (scale only, not position)
- Core and project nodes pulse with emissive intensity
- Float offset stored in ref (not causing re-renders)

---

## Known Issues & Pain Points

1. **Animation too aggressive** - Pulsing/breathing makes clicking hard
   - Solution: Add speed control (P0)

2. **Proximity labels need tuning** - Threshold may need adjustment
   - Currently 200 units, may need to increase

3. **Camera in useFrame** - Must use `camera` from useFrame state, not useThree
   - Bug fix: was using useThree() which doesn't work inside useFrame

---

## Future Optimization Ideas

### High Priority
1. **Animation speed control** - Slow after interaction, ramp up over 5s
2. **Increase sphere segments** - Already at 48, could go higher on powerful devices

### Medium Priority
3. **LOD for distant nodes** - Reduce geometry when zoomed out
4. **Connection line optimization** - Only render connected lines when selected

### Low Priority
5. **Web Workers** - Offload position calculations
6. **InstancedMesh** - For very large node counts (>1000)

---

## CSS / Tailwind Override Issue (2026-03-06)

### Problem
CSS changes to background colors and styles were not applying. The root cause was a **Tailwind class** `bg-[#050510]` hardcoded directly on the root `<div>` in App.tsx, which overrode all CSS changes.

### Solution
1. Remove the dark Tailwind background class from the root element
2. Use inline styles for critical styles: `style={{ background: '...' }}`
3. Use `!important` in CSS as a fallback

### Prevention
- Avoid setting background colors on root elements via Tailwind classes when using CSS for them
- Use inline styles for dynamic theming or ensure CSS specificity is higher
- When debugging CSS not applying, check for inline styles and Tailwind classes on the element itself

- WebGL support
- ES2020+ JavaScript
- CSS backdrop-filter (for glass panels)

Tested on Chrome, Firefox, Edge (modern versions)
