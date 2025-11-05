import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { statusPages } from './config.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for user preferences (in production, use a database)
let userPreferences = {
  enabledServices: statusPages.map(p => p.name) // All enabled by default
};

// Parse Atlassian Statuspage format
async function fetchAtlassianStatus(config) {
  try {
    const response = await fetch(config.url);
    const data = await response.json();

    return {
      name: config.name,
      status: data.status.indicator,
      description: data.status.description,
      lastUpdated: data.page.updated_at,
      url: data.page.url,
      components: data.components?.slice(0, 5).map(c => ({
        name: c.name,
        status: c.status
      })) || []
    };
  } catch (error) {
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

    return {
      name: config.name,
      status: status,
      description: description,
      lastUpdated: new Date().toISOString(),
      url: 'https://status.heroku.com',
      components: data.status.map(s => ({
        name: s.system,
        status: s.status === 'green' ? 'operational' : 'degraded_performance'
      }))
    };
  } catch (error) {
    return {
      name: config.name,
      status: 'unknown',
      description: 'Failed to fetch status',
      error: error.message
    };
  }
}

// Sort statuses by severity (issues first)
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
    return priorityA - priorityB;
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
  return sortByStatus(filtered);
}

// API endpoint to get all statuses
app.get('/api/status', async (req, res) => {
  try {
    const statuses = await fetchAllStatuses(true); // Only fetch enabled services
    res.json(statuses);
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
  const { enabledServices } = req.body;

  if (!Array.isArray(enabledServices)) {
    return res.status(400).json({ error: 'enabledServices must be an array' });
  }

  // Validate that all services exist
  const validServices = enabledServices.filter(name =>
    statusPages.some(p => p.name === name)
  );

  userPreferences.enabledServices = validServices;
  res.json(userPreferences);
});

app.listen(PORT, () => {
  console.log(`StatusWall server running on http://localhost:${PORT}`);
});
