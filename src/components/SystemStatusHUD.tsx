import { useState, useEffect } from 'react';
import { fetchOpenClawStatus, getDefaultSkills, type OpenClawStatus } from '../data/openClawData';

function SystemStatusHUD() {
  const [status, setStatus] = useState<OpenClawStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'metrics' | 'skills'>('metrics');

  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await fetchOpenClawStatus();
        setStatus(data);
      } catch (err) {
        console.error('Failed to load OpenClaw status:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const skills = getDefaultSkills();

  return (
    <div className="glass-panel corner-bracket rounded-xl p-5 flex flex-col gap-4 overflow-hidden h-full shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="tab-switcher mb-4">
        <button 
          className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          CORE METRICS
        </button>
        <button 
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          AGENTS & SKILLS
        </button>
      </div>

      {activeTab === 'metrics' && (
        <div className="flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-3">
            <h3 className="text-xs font-bold text-[#00D9FF] tracking-wider flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                 <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              SYSTEM STATUS
            </h3>
            <span className="mono-text text-[10px] text-cyan-700 uppercase">Live</span>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col gap-4">
                 <div className="animate-pulse h-12 bg-slate-900/60 rounded-lg"></div>
                 <div className="animate-pulse h-12 bg-slate-900/60 rounded-lg"></div>
              </div>
            ) : status && (
              <>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] mono-text">
                    <span className="text-slate-400">NEURAL LOAD</span>
                    <span className="text-[#00D9FF]">{status.tokenPercent}%</span>
                  </div>
                  <div className="w-full h-1 bg-cyan-950 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00D9FF] shadow-[0_0_8px_rgba(0,217,255,0.8)]" style={{ width: `${status.tokenPercent}%` }}></div>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] mono-text">
                    <span className="text-slate-400">MEMORY CAPACITY</span>
                    <span className="text-cyan-400">1.2 PB</span>
                  </div>
                  <div className="w-full h-1 bg-cyan-950 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00D9FF] shadow-[0_0_8px_rgba(0,217,255,0.8)]" style={{ width: '82%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900/40 p-3 rounded-lg border border-cyan-500/5">
                    <div className="text-[10px] text-cyan-700 mono-text uppercase">Active Locus</div>
                    <div className="text-xl font-bold text-cyan-100">{status.sessions}</div>
                  </div>
                  <div className="bg-slate-900/40 p-3 rounded-lg border border-cyan-500/5">
                    <div className="text-[10px] text-cyan-700 mono-text uppercase">Sync Delay</div>
                    <div className="text-xl font-bold text-cyan-100">{status.gatewayLatency}ms</div>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-3 rounded-lg border border-cyan-500/10 mt-2">
                  <div className="text-[9px] text-cyan-700 mono-text uppercase mb-1">Gateway Auth Profile</div>
                  <div className="text-[10px] text-cyan-300 font-medium">OPENROUTER_DEFAULT_ACTIVE</div>
                </div>

                <div className="flex items-center gap-2 pt-2 opacity-60">
                   <div className="w-1.5 h-1.5 bg-[#00FF88] rounded-full animate-pulse"></div>
                   <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Secure Core Link Stable</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="flex flex-col gap-4 overflow-hidden h-full">
            <h4 className="text-[10px] font-bold text-[#00D9FF] tracking-wider uppercase border-b border-cyan-500/10 pb-2">Loaded Subsystems</h4>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
               {skills.map(skill => (
                  <div key={skill.name} className="bg-slate-900/60 p-3 rounded-lg border border-cyan-500/10 flex justify-between items-center group hover:border-[#00D9FF]/30 transition-colors">
                     <span className="text-[11px] text-cyan-100 font-medium uppercase">{skill.name}</span>
                     <span className="text-[8px] bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-1.5 py-0.5 rounded mono-text">OK</span>
                  </div>
               ))}
            </div>
        </div>
      )}
    </div>
  );
}

export default SystemStatusHUD;
