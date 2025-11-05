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
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyIssues, setShowOnlyIssues] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')

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

  // Filter statuses based on search and filters
  const filteredStatuses = statuses.filter(status => {
    // Search filter
    if (searchQuery && !status.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Show only issues filter
    if (showOnlyIssues && (status.status === 'none' || status.status === 'operational')) {
      return false
    }

    // Status type filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'operational' && status.status !== 'none' && status.status !== 'operational') {
        return false
      }
      if (statusFilter === 'issues' && (status.status === 'none' || status.status === 'operational')) {
        return false
      }
      if (statusFilter === 'minor' && status.status !== 'minor') {
        return false
      }
      if (statusFilter === 'major' && status.status !== 'major') {
        return false
      }
      if (statusFilter === 'critical' && status.status !== 'critical') {
        return false
      }
      if (statusFilter === 'maintenance' && status.status !== 'maintenance') {
        return false
      }
    }

    return true
  })

  // Calculate counts
  const issueCount = statuses.filter(s => s.status !== 'none' && s.status !== 'operational').length
  const operationalCount = statuses.filter(s => s.status === 'none' || s.status === 'operational').length

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

      {!loading && statuses.length > 0 && (
        <div className="filter-bar">
          <div className="filter-content">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="clear-search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <label className="filter-toggle">
              <input
                type="checkbox"
                checked={showOnlyIssues}
                onChange={(e) => setShowOnlyIssues(e.target.checked)}
              />
              <span>Issues only</span>
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter-select"
            >
              <option value="all">All statuses</option>
              <option value="operational">Operational</option>
              <option value="issues">Any issues</option>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <div className="service-count-badge">
              {issueCount > 0 ? (
                <span className="count-issues">{issueCount} issue{issueCount !== 1 ? 's' : ''}</span>
              ) : (
                <span className="count-ok">All OK</span>
              )}
              <span className="count-divider">•</span>
              <span className="count-total">{filteredStatuses.length}/{statuses.length}</span>
            </div>
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
        ) : filteredStatuses.length === 0 ? (
          <div className="no-results">
            <p>No services match your filters.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setShowOnlyIssues(false)
                setStatusFilter('all')
              }}
              className="config-button"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="status-grid">
            {filteredStatuses.map((status, index) => (
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
