import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { statusPages } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for user preferences (in production, use a database)
let userPreferences = {
  enabledServices: statusPages.map(p => p.name), // All enabled by default
  refreshInterval: 5 // Default refresh interval in minutes
};

// History storage file path
const HISTORY_FILE = path.join(__dirname, 'status-history.json');

// Load or initialize history
let statusHistory = {};
try {
  if (fs.existsSync(HISTORY_FILE)) {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    statusHistory = JSON.parse(data);
  }
} catch (error) {
  console.error('Failed to load history:', error.message);
  statusHistory = {};
}

// Save history to file
function saveHistory() {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(statusHistory, null, 2));
  } catch (error) {
    console.error('Failed to save history:', error.message);
  }
}

// Track status change
function trackStatusChange(serviceName, status, description) {
  if (!statusHistory[serviceName]) {
    statusHistory[serviceName] = {
      currentStatus: status,
      lastChange: new Date().toISOString(),
      changes: []
    };
  }

  const history = statusHistory[serviceName];
  const now = new Date().toISOString();

  // If status changed, record it
  if (history.currentStatus !== status) {
    history.changes.unshift({
      from: history.currentStatus,
      to: status,
      timestamp: now,
      description: description
    });

    // Keep only last 50 changes
    if (history.changes.length > 50) {
      history.changes = history.changes.slice(0, 50);
    }

    history.currentStatus = status;
    history.lastChange = now;
    saveHistory();
  }
}

// Get issue duration in milliseconds
function getIssueDuration(serviceName) {
  const history = statusHistory[serviceName];
  if (!history) return null;

  const isIssue = ['major', 'minor', 'critical', 'maintenance'].includes(history.currentStatus);
  if (!isIssue) return null;

  // Find when the issue started (last transition to non-operational)
  const lastChange = history.changes.find(c =>
    !['major', 'minor', 'critical', 'maintenance'].includes(c.from)
  );

  if (lastChange) {
    return Date.now() - new Date(lastChange.timestamp).getTime();
  }

  // If no change found, use lastChange timestamp
  return Date.now() - new Date(history.lastChange).getTime();
}

// Parse Atlassian Statuspage format
async function fetchAtlassianStatus(config) {
  try {
    const response = await fetch(config.url);
    const data = await response.json();

    const status = data.status.indicator;
    const description = data.status.description;

    // Track status change
    trackStatusChange(config.name, status, description);

    return {
      name: config.name,
      status: status,
      description: description,
      lastUpdated: data.page.updated_at,
      url: data.page.url,
      components: data.components?.slice(0, 5).map(c => ({
        name: c.name,
        status: c.status
      })) || []
    };
  } catch (error) {
    trackStatusChange(config.name, 'unknown', 'Failed to fetch status');
    return {
      name: config.name,
      status: 'unknown',
      description: 'Failed to fetch status',
      error: error.message
    };
  }
}

// Parse Slack status format
async function fetchSlackStatus(config) {
  try {
    const response = await fetch(config.url);
    const data = await response.json();

    // Map Slack's status to Atlassian format
    let status = 'none'; // operational
    let description = 'All Systems Operational';

    if (data.status !== 'ok') {
      status = 'major';
      description = 'Service Issues Detected';
    }

    if (data.active_incidents && data.active_incidents.length > 0) {
      status = 'major';
      description = `${data.active_incidents.length} Active Incident(s)`;
    }

    // Track status change
    trackStatusChange(config.name, status, description);

    return {
      name: config.name,
      status: status,
      description: description,
      lastUpdated: data.date_updated,
      url: 'https://status.slack.com',
      components: data.active_incidents?.slice(0, 5).map(i => ({
        name: i.title || 'Incident',
        status: 'major_outage'
      })) || []
    };
  } catch (error) {
    trackStatusChange(config.name, 'unknown', 'Failed to fetch status');
    return {
      name: config.name,
      status: 'unknown',
      description: 'Failed to fetch status',
      error: error.message
    };
  }
}

// Parse Heroku status format
async function fetchHerokuStatus(config) {
  try {
    const response = await fetch(config.url);
    const data = await response.json();

    // Map Heroku's status to Atlassian format
    const hasIncidents = data.incidents && data.incidents.length > 0;
    const allGreen = data.status.every(s => s.status === 'green');

    let status = 'none'; // operational
    let description = 'All Systems Operational';

    if (hasIncidents) {
      status = 'major';
      description = `${data.incidents.length} Active Incident(s)`;
    } else if (!allGreen) {
      status = 'minor';
      description = 'Some Systems Degraded';
    }

    // Track status change
    trackStatusChange(config.name, status, description);

    return {
      name: config.name,
      status: status,
      description: description,
      lastUpdated: new Date().toISOString(),
      url: 'https://status.heroku.com',
      components: data.status.slice(0, 5).map(s => ({
        name: s.system,
        status: s.status === 'green' ? 'operational' : 'degraded_performance'
      }))
    };
  } catch (error) {
    trackStatusChange(config.name, 'unknown', 'Failed to fetch status');
    return {
      name: config.name,
      status: 'unknown',
      description: 'Failed to fetch status',
      error: error.message
    };
  }
}

// Sort statuses by severity (issues first), then alphabetically
function sortByStatus(statuses) {
  const statusPriority = {
    'critical': 0,
    'major': 1,
    'minor': 2,
    'maintenance': 3,
    'unknown': 4,
    'degraded_performance': 5,
    'partial_outage': 6,
    'operational': 7,
    'none': 7
  };

  return statuses.sort((a, b) => {
    const priorityA = statusPriority[a.status] ?? 4;
    const priorityB = statusPriority[b.status] ?? 4;

    // First sort by priority
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Then sort alphabetically by name
    return a.name.localeCompare(b.name);
  });
}

// Fetch all statuses
async function fetchAllStatuses(enabledOnly = false) {
  const pagesToFetch = enabledOnly
    ? statusPages.filter(p => userPreferences.enabledServices.includes(p.name))
    : statusPages;

  const promises = pagesToFetch.map(page => {
    if (page.type === 'atlassian') {
      return fetchAtlassianStatus(page);
    } else if (page.type === 'slack') {
      return fetchSlackStatus(page);
    } else if (page.type === 'heroku') {
      return fetchHerokuStatus(page);
    }
    return null;
  });

  const results = await Promise.all(promises);
  const filtered = results.filter(r => r !== null);

  // Add history data to each result
  const withHistory = filtered.map(service => {
    const history = statusHistory[service.name];
    const issueDuration = getIssueDuration(service.name);

    return {
      ...service,
      history: history ? {
        lastChange: history.lastChange,
        recentChanges: history.changes.slice(0, 5), // Last 5 changes
        issueDuration: issueDuration
      } : null
    };
  });

  return sortByStatus(withHistory);
}

// Cache configuration for multi-user support
const CACHE_TTL = 120000; // 2 minutes in milliseconds
let statusCache = {
  data: null,
  timestamp: null
};

// Check if cache is still valid
function isCacheValid() {
  return statusCache.data &&
         statusCache.timestamp &&
         (Date.now() - statusCache.timestamp) < CACHE_TTL;
}

// Filter cached data by user's service preferences
function filterByServices(allStatuses, serviceNames) {
  if (!serviceNames || serviceNames.length === 0) {
    return allStatuses;
  }
  return allStatuses.filter(status => serviceNames.includes(status.name));
}

// Background polling - fetches status for all services every 2 minutes
async function backgroundStatusPoll() {
  try {
    console.log('Background poll: Fetching status for all services...');
    const statuses = await fetchAllStatuses(false); // Fetch all services
    statusCache.data = statuses;
    statusCache.timestamp = Date.now();
    console.log(`Background poll: Cached ${statuses.length} services at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('Background poll failed:', error.message);
  }
}

// Start background polling
setInterval(backgroundStatusPoll, CACHE_TTL);
// Initial fetch on startup
backgroundStatusPoll();

// API endpoint to get all statuses
app.get('/api/status', async (req, res) => {
  try {
    // Parse user's enabled services from query param
    let enabledServices = null;
    if (req.query.services) {
      try {
        enabledServices = JSON.parse(req.query.services);
      } catch (e) {
        console.error('Failed to parse services query param:', e);
      }
    }

    // If cache is valid, use it
    if (isCacheValid()) {
      const filtered = filterByServices(statusCache.data, enabledServices);
      return res.json(filtered);
    }

    // Cache miss or expired - fetch immediately
    console.log('Cache miss - fetching fresh data');
    const statuses = await fetchAllStatuses(false);
    statusCache.data = statuses;
    statusCache.timestamp = Date.now();

    const filtered = filterByServices(statuses, enabledServices);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get all available services
app.get('/api/services/available', (req, res) => {
  res.json(statusPages.map(p => ({ name: p.name, type: p.type })));
});

// Endpoint to get user preferences
app.get('/api/preferences', (req, res) => {
  res.json(userPreferences);
});

// Endpoint to update user preferences
app.post('/api/preferences', (req, res) => {
  const { enabledServices, refreshInterval } = req.body;

  if (!Array.isArray(enabledServices)) {
    return res.status(400).json({ error: 'enabledServices must be an array' });
  }

  // Validate that all services exist
  const validServices = enabledServices.filter(name =>
    statusPages.some(p => p.name === name)
  );

  userPreferences.enabledServices = validServices;

  // Validate and update refresh interval (1-60 minutes)
  if (refreshInterval !== undefined) {
    const interval = parseInt(refreshInterval);
    if (!isNaN(interval) && interval >= 1 && interval <= 60) {
      userPreferences.refreshInterval = interval;
    }
  }

  res.json(userPreferences);
});

app.listen(PORT, () => {
  console.log(`StatusWall server running on http://localhost:${PORT}`);
});
