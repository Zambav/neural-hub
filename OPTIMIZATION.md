# Neural Hub - Performance Optimization

## Current Version: v4.5 (React Three Fiber / WebGL)

---

## Build Optimizations

- [x] Vite with code splitting
- [x] Manual chunks: three-vendor, postprocessing, react-vendor
- [x] Terser minification
- [x] ESNext target

## React/R3F Optimizations

- [x] `memo()` on NeuralGraph component
- [x] `useCallback` for event handlers (onClick, onPointerOver, etc.)
- [x] `useMemo` for filtered nodes, positions, colors, connections
- [x] Pre-computed highlighted IDs set for O(1) lookup
- [x] Sphere geometry cached (48x48 segments)
- [x] Canvas DPR limited to [1, 2]
- [x] `powerPreference: 'high-performance'`

## Rendering Optimizations

- [x] Node limit: 600 nodes
- [x] Fibonacci sphere distribution (no per-frame calculation)
- [x] useFrame for animations (runs outside React render cycle)
- [x] Ref-based animation (no state updates for breathing)
- [x] Connections filtered to nearest neighbors only

## Network Optimizations

- [x] Preconnect hints for external font resources
- [x] DNS prefetch for iconify

---

## Current Performance Settings

| Setting | Value |
|---------|-------|
| Node limit | 600 |
| Sphere segments | 48x48 |
| Camera DPR | 1-2 |
| Animation | useFrame (no React re-renders) |

---

## Future Optimization Ideas

- [ ] LOD system for distant nodes
- [ ] InstancedMesh for >1000 nodes
- [ ] Web Workers for data processing
- [ ] Lazy load node details panel
- [ ] Animation throttling on low-end devices
