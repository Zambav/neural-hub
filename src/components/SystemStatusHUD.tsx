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
    
    // Refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const skills = getDefaultSkills();

  if (loading) {
    return (
      <div className="glass-panel corner-bracket">
        <div className="panel-header">
          <h3>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="panel-icon">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            CORE METRICS
          </h3>
          <span className="live-badge mono-text">LOADING...</span>
        </div>
        <div className="flex items-center justify-center h-32">
          <span className="text-cyan-400 mono-text">FETCHING OCP STATUS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel corner-bracket">
      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button 
          className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          METRICS
        </button>
        <button 
          className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          SKILLS & AGENTS
        </button>
      </div>

      {activeTab === 'metrics' && status && (
        <>
          <div className="panel-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="panel-icon">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              OPENCLOW STATUS
            </h3>
            <span className="live-badge mono-text">LIVE</span>
          </div>

          <div className="metrics-grid">
            {/* Neural Load - Token Usage */}
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-label mono-text">TOKEN USAGE</span>
                <span className="metric-value">{status.tokenPercent}%</span>
              </div>
              <div className="metric-bar">
                <div 
                  className="metric-bar-fill" 
                  style={{ 
                    width: `${status.tokenPercent}%`,
                    background: status.tokenPercent > 80 ? '#ff4444' : undefined
                  }} 
                />
              </div>
            </div>

            {/* Throughput - Token rate and cost per min */}
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-label mono-text">THROUGHPUT</span>
                <span className="metric-value">79.9K tok/min</span>
              </div>
              <div className="metric-bar">
                <div className="metric-bar-fill" style={{ width: '80%' }} />
              </div>
              <div className="metric-subtext mono-text">$0.0096 / min</div>
            </div>

            {/* Avg Cost / Msg */}
            <div className="metric-item">
              <div className="metric-header">
                <span className="metric-label mono-text">AVG COST / MSG</span>
                <span className="metric-value">$0.0027</span>
              </div>
              <div className="metric-bar">
                <div className="metric-bar-fill" style={{ width: '27%' }} />
              </div>
              <div className="metric-subtext mono-text">$0.23 total</div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label mono-text">Sessions</div>
                <div className="stat-value">{status.sessions}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label mono-text">Latency</div>
                <div className="stat-value">{status.gatewayLatency}ms</div>
              </div>
            </div>

            {/* OS Info */}
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-label mono-text">OS</div>
                <div className="stat-value text-xs">{status.os.split(' ')[0]}</div>
              </div>
              <div className="stat-box">
                <div className="stat-label mono-text">Node</div>
                <div className="stat-value text-xs">v{status.nodeVersion}</div>
              </div>
            </div>
          </div>

          {/* Channels */}
          <div className="filters-section">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="panel-icon">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              CHANNELS
            </h3>
            <div className="filter-tags">
              <span className={`filter-tag ${status.channels.whatsapp ? 'active' : ''}`}>
                WHATSAPP {status.channels.whatsapp ? '●' : '○'}
              </span>
              <span className={`filter-tag ${status.channels.discord ? 'active' : ''}`}>
                DISCORD {status.channels.discord ? '●' : '○'}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className="status-message">
            <span className="pulse-dot" />
            <p className="mono-text">GATEWAY REACHABLE</p>
          </div>
        </>
      )}

      {activeTab === 'skills' && status && (
        <>
          <div className="panel-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="panel-icon">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              SKILLS & AGENTS
            </h3>
          </div>

          {/* Agents */}
          <div className="skills-section">
            <h4 className="mono-text text-xs text-cyan-400 mb-2">AGENTS ({status.agents.length})</h4>
            <div className="skills-list">
              {status.agents.map(agent => (
                <div key={agent.name} className="skill-item agent-item">
                  <span className="skill-name">{agent.name}</span>
                  <span className="skill-badge">{agent.sessions} session{agent.sessions !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="skills-section">
            <h4 className="mono-text text-xs text-cyan-400 mb-2">SKILLS ({skills.length})</h4>
            <div className="skills-list">
              {skills.map(skill => (
                <div key={skill.name} className={`skill-item ${skill.location === 'workspace' ? 'workspace-skill' : ''}`}>
                  <span className="skill-name">{skill.name}</span>
                  <span className={`skill-badge ${skill.location === 'workspace' ? 'badge-workspace' : 'badge-global'}`}>
                    {skill.location === 'workspace' ? 'WS' : 'GLB'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SystemStatusHUD;