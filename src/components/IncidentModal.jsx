import './IncidentModal.css'

function IncidentModal({ service, onClose }) {
  if (!service) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const statusMap = {
      'operational': '#10b981',
      'degraded_performance': '#f59e0b',
      'partial_outage': '#f59e0b',
      'major_outage': '#ef4444',
      'under_maintenance': '#3b82f6',
      'none': '#10b981'
    }
    return statusMap[status] || '#6b7280'
  }

  const getStatusLabel = (status) => {
    const labelMap = {
      'operational': 'Operational',
      'degraded_performance': 'Degraded',
      'partial_outage': 'Partial Outage',
      'major_outage': 'Major Outage',
      'under_maintenance': 'Maintenance',
      'none': 'Operational'
    }
    return labelMap[status] || status
  }

  const hasIssues = service.status !== 'none' && service.status !== 'operational'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{service.name}</h2>
            <div className="modal-status">
              <span
                className="status-dot"
                style={{ backgroundColor: getStatusColor(service.status) }}
              />
              <span className="status-label">{service.description}</span>
            </div>
          </div>
          <button onClick={onClose} className="modal-close" title="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Current Status Section */}
          <section className="modal-section">
            <h3>Current Status</h3>
            <div className="status-badge" style={{ borderColor: getStatusColor(service.status) }}>
              <span style={{ color: getStatusColor(service.status) }}>
                {getStatusLabel(service.status)}
              </span>
            </div>
            {service.lastUpdated && (
              <p className="last-updated-text">
                Last updated: {formatDate(service.lastUpdated)}
              </p>
            )}
          </section>

          {/* Components Section */}
          {service.components && service.components.length > 0 && (
            <section className="modal-section">
              <h3>Components ({service.components.length})</h3>
              <div className="components-list">
                {service.components.map((component, index) => (
                  <div key={index} className="component-item">
                    <span
                      className="component-dot"
                      style={{ backgroundColor: getStatusColor(component.status) }}
                    />
                    <span className="component-name">{component.name}</span>
                    <span
                      className="component-status"
                      style={{ color: getStatusColor(component.status) }}
                    >
                      {getStatusLabel(component.status)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Historical Changes Section */}
          {service.history && service.history.recentChanges && service.history.recentChanges.length > 0 && (
            <section className="modal-section">
              <h3>Recent Status Changes</h3>
              <div className="timeline">
                {service.history.recentChanges.map((change, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-from">{change.from}</span>
                        <span className="timeline-arrow">→</span>
                        <span className="timeline-to">{change.to}</span>
                      </div>
                      <div className="timeline-time">{formatDate(change.timestamp)}</div>
                      {change.description && (
                        <div className="timeline-description">{change.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Issue Duration */}
          {service.history && service.history.issueDuration && (
            <section className="modal-section">
              <h3>Issue Duration</h3>
              <div className="duration-badge">
                Ongoing for {formatDuration(service.history.issueDuration)}
              </div>
            </section>
          )}

          {/* Links Section */}
          <section className="modal-section">
            <h3>Links</h3>
            <div className="links-section">
              {service.url && (
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="status-link"
                >
                  View Full Status Page →
                </a>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function formatDuration(ms) {
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

export default IncidentModal
