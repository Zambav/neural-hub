import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
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
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Generate some random node positions
  const nodes = Array.from({ length: 30 }, (_, i) => {
    const phi = Math.acos(-1 + (2 * i) / 30);
    const theta = Math.sqrt(30 * Math.PI) * phi;
    const radius = 120 + Math.random() * 80;
    return {
      id: i,
      position: [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ] as [number, number, number],
      color: ['#4A90D9', '#5BC8C0', '#F5A623', '#9B59B6'][i % 4]
    };
  });

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
            <h1 className="logo-title">Neural Hub</h1>
            <span className="logo-version mono-text">VERSION 4.2.0</span>
          </div>
        </div>
        <div className="user-section">
          <div className="connection-status">
            <span className="status-label">Connection Status</span>
            <span className="status-value">
              <span className="status-dot" />
              SECURE LINK ACTIVE
            </span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="left-panel">
          <div className="glass-panel corner-bracket">
            <div className="panel-header">
              <h3>Core Metrics</h3>
              <span className="live-badge mono-text">LIVE</span>
            </div>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-header">
                  <span className="metric-label mono-text">NEURAL LOAD</span>
                  <span className="metric-value">64.2%</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-bar-fill" style={{ width: '64%' }} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="center-canvas">
          <Canvas camera={{ position: [0, 0, 350], fov: 60 }}>
            <color attach="background" args={['#050510']} />
            <ambientLight intensity={0.4} />
            <pointLight position={[100, 100, 100]} intensity={1} />
            
            {/* Center Hub Node */}
            <NeuralNode position={[0, 0, 0]} color="#00CFFF" isCenter onClick={() => setSelectedNode({ id: 'hub', title: 'OpenClaw Neural Hub' })} />
            
            {/* Other Nodes */}
            {nodes.map(node => (
              <NeuralNode 
                key={node.id} 
                position={node.position} 
                color={node.color}
                onClick={() => setSelectedNode(node)} 
              />
            ))}

            <OrbitControls enableDamping autoRotate autoRotateSpeed={0.3} />
            <EffectComposer>
              <Bloom intensity={1.2} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            </EffectComposer>
          </Canvas>

          <div className="central-stats">
            <div className="mono-text stats-label">Neural Density</div>
            <div className="stats-value">9.82 <span className="stats-unit">EXAFLOP/S</span></div>
          </div>
        </section>

        <aside className="right-panel">
          <div className="glass-panel corner-bracket">
            <div className="panel-header">
              <h3>Interaction Log</h3>
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.75rem', padding: '1rem 0' }}>
              <p style={{ marginBottom: '0.5rem' }}>14:20:01 - Node linked to core</p>
              <p style={{ marginBottom: '0.5rem' }}>14:15:20 - Data recall success</p>
              <p style={{ marginBottom: '0.5rem' }}>14:12:09 - System idle</p>
            </div>
          </div>
        </aside>
      </main>

      <footer className="footer">
        <div className="footer-stats">
          <span>STORAGE: 84.2 TB / 100 TB</span>
          <span>TEMP: 32.4°C</span>
        </div>
      </footer>

      {/* Simple Modal */}
      {selectedNode && (
        <div className="modal-overlay" onClick={() => setSelectedNode(null)}>
          <div className="modal-panel glass-panel corner-bracket" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedNode(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{selectedNode.title}</h2>
            <p style={{ color: '#00D9FF', fontFamily: 'monospace', fontSize: '0.75rem' }}>ID: {selectedNode.id}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;