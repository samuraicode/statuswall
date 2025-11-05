// Configuration for status pages to monitor
// You can add or remove services here

export const statusPages = [
  {
    name: 'Airtable',
    url: 'https://status.airtable.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Algolia',
    url: 'https://status.algolia.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Atlassian',
    url: 'https://status.atlassian.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Auth0',
    url: 'https://status.auth0.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Bitbucket',
    url: 'https://bitbucket.status.atlassian.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'CircleCI',
    url: 'https://status.circleci.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Claude',
    url: 'https://status.claude.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Cloudflare',
    url: 'https://www.cloudflarestatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Contentful',
    url: 'https://www.contentfulstatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Datadog',
    url: 'https://status.datadoghq.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'DigitalOcean',
    url: 'https://status.digitalocean.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Discord',
    url: 'https://discordstatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Dropbox',
    url: 'https://status.dropbox.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Elastic Cloud',
    url: 'https://cloud-status.elastic.co/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Fastly',
    url: 'https://status.fastly.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Figma',
    url: 'https://status.figma.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'GitHub',
    url: 'https://www.githubstatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'GitLab',
    url: 'https://status.gitlab.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Grafana Cloud',
    url: 'https://status.grafana.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Heroku',
    url: 'https://status.heroku.com/api/v4/current-status',
    type: 'heroku'
  },
  {
    name: 'HubSpot',
    url: 'https://status.hubspot.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Intercom',
    url: 'https://www.intercomstatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Jira',
    url: 'https://jira-software.status.atlassian.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'LaunchDarkly',
    url: 'https://status.launchdarkly.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Linear',
    url: 'https://linearstatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Mailgun',
    url: 'https://status.mailgun.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'MongoDB',
    url: 'https://status.mongodb.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Netlify',
    url: 'https://www.netlifystatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'New Relic',
    url: 'https://status.newrelic.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Notion',
    url: 'https://www.notion-status.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'npm',
    url: 'https://status.npmjs.org/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'OpenAI',
    url: 'https://status.openai.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'PagerDuty',
    url: 'https://status.pagerduty.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Postman',
    url: 'https://status.postman.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Redis',
    url: 'https://status.redis.io/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Salesforce',
    url: 'https://status.salesforce.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Segment',
    url: 'https://status.segment.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'SendGrid',
    url: 'https://status.sendgrid.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Sentry',
    url: 'https://status.sentry.io/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Shopify',
    url: 'https://status.shopify.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Slack',
    url: 'https://slack-status.com/api/v2.0.0/current',
    type: 'slack'
  },
  {
    name: 'Snowflake',
    url: 'https://status.snowflake.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Stripe',
    url: 'https://www.stripestatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Supabase',
    url: 'https://status.supabase.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Travis CI',
    url: 'https://www.traviscistatus.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Twilio',
    url: 'https://status.twilio.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Vercel',
    url: 'https://www.vercel-status.com/api/v2/status.json',
    type: 'atlassian'
  },
  {
    name: 'Zoom',
    url: 'https://www.zoomstatus.com/api/v2/status.json',
    type: 'atlassian'
  }
];

// Add more status pages following this format:
// {
//   name: 'Service Name',
//   url: 'https://status.example.com/api/v2/status.json',
//   type: 'atlassian'  // Currently supports 'atlassian', 'slack', and 'heroku' formats
// }
