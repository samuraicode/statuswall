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

// Fetch all statuses
async function fetchAllStatuses() {
  const promises = statusPages.map(page => {
    if (page.type === 'atlassian') {
      return fetchAtlassianStatus(page);
    }
    return null;
  });

  const results = await Promise.all(promises);
  return results.filter(r => r !== null);
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
