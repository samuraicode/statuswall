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

function StatusCard({ status, onClick }) {
  const statusInfo = statusConfig[status.status] || statusConfig.unknown

  // Format duration
  const formatDuration = (ms) => {
    if (!ms) return null
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days}d ${hours % 24}h`
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return null
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days}d ago`

    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours > 0) return `${hours}h ago`

    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes}m ago`
  }

  return (
    <div className="status-card" onClick={onClick}>
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

        {status.history && status.history.issueDuration && (
          <div className="issue-duration">
            <span className="duration-label">Issue duration:</span>
            <span className="duration-value">{formatDuration(status.history.issueDuration)}</span>
          </div>
        )}

        {status.history && status.history.lastChange && (
          <div className="last-change">
            <span className="change-label">Last change:</span>
            <span className="change-value">{formatRelativeTime(status.history.lastChange)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatusCard
