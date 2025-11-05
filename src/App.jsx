import { useState, useEffect } from 'react'
import StatusCard from './components/StatusCard'
import ConfigPage from './components/ConfigPage'
import './App.css'

function App() {
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(0)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('statuswall-darkmode')
    return saved ? JSON.parse(saved) : false
  })

  const fetchStatuses = async () => {
    try {
      setError(null)

      // Get enabled services from localStorage
      const stored = localStorage.getItem('statuswall-preferences')
      let enabledServices = null
      if (stored) {
        try {
          const prefs = JSON.parse(stored)
          enabledServices = prefs.enabledServices
        } catch (e) {
          console.error('Failed to parse localStorage:', e)
        }
      }

      // Send preferences as query param if available
      const url = enabledServices
        ? `/api/status?services=${encodeURIComponent(JSON.stringify(enabledServices))}`
        : '/api/status'

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch statuses')
      const data = await response.json()
      setStatuses(data)
      setLastUpdated(new Date())
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const loadPreferences = async () => {
    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem('statuswall-preferences')
      if (stored) {
        try {
          const localPrefs = JSON.parse(stored)
          setRefreshInterval(localPrefs.refreshInterval || 5)
          return // Use localStorage and skip server request
        } catch (e) {
          console.error('Failed to parse localStorage:', e)
        }
      }

      // Fall back to server if localStorage not available
      const response = await fetch('/api/preferences')
      if (response.ok) {
        const prefs = await response.json()
        setRefreshInterval(prefs.refreshInterval || 5)
      }
    } catch (err) {
      console.error('Failed to load preferences:', err)
    }
  }

  useEffect(() => {
    fetchStatuses()
    loadPreferences()
  }, [])

  useEffect(() => {
    localStorage.setItem('statuswall-darkmode', JSON.stringify(darkMode))
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  useEffect(() => {
    // Reset countdown when refresh interval changes
    setSecondsUntilRefresh(refreshInterval * 60)

    const interval = setInterval(fetchStatuses, refreshInterval * 60 * 1000)
    return () => clearInterval(interval)
  }, [refreshInterval])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilRefresh(prev => {
        if (prev <= 1) {
          return refreshInterval * 60 // Reset countdown
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [refreshInterval])

  const getOverallStatus = () => {
    if (loading) return 'checking'
    if (error) return 'error'

    const hasIssues = statuses.some(s =>
      s.status !== 'none' && s.status !== 'operational'
    )
    return hasIssues ? 'issues' : 'operational'
  }

  const handleConfigClose = () => {
    setShowConfig(false)
    fetchStatuses() // Refresh statuses after config changes
    loadPreferences() // Reload refresh interval
  }

  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return `${mins}m ${secs}s`
    }
    return `${secs}s`
  }

  if (showConfig) {
    return (
      <div className="app">
        <main className="main">
          <ConfigPage onBack={handleConfigClose} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1>StatusWall</h1>
          <div className="header-info">
            <div className={`overall-status ${getOverallStatus()}`}>
              {getOverallStatus() === 'operational' && '✓ All Systems Operational'}
              {getOverallStatus() === 'issues' && '⚠ Some Systems Experiencing Issues'}
              {getOverallStatus() === 'checking' && '⟳ Checking...'}
              {getOverallStatus() === 'error' && '✗ Error Loading Statuses'}
            </div>
            {lastUpdated && (
              <div className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
          <div className="header-buttons">
            <button onClick={toggleDarkMode} className="dark-mode-button" title={darkMode ? 'Light mode' : 'Dark mode'}>
              {darkMode ? '☀' : '🌙'}
            </button>
            <button onClick={() => setShowConfig(true)} className="config-button">
              ⚙ Configure
            </button>
          </div>
        </div>
      </header>

      {secondsUntilRefresh > 0 && (
        <div className="countdown-bar">
          <div className="countdown-content">
            <span className="countdown-text">
              Next refresh in {formatCountdown(secondsUntilRefresh)}
            </span>
            <div className="countdown-progress">
              <div
                className="countdown-progress-fill"
                style={{
                  width: `${(secondsUntilRefresh / (refreshInterval * 60)) * 100}%`
                }}
              />
            </div>
            <button
              onClick={fetchStatuses}
              className="refresh-icon-button"
              title="Refresh now"
            >
              ⟳
            </button>
          </div>
        </div>
      )}

      <main className="main">
        {error && (
          <div className="error-banner">
            Error: {error}
            <button onClick={fetchStatuses} className="retry-button">
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading statuses...</div>
        ) : statuses.length === 0 ? (
          <div className="no-services">
            <p>No services configured.</p>
            <button onClick={() => setShowConfig(true)} className="config-button">
              Configure Services
            </button>
          </div>
        ) : (
          <div className="status-grid">
            {statuses.map((status, index) => (
              <StatusCard key={index} status={status} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Auto-refreshes every {refreshInterval} {refreshInterval === 1 ? 'minute' : 'minutes'}</p>
      </footer>
    </div>
  )
}

export default App
