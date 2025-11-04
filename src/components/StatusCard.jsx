import './StatusCard.css'

const statusConfig = {
  none: { label: 'Operational', color: '#10b981', icon: '✓' },
  operational: { label: 'Operational', color: '#10b981', icon: '✓' },
  minor: { label: 'Minor Issues', color: '#f59e0b', icon: '⚠' },
  major: { label: 'Major Outage', color: '#ef4444', icon: '✗' },
  critical: { label: 'Critical', color: '#dc2626', icon: '✗' },
  maintenance: { label: 'Maintenance', color: '#3b82f6', icon: 'ℹ' },
  unknown: { label: 'Unknown', color: '#6b7280', icon: '?' }
}

function StatusCard({ status }) {
  const statusInfo = statusConfig[status.status] || statusConfig.unknown

  return (
    <div className="status-card">
      <div className="card-header">
        <h3 className="service-name">{status.name}</h3>
        <div
          className="status-indicator"
          style={{ backgroundColor: statusInfo.color }}
          title={statusInfo.label}
        >
          <span className="status-icon">{statusInfo.icon}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="status-label" style={{ color: statusInfo.color }}>
          {statusInfo.label}
        </div>

        {status.description && (
          <p className="status-description">{status.description}</p>
        )}

        {status.components && status.components.length > 0 && (
          <div className="components">
            <h4>Key Components:</h4>
            <ul>
              {status.components.map((comp, idx) => (
                <li key={idx}>
                  <span className="component-name">{comp.name}</span>
                  <span className={`component-status ${comp.status}`}>
                    {comp.status.replace(/_/g, ' ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {status.url && (
        <div className="card-footer">
          <a
            href={status.url}
            target="_blank"
            rel="noopener noreferrer"
            className="status-link"
          >
            View Full Status Page →
          </a>
        </div>
      )}
    </div>
  )
}

export default StatusCard
