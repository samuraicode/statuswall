// Configuration for status pages to monitor
// You can add or remove services here

export const statusPages = [
  {
    name: 'GitHub',
    url: 'https://www.githubstatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Vercel',
    url: 'https://www.vercel-status.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'OpenAI',
    url: 'https://status.openai.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Stripe',
    url: 'https://www.stripestatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Cloudflare',
    url: 'https://www.cloudflarestatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Slack',
    url: 'https://slack-status.com/api/v2.0.0/current',
    type: 'slack'
  },
  {
    name: 'Linear',
    url: 'https://linearstatus.com/api/v2/status.json',
    type: 'atlassian'
  }
];

// Add more status pages following this format:
// {
//   name: 'Service Name',
//   url: 'https://status.example.com/api/v2/status.json',
//   type: 'atlassian'  // Currently only 'atlassian' Statuspage.io format is supported
// }
