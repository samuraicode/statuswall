import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { statusPages } from './config.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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
async function fetchAllStatuses() {
  const promises = statusPages.map(page => {
    if (page.type === 'atlassian') {
      return fetchAtlassianStatus(page);
    } else if (page.type === 'slack') {
      return fetchSlackStatus(page);
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
    const statuses = await fetchAllStatuses();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get configuration
app.get('/api/config', (req, res) => {
  res.json(statusPages.map(p => ({ name: p.name, type: p.type })));
});

app.listen(PORT, () => {
  console.log(`StatusWall server running on http://localhost:${PORT}`);
});
