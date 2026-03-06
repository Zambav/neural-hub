# Technical Decisions

## Architecture

### Chose React Three Fiber over Canvas 2D
- **Decision:** Use @react-three/fiber for WebGL rendering
- **Rationale:** Better performance for 3D, built-in camera/controls, easier post-processing (bloom)
- **Date:** v4 (2026-03-04)

### Chose Drei Html over CSS2DRenderer
- **Decision:** Use `@react-three/drei` Html component for tooltips
- **Rationale:** Simpler API, works better with R3F camera

## Distribution Algorithm

### Chose Pure Fibonacci Sphere
- **Decision:** All nodes on single Fibonacci shell, NO randomness
- **Rationale:** Creates more spherical/planetary look vs. random/gallery clustering
- **Date:** v4.5 (2026-03-05)
- **Pain point addressed:** User said cluster looked "blob-like" and "sharp"

### Shell Radii (Abandoned)
- **Initial plan:** Concentric shells by node type
- **Why abandoned:** Didn't create the spherical look, just created gaps
- **Date:** v4.5 (2026-03-05)

## Animation

### Scale-only Breathing
- **Decision:** Animate scale only, not position
- **Rationale:** Keeps connection lines stable (lines follow positions)

### Camera Access in useFrame
- **Decision:** Get camera from useFrame state, not useThree()
- **Rationale:** useThree() doesn't work correctly inside useFrame callback
- **Bug fixed:** Proximity tooltips weren't working due to this

## Color Palette

### Cyan/Teal Only (Strict)
- **Decision:** No purple, orange, red, or green variants
- **Rationale:** JARVIS aesthetic, consistent visual language
- **Exception:** Memory nodes use dark cyan-green (#2E8B57) for subtle distinction
