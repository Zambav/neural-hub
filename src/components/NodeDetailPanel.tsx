import React from 'react';

interface NodeDetailPanelProps {
  node: {
    id: string | number;
    title?: string;
    name?: string;
    type: string;
    priority: number;
    timestamp: string;
    description: string;
    status: string;
    tags: string[];
  };
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  memory: '#4A90D9',
  project: '#00D9FF',
  task: '#5BC8C0',
  interaction: '#9B59B6',
  identity: '#00FFFF',
  folder: '#00CED1',
  file: '#008B8B',
};

const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ node, onClose }) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div id="node-modal" className="fixed right-0 top-0 bottom-0 z-[100] w-[400px] transition-transform duration-500 overflow-hidden">
      <div className="glass-panel h-full h-full p-8 relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-cyan-500/20 rounded-none bg-[#050510]/95 backdrop-blur-xl">
        <button id="close-modal" onClick={onClose} className="absolute top-4 right-4 text-cyan-500 hover:text-white transition-colors">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M18 6L6 18M6 6l12 12" />
           </svg>
        </button>
        
        <div className="flex items-center gap-4 mb-6 mt-4">
          <div className="w-16 h-16 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-cyan-400">
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                <ellipse cx="12" cy="5" rx="9" ry="3" />
             </svg>
          </div>
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-white uppercase">{node.title || node.name}</h2>
            <p className="mono-text text-cyan-600 text-[10px] tracking-widest uppercase">ID: 0x{node.id.toString().toUpperCase()}-NODE</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-500/10">
              <div className="text-[10px] text-cyan-700 mono-text uppercase mb-1">Type</div>
              <div className="text-sm text-cyan-100 font-bold" style={{ color: typeColors[node.type?.toLowerCase()] || '#00D9FF' }}>
                 {node.type?.toUpperCase()}
              </div>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-500/10">
              <div className="text-[10px] text-cyan-700 mono-text uppercase mb-1">Priority</div>
              <div className="text-sm text-yellow-500 font-bold">
                 {'★'.repeat(node.priority || 1)}
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-500/10">
            <div className="text-[10px] text-cyan-700 mono-text uppercase mb-1">Origin Timestamp</div>
            <div className="text-xs text-slate-300">
               {formatDate(node.timestamp)}
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-cyan-500/10">
            <div className="text-[10px] text-cyan-700 mono-text uppercase mb-2">Raw Fragment Data</div>
            <p className="text-xs text-slate-400 leading-relaxed italic">
               "{node.description}"
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex-1 py-3 bg-[#00D9FF] text-slate-950 font-bold rounded-lg hover:bg-cyan-400 transition-all text-xs uppercase tracking-wider">
              Decrypt Data
            </button>
            <button className="px-6 py-3 border border-cyan-500/30 text-cyan-500 rounded-lg hover:bg-cyan-500/10 transition-all text-xs uppercase tracking-wider">
              Isolate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailPanel;
