import { useState, useEffect } from 'react'
import './ConfigPage.css'

function ConfigPage({ onBack }) {
  const [availableServices, setAvailableServices] = useState([])
  const [enabledServices, setEnabledServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const [servicesRes, prefsRes] = await Promise.all([
        fetch('/api/services/available'),
        fetch('/api/preferences')
      ])

      const services = await servicesRes.json()
      const prefs = await prefsRes.json()

      setAvailableServices(services)
      setEnabledServices(prefs.enabledServices)
      setLoading(false)
    } catch (error) {
      console.error('Failed to load configuration:', error)
      setLoading(false)
    }
  }

  const handleToggle = (serviceName) => {
    setEnabledServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabledServices })
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' })
        setTimeout(() => {
          if (onBack) onBack()
        }, 1000)
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  const handleSelectAll = () => {
    setEnabledServices(availableServices.map(s => s.name))
  }

  const handleDeselectAll = () => {
    setEnabledServices([])
  }

  if (loading) {
    return (
      <div className="config-page">
        <div className="loading">Loading configuration...</div>
      </div>
    )
  }

  return (
    <div className="config-page">
      <div className="config-header">
        <h2>Configure Status Services</h2>
        <p className="config-subtitle">
          Select which services you want to monitor on your StatusWall
        </p>
      </div>

      <div className="config-actions">
        <button onClick={handleSelectAll} className="btn-secondary">
          Select All
        </button>
        <button onClick={handleDeselectAll} className="btn-secondary">
          Deselect All
        </button>
        <span className="service-count">
          {enabledServices.length} of {availableServices.length} selected
        </span>
      </div>

      <div className="services-list">
        {availableServices.map(service => (
          <label key={service.name} className="service-item">
            <input
              type="checkbox"
              checked={enabledServices.includes(service.name)}
              onChange={() => handleToggle(service.name)}
            />
            <span className="service-name">{service.name}</span>
            <span className="service-type">{service.type}</span>
          </label>
        ))}
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="config-footer">
        <button onClick={onBack} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving || enabledServices.length === 0}
          className="btn-primary"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

export default ConfigPage
