import { mockNodes } from '../data/mockNodes';

function SystemStatusHUD() {
  const activeNodes = mockNodes.filter(n => n.status === 'active').length;
  
  return (
    <div className="glass-panel corner-bracket">
      <div className="panel-header">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="panel-icon">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          CORE METRICS
        </h3>
        <span className="live-badge mono-text">LIVE</span>
      </div>

      <div className="metrics-grid">
        {/* Neural Load */}
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-label mono-text">NEURAL LOAD</span>
            <span className="metric-value">64.2%</span>
          </div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{ width: '64%' }} />
          </div>
        </div>

        {/* Memory Capacity */}
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-label mono-text">MEMORY CAPACITY</span>
            <span className="metric-value">1.2 PB</span>
          </div>
          <div className="metric-bar">
            <div className="metric-bar-fill" style={{ width: '82%' }} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-label mono-text">Active Nodes</div>
            <div className="stat-value">{activeNodes}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label mono-text">Sync Delay</div>
            <div className="stat-value">0.4ms</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="panel-icon">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          ACTIVE FILTERS
        </h3>
        <div className="filter-tags">
          <span className="filter-tag active">EPISODIC</span>
          <span className="filter-tag">SEMANTIC</span>
          <span className="filter-tag">RECALL</span>
          <span className="filter-tag active">ENCRYPTED</span>
        </div>
      </div>

      {/* Status Message */}
      <div className="status-message">
        <span className="pulse-dot" />
        <p className="mono-text">SYSTEM OPTIMIZATION IN PROGRESS...</p>
      </div>
    </div>
  );
}

export default SystemStatusHUD;
