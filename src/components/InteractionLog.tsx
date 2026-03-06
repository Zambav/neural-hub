import { mockInteractions } from '../data/mockInteractions';

interface InteractionLogProps {
  onEntryClick: (nodeId: string) => void;
}

function InteractionLog({ onEntryClick }: InteractionLogProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const getEventTypeColor = (summary: string) => {
    if (summary.includes('OVERRIDE')) return 'bg-yellow-500';
    return 'bg-cyan-500';
  };

  return (
    <div className="glass-panel corner-bracket rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3 mb-4 shrink-0">
        <h3 className="text-xs font-bold text-cyan-400 tracking-wider flex items-center gap-2 uppercase">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          Interaction Log
        </h3>
      </div>
      
      <div id="log-container" className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[300px]">
        {mockInteractions.slice(0, 12).map((entry) => (
          <div 
            key={entry.id} 
            className="flex gap-3 group cursor-pointer hover:bg-cyan-500/5 p-1.5 rounded transition-colors"
            onClick={() => onEntryClick(entry.linkedNodeId)}
          >
            <div className="flex-none mt-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(entry.summary)} shadow-[0_0_5px_rgba(0,217,255,0.5)]`}></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="mono-text text-[9px] text-cyan-700 font-medium">{formatTime(entry.timestamp)}</span>
                <span className={`text-[10px] font-bold ${entry.summary.includes('OVERRIDE') ? 'text-yellow-500' : 'text-cyan-400'} tracking-tight uppercase`}>
                  {entry.summary.split(' ')[0]}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-tight group-hover:text-slate-200 transition-colors">{entry.summary}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-cyan-500/10">
        <h3 className="text-[10px] font-bold text-cyan-500/60 tracking-widest uppercase mb-3 flex items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
            <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
          </svg>
          ACTIVE FILTERS
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] mono-text text-cyan-400">EPISODIC</span>
          <span className="px-2 py-1 bg-cyan-500/5 border border-cyan-500/10 rounded text-[9px] mono-text text-slate-600">SEMANTIC</span>
          <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-[9px] mono-text text-cyan-300 shadow-[0_0_8px_rgba(0,217,255,0.2)]">ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
}

export default InteractionLog;
