import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import NeuralGraph from './components/NeuralGraph';
import SystemStatusHUD from './components/SystemStatusHUD';
import InteractionLog from './components/InteractionLog';
import NodeDetailPanel from './components/NodeDetailPanel';
import SearchBar from './components/SearchBar';
import { mockNodes } from './data/mockNodes';
import './App.css';

function NeuralNode({ position, color, isCenter, onClick }: { 
  position: [number, number, number], 
  color: string, 
  isCenter?: boolean,
  onClick?: () => void
}) {
  return (
    <mesh position={position} onClick={onClick}>
      {isCenter ? (
        <icosahedronGeometry args={[10, 0]} />
      ) : (
        <sphereGeometry args={[3, 16, 16]} />
      )}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={isCenter ? 3 : 1}
      />
      {isCenter && (
        <Html position={[0, 18, 0]} center>
          <div style={{ 
            background: 'rgba(0,15,25,0.8)', 
            color: '#00D9FF', 
            padding: '4px 8px', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '10px',
            border: '1px solid rgba(0,217,255,0.3)'
          }}>
            OPENCLOW NEURAL HUB
          </div>
        </Html>
      )}
    </mesh>
  );
}

function App() {
  const [selectedNode, setSelectedNode] = useState<any>(null); // For highlighting
  const [detailNode, setDetailNode] = useState<any>(null); // For detail panel
  const [searchQuery, setSearchQuery] = useState('');

  // ESC key to deselect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNode(null);
        setDetailNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // When node is selected in graph, just highlight (don't open panel yet)
  const handleSelectNode = (node: any) => {
    setSelectedNode(node);
    setDetailNode(null); // Clear detail panel when selecting new node
  };

  // When Info button is clicked, open detail panel
  const handleNodeClick = (node: any) => {
    setDetailNode(node);
    setSelectedNode(node);
  };

  // Handle click from interaction log (direct to detail)
  const handleEntryClick = (nodeId: string) => {
    const node = mockNodes.find((n: any) => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setDetailNode(node);
    }
  };

  return (
    <div className="app-container">
      <div className="scanline" />
      <div className="background-effects">
        <div className="grid-pattern" />
        <div className="orbit-ring ring-1" />
        <div className="orbit-ring ring-2" />
      </div>

      <header className="top-bar">
        <div className="logo-section">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="logo-title">
              Neural Hub 
              {selectedNode && (
                <span id="selected-node-header" className="ml-4 text-xs font-normal text-cyan-700 tracking-normal">
                  | SELECT_NODE: {selectedNode.title?.toUpperCase()}
                </span>
              )}
            </h1>
            <span className="logo-version mono-text">VERSION 4.2.0-STARK</span>
          </div>
        </div>

        <SearchBar query={searchQuery} onChange={setSearchQuery} />

        <div className="user-section">
          <div className="connection-status">
            <span className="status-label">Connection Status</span>
            <span className="status-value">
              <span className="status-dot" />
              SECURE LINK ACTIVE
            </span>
          </div>
          <button className="user-avatar">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=stark&backgroundColor=00d9ff" alt="User" />
          </button>
        </div>
      </header>

      <main className="main-content">
        <aside className="left-panel">
          <SystemStatusHUD />
        </aside>

        <section className="center-canvas">
          <Canvas 
            camera={{ position: [0, 0, 700], fov: 60 }}
            // Performance: Limit DPR to 2 for high-DPI screens
            dpr={[1, 2]}
            // Performance: Use demand frame loop when not animating
            frameloop="always"
            // Performance: Disable default antialias (post-processing handles it)
            gl={{ 
              antialias: false,
              powerPreference: 'high-performance',
              stencil: false,
              depth: true,
              alpha: true,
            }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[100, 100, 100]} intensity={1} />
            
            {/* 3D Neural Graph with search */}
            <NeuralGraph onNodeClick={handleNodeClick} searchQuery={searchQuery} selectedNode={selectedNode} onSelectNode={handleSelectNode} />

            <OrbitControls 
              enableDamping 
              autoRotate={!searchQuery} 
              autoRotateSpeed={0.15}
              enablePan={false}
              minDistance={200}
              maxDistance={1200}
              dampingFactor={0.04}
            />
            <EffectComposer>
              <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            </EffectComposer>
          </Canvas>

          <div className="central-stats">
            <div className="mono-text stats-label">Neural Density</div>
            <div className="stats-value">
              {searchQuery ? (
                <span style={{ color: '#00D9FF' }}>
                  {mockNodes.filter((n: any) => n.title?.toUpperCase().includes(searchQuery.toUpperCase())).length}
                </span>
              ) : (
                <>9.82 <span className="stats-unit">EXAFLOP/S</span></>
              )}
            </div>
          </div>
        </section>

        <aside className="right-panel">
          <InteractionLog onEntryClick={handleEntryClick} />
        </aside>
      </main>

      <footer className="footer">
        <div className="footer-stats">
          <span>STORAGE: 84.2 TB / 100 TB</span>
          <span>TEMP: 32.4°C</span>
          <span>UPTIME: 342:12:55</span>
        </div>
        <div className="footer-systems">
          <div>
            <span className="system-dot" />
            NEURAL_CORE_01: ONLINE
          </div>
          <div>
            <span className="system-dot" />
            NEURAL_CORE_02: ONLINE
          </div>
        </div>
      </footer>

      {/* Node Detail Modal */}
      {detailNode && (
        <NodeDetailPanel 
          node={{
            ...detailNode,
            timestamp: detailNode.timestamp || new Date().toISOString(),
            description: detailNode.description || 'Memory fragment data retrieved from neural cache.',
            tags: detailNode.tags || ['neural', 'memory', 'cached']
          }} 
          onClose={() => setDetailNode(null)} 
        />
      )}

      {/* Tooltip Element */}
      <div id="node-tooltip" className="tooltip-glass">
        <div className="flex items-center justify-between gap-4">
          <span id="tt-name" className="text-xs font-bold text-white">NODE_NAME</span>
          <span id="tt-type" className="text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30">TYPE</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div id="tt-priority" className="flex gap-0.5 text-yellow-500"></div>
          <span id="tt-status" className="text-[9px] text-green-400 uppercase font-bold tracking-tighter">ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

export default App;
