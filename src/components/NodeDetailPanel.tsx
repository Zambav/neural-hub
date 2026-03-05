import type { HubNode } from '../types';

interface NodeDetailPanelProps {
  node: HubNode;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  memory: '#4A90D9',
  project: '#5BC8C0',
  task: '#F5A623',
  interaction: '#9B59B6',
};

const statusColors: Record<string, string> = {
  active: '#00FF88',
  pending: '#F5A623',
  completed: '#94A3B8',
  archived: '#475569',
};

function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel glass-panel corner-bracket" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-icon" style={{ borderColor: typeColors[node.type] }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <div>
            <h2 className="modal-title">{node.title}</h2>
            <p className="modal-id mono-text">ID: {node.id.toUpperCase()}</p>
          </div>
        </div>

        <div className="modal-body">
          {/* Type and Status */}
          <div className="modal-badges">
            <span className="badge type-badge" style={{ 
              backgroundColor: `${typeColors[node.type]}20`,
              borderColor: typeColors[node.type],
              color: typeColors[node.type]
            }}>
              {node.type.toUpperCase()}
            </span>
            <span className="badge status-badge" style={{
              backgroundColor: `${statusColors[node.status]}20`,
              borderColor: statusColors[node.status],
              color: statusColors[node.status]
            }}>
              {node.status.toUpperCase()}
            </span>
          </div>

          {/* Description */}
          <div className="modal-section">
            <div className="section-label mono-text">Timestamp</div>
            <div className="section-value">{formatDate(node.timestamp)}</div>
          </div>

          <div className="modal-section">
            <div className="section-label mono-text">Description</div>
            <p className="section-description">{node.description}</p>
          </div>

          {/* Tags */}
          <div className="modal-section">
            <div className="section-label mono-text">Tags</div>
            <div className="tags-list">
              {node.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="modal-section">
            <div className="section-label mono-text">Priority</div>
            <div className="priority-stars">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={`star ${i <= node.priority ? 'filled' : ''}`}>★</span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button className="action-btn primary">DECRYPT DATA</button>
            <button className="action-btn secondary">ISOLATE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NodeDetailPanel;
