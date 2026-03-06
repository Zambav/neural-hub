import { useState, useEffect, useCallback } from 'react';
import NeuralGraph from './components/NeuralGraph';
import SystemStatusHUD from './components/SystemStatusHUD';
import InteractionLog from './components/InteractionLog';
import NodeDetailPanel from './components/NodeDetailPanel';
import SearchBar from './components/SearchBar';
import neuralData from './data/neural-data.json';
import { mockNodes } from './data/mockNodes';
import './App.css';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

interface NeuralHubNode {
  id: string | number;
  title?: string;
  name?: string;
  type: string;
  priority: number;
  status: string;
  timestamp: string;
  description: string;
  tags: string[];
}

const nodesData: NeuralHubNode[] = (neuralData && Array.isArray(neuralData.nodes) && neuralData.nodes.length > 0) 
  ? (neuralData.nodes as NeuralHubNode[]) 
  : (mockNodes as unknown as NeuralHubNode[]);

const linksData = (neuralData && Array.isArray(neuralData.links)) ? neuralData.links : [];

function App() {
  const [selectedNode, setSelectedNode] = useState<NeuralHubNode | null>(null); 
  const [detailNode, setDetailNode] = useState<NeuralHubNode | null>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  const handleSelectNode = useCallback((node: NeuralHubNode | null) => {
    setSelectedNode(node);
    setDetailNode(node);
  }, []);

  const handleNodeClick = useCallback((node: NeuralHubNode) => {
    setDetailNode(node);
    setSelectedNode(node);
  }, []);

  const handleEntryClick = useCallback((nodeId: string | number) => {
    const node = nodesData.find((n: NeuralHubNode) => String(n.id) === String(nodeId));
    if (node) {
      setSelectedNode(node);
      setDetailNode(node);
    }
  }, []);

  return (
    <div className="app-container relative h-screen w-full flex flex-col overflow-hidden" style={{ background: 'radial-gradient(circle at center, #050a1f 0%, #050510 100%)' }}>
      <div className="scanline fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 z-50" />
      
      <div className="background-effects fixed inset-0 pointer-events-none overflow-hidden z-0">
         <div className="grid-pattern absolute inset-0 opacity-10 w-full h-full" />
      </div>

      <header className="relative z-40 w-full px-8 py-6 flex items-center justify-center shrink-0" style={{ marginTop: '3rem' }}>
        <div className="absolute left-8 flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/40 rounded-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-cyan-400">
               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-widest text-[#00D9FF] uppercase leading-none">Neural Hub</h1>
            <span className="mono-text text-[10px] text-cyan-700 tracking-[0.2em]">VERSION 4.2.0-STARK</span>
          </div>
        </div>

        <SearchBar query={searchQuery} onChange={setSearchQuery} />

        <div className="absolute right-8 flex items-center gap-6">
          <div className="text-right hidden md:block">
            <div className="mono-text text-[10px] text-cyan-700 uppercase">Connection Status</div>
            <div className="text-xs text-[#00FF88] font-medium flex items-center justify-end gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-pulse"></span>
              SECURE LINK ACTIVE
            </div>
          </div>
          <button className="w-10 h-10 rounded-full border border-cyan-500/30 overflow-hidden hover:border-[#00D9FF] transition-colors shadow-[0_0_10px_rgba(0,217,255,0.2)]">
            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=stark&backgroundColor=00d9ff" alt="User" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <main className="relative flex-1 flex w-full h-full overflow-hidden px-8">
        <aside className="left-panel shrink-0">
           <SystemStatusHUD />
        </aside>

        <section className="flex-1 relative flex items-center justify-center">
          <div id="neural-container" className="absolute inset-0 z-10">
            <NeuralGraph 
              nodes={nodesData} 
              links={linksData} 
              onNodeClick={handleNodeClick} 
              searchQuery={debouncedSearchQuery} 
              selectedNode={selectedNode} 
              onSelectNode={handleSelectNode} 
            />
          </div>

          <div className="absolute pointer-events-none z-20 flex flex-col items-center gap-2 transform translate-y-36">
            <div className="mono-text text-[10px] text-cyan-600 tracking-[0.4em] uppercase">Neural Density</div>
            <div className="text-4xl font-bold text-cyan-50 opacity-80 mono-text">
               {searchQuery ? 
                 nodesData.filter((n: NeuralHubNode) => (n.title || n.name || n.id).toString().toUpperCase().includes(searchQuery.toUpperCase())).length : 
                 nodesData.length
               } 
               <span className="text-sm text-cyan-600"> NODES</span>
            </div>
          </div>
        </section>

        <aside className="right-panel shrink-0">
          <InteractionLog onEntryClick={handleEntryClick} />
        </aside>
      </main>

      <footer className="relative z-40 w-full px-8 py-3 bg-slate-950/80 border-t border-cyan-500/20 flex items-center justify-between text-[10px] mono-text text-cyan-800 shrink-0">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <span className="text-cyan-500 uppercase">Storage:</span>
            <span className="text-cyan-200">84.2 TB / 100 TB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-50 uppercase">Temp:</span>
            <span className="text-cyan-200">32.4°C</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {selectedNode && (
                <div className="text-xs font-normal text-cyan-600 tracking-normal hidden md:inline animate-pulse">
                  NODE_ACTIVE: {(selectedNode.title || selectedNode.name || selectedNode.id).toString().toUpperCase()}
                </div>
            )}
           <div className="flex items-center gap-2 ml-4">
             <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(0,217,255,0.8)]"></div>
             <span className="text-cyan-500 uppercase">Core_Link: Active</span>
           </div>
        </div>
      </footer>

      <div id="node-tooltip" className="tooltip-glass fixed opacity-0 scale-95 p-3 rounded-lg flex flex-col gap-1 z-[100] pointer-events-none transition-all duration-200">
        <div className="flex items-center justify-between gap-4">
          <span id="tt-name" className="text-xs font-bold text-white uppercase font-['General Sans']">NODE_NAME</span>
          <span id="tt-type" className="text-[9px] px-1.5 py-0.5 bg-cyan-500/20 text-[#00D9FF] rounded border border-cyan-500/30">TYPE</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div id="tt-priority" className="flex gap-0.5 text-yellow-500"></div>
          <span id="tt-status" className="text-[9px] text-[#00FF88] uppercase font-bold tracking-tighter">ACTIVE</span>
        </div>
      </div>

      {detailNode && (
        <NodeDetailPanel 
          node={{
            ...detailNode,
            title: detailNode.title || detailNode.name || detailNode.id,
            timestamp: detailNode.timestamp || new Date().toISOString(),
            description: detailNode.description || 'Neural memory fragment retrieved from the OpenClaw data stream.',
            tags: detailNode.tags || ['neural', 'memory', 'active']
          }} 
          onClose={() => {
            setDetailNode(null);
            setSelectedNode(null);
          }} 
        />
      )}
    </div>
  );
}

export default App;
