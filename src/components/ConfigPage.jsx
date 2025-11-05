import { useState, useEffect } from 'react'
import './ConfigPage.css'

function ConfigPage({ onBack, darkMode, onToggleDarkMode }) {
  const [availableServices, setAvailableServices] = useState([])
  const [enabledServices, setEnabledServices] = useState([])
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem('statuswall-preferences')
      let localPrefs = null
      if (stored) {
        try {
          localPrefs = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse localStorage:', e)
        }
      }

      const [servicesRes, prefsRes] = await Promise.all([
        fetch('/api/services/available'),
        fetch('/api/preferences')
      ])

      const services = await servicesRes.json()
      const serverPrefs = await prefsRes.json()

      // Use localStorage if available, otherwise fall back to server
      const prefs = localPrefs || serverPrefs

      // Sort services alphabetically by name
      const sortedServices = services.sort((a, b) => a.name.localeCompare(b.name))

      setAvailableServices(sortedServices)
      setEnabledServices(prefs.enabledServices || sortedServices.map(s => s.name))
      setRefreshInterval(prefs.refreshInterval || 5)
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
      // Save to localStorage
      const preferences = { enabledServices, refreshInterval }
      localStorage.setItem('statuswall-preferences', JSON.stringify(preferences))

      // Also save to server
      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabledServices, refreshInterval })
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
      <div className="config-actions">
        <div className="config-actions-header">
          <h2>Configure Status Services</h2>
          <p>Select which services you want to monitor on your StatusWall</p>
        </div>
        <div className="config-actions-buttons">
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

      <div className="refresh-interval-section">
        <h3>Settings</h3>
        <div className="interval-controls">
          <label htmlFor="refresh-interval">
            Refresh every:
          </label>
          <select
            id="refresh-interval"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            className="interval-select"
          >
            <option value="1">1 minute</option>
            <option value="2">2 minutes</option>
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </div>
        <div className="dark-mode-controls">
          <label>
            Theme:
          </label>
          <button onClick={onToggleDarkMode} className="theme-toggle-button">
            {darkMode ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
          </button>
        </div>
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
