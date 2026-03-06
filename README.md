# Neural Hub

Interactive 3D visualization of OpenClaw's workspace - projects, files, memory logs, and system identity rendered as a spherical web in WebGL.

## Quick Start

```bash
cd projects/neural-hub
npm install
npm run dev
```

## Generate Data

**Real data** (reads your workspace):
```bash
npx tsx src/data/generateNeuralData.ts
```

**Mock data** (2030 fake nodes for testing):
```bash
npx tsx src/data/generateFakeData.ts
```

## Build for Production

```bash
npm run build
# Output in dist/
```

## Project Structure

```
src/
├── components/
│   ├── NeuralGraph.tsx    # Main 3D visualization
│   ├── NodeDetailPanel.tsx # Right panel - node details
│   ├── SearchBar.tsx      # Top search bar
│   ├── SystemStatusHUD.tsx # Left panel - metrics
│   └── InteractionLog.tsx # Right panel - activity log
├── data/
│   ├── generateNeuralData.ts  # Real data generator
│   ├── generateFakeData.ts    # Fake data generator
│   ├── mockNodes.ts           # Fallback mock data
│   └── neural-data.json       # Generated real data
└── types/
    └── index.ts               # TypeScript interfaces
```

## Tech Stack

- Vite + React + TypeScript
- React Three Fiber (@react-three/fiber)
- Drei (@react-three/drei)
- @react-three/postprocessing (Bloom effects)

## Features

- Fibonacci sphere distribution
- Core at center with pulsing glow
- Node types: core, identity, project, folder, file, memory
- Click to select, hover for tooltips
- Search filtering
- Connection lines between related nodes
- Proximity-based labels when zoomed in

## See Also

- [BRIEF.md](./BRIEF.md) - Project overview and specs
- [FUTURE.md](./FUTURE.md) - Feature roadmap
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [PROGRESS.md](./PROGRESS.md) - Current progress
