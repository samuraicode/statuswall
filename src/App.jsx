import { useState, useEffect } from 'react'
import StatusCard from './components/StatusCard'
import './App.css'

function App() {
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  const fetchStatuses = async () => {
    try {
      setError(null)
      const response = await fetch('/api/status')
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

  useEffect(() => {
    fetchStatuses()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStatuses, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getOverallStatus = () => {
    if (loading) return 'checking'
    if (error) return 'error'

    const hasIssues = statuses.some(s =>
      s.status !== 'none' && s.status !== 'operational'
    )
    return hasIssues ? 'issues' : 'operational'
  }

  return (
    <div className="app">
      <header className="header">
        <h1>StatusWall</h1>
        <p className="subtitle">Monitor all your dependencies in one place</p>
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
      </header>

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
        ) : (
          <div className="status-grid">
            {statuses.map((status, index) => (
              <StatusCard key={index} status={status} />
            ))}
          </div>
        )}

        <button onClick={fetchStatuses} className="refresh-button">
          Refresh Now
        </button>
      </main>

      <footer className="footer">
        <p>Auto-refreshes every 5 minutes</p>
      </footer>
    </div>
  )
}

export default App
