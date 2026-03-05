import { mockInteractions } from '../data/mockInteractions';

interface InteractionLogProps {
  onEntryClick: (nodeId: string) => void;
}

function InteractionLog({ onEntryClick }: InteractionLogProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const getEventType = (summary: string) => {
    if (summary.includes('SYNAPSE') || summary.includes('linked')) return 'cyan';
    if (summary.includes('OVERRIDE') || summary.includes('detected')) return 'yellow';
    if (summary.includes('RECALL') || summary.includes('Query')) return 'cyan';
    return 'slate';
  };

  return (
    <div className="glass-panel corner-bracket log-panel">
      <div className="panel-header">
        <h3>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="panel-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          INTERACTION LOG
        </h3>
        <button className="more-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      <div className="log-container">
        {mockInteractions.slice(0, 10).map((entry) => (
          <div 
            key={entry.id} 
            className="log-entry"
            onClick={() => onEntryClick(entry.linkedNodeId)}
          >
            <div className="log-dot-container">
              <div className={`log-dot ${getEventType(entry.summary)}`} />
            </div>
            <div className="log-content">
              <div className="log-header">
                <span className="log-time mono-text">{formatTime(entry.timestamp)}</span>
                <span className={`log-type ${getEventType(entry.summary)}`}>
                  {entry.summary.split(' ').slice(0, 2).join('_')}
                </span>
              </div>
              <p className="log-summary">{entry.summary}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="log-footer">
        <button className="export-btn">Export Stream</button>
      </div>
    </div>
  );
}

export default InteractionLog;
