# StatusWall

A beautiful web application that aggregates and displays status pages from multiple services in one unified dashboard. Monitor all your critical dependencies at a glance.

## Features

- **49 Popular Services**: Monitor status of major developer tools and platforms
- **Configurable Dashboard**: Select which services to monitor from the settings page
- **Real-time Monitoring**: Displays current status of all enabled services
- **Historical Tracking**: Track when issues start, how long they persist, and when status changes
- **Production-Ready Caching**: Shared cache with 2-minute TTL for multi-user deployments
- **Background Polling**: Automatic status updates every 2 minutes without user requests
- **Flexible Auto-refresh**: Choose refresh intervals from 1 minute to 1 hour
- **Visual Countdown**: Progress bar shows time until next refresh
- **Smart Sorting**: Services with issues appear first, then alphabetically
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Clean UI**: Modern, responsive design with blue gradient theme
- **Compact Cards**: Uniform card heights for consistent grid layout
- **Quick Links**: Direct links to full status pages
- **Overall Status**: At-a-glance view of whether all systems are operational
- **localStorage Persistence**: Your preferences are saved in the browser

## Supported Services

StatusWall monitors 49 popular developer services including:

1. **Cloudflare** - CDN & security
2. **DigitalOcean** - Cloud infrastructure
3. **Discord** - Communication platform
4. **Dropbox** - File storage
5. **Figma** - Design tool
6. **GitHub** - Code hosting
7. **Heroku** - Cloud platform
8. **Jira** - Project management
9. **Linear** - Project management
10. **MongoDB** - Database
11. **Netlify** - Web hosting
12. **Notion** - Productivity
13. **npm** - Package manager
14. **OpenAI** - AI platform
15. **Postman** - API development
16. **Redis** - In-memory database
17. **SendGrid** - Email delivery
18. **Sentry** - Error tracking
19. **Slack** - Team communication
20. **Stripe** - Payment processing
21. **Supabase** - Backend-as-a-service
22. **Twilio** - Communications platform
23. **Vercel** - Deployment platform
24. **Zoom** - Video conferencing
25. And more...

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd statuswall
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the backend API server (port 3001) and the frontend dev server (port 3000).

4. Open your browser to [http://localhost:3000](http://localhost:3000)

## Usage

### Configuring Services

1. Click the **Configure** button in the top right
2. Select which services you want to monitor using checkboxes
3. Use **Select All** or **Deselect All** for quick bulk changes
4. Choose your preferred auto-refresh interval (1 minute to 1 hour)
5. Click **Save Changes**

Your preferences are saved in localStorage and will persist across browser sessions.

### Understanding Status Indicators

- **Green (✓)**: Operational - All systems running normally
- **Yellow (⚠)**: Minor Issues - Some degraded performance
- **Orange (⚠)**: Major Issues - Significant outages
- **Red (✗)**: Critical - Major outage or critical issues
- **Blue (ℹ)**: Maintenance - Scheduled maintenance
- **Gray (?)**: Unknown - Unable to fetch status

Services with issues are automatically sorted to the top for quick visibility.

## Configuration

### Adding New Services

Edit `server/config.js` to add more services:

```javascript
export const statusPages = [
  {
    name: 'Service Name',
    url: 'https://status.example.com/api/v2/status.json',
    type: 'atlassian'  // or 'slack', 'heroku'
  },
  // Add more services...
];
```

Most services using Statuspage.io follow the pattern:
- `https://status.servicename.com/api/v2/status.json`
- `https://www.servicenamestatus.com/api/v2/status.json`

### Supported Status Page Formats

- **Atlassian Statuspage** (most common)
- **Slack** (custom format)
- **Heroku** (custom v4 API format)

## API Endpoints

The backend provides these endpoints:

- `GET /api/status` - Returns current status of all enabled services
- `GET /api/status?services=[...]` - Returns status for specific services
- `GET /api/services/available` - Returns list of all available services
- `GET /api/preferences` - Returns user preferences
- `POST /api/preferences` - Updates user preferences

## Technology Stack

- **Frontend**: React 18, Vite
- **Backend**: Express.js, Node.js
- **Styling**: Pure CSS with modern gradients and animations
- **HTTP Client**: node-fetch
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: localStorage (client), file-based history (server)
- **Caching**: In-memory cache with background polling

## Architecture

### Multi-User Ready

StatusWall is designed to handle multiple concurrent users efficiently:

- **Shared Cache**: All users share a single cache that's refreshed every 2 minutes
- **Background Polling**: Server polls external status APIs independently of user requests
- **Fast Responses**: API requests return in ~7ms from cache instead of 2-5 seconds from external APIs
- **Rate Limit Friendly**: Makes only 30 requests per hour to each service (vs potentially thousands without caching)
- **Client-Side Filtering**: Each user's service preferences are stored in localStorage and filtered from the shared cache

**Scalability**: The current implementation can easily handle hundreds of concurrent users. For thousands of users, consider adding Redis for distributed caching.

## Project Structure

```
statuswall/
├── server/
│   ├── index.js       # Express server with API endpoints
│   └── config.js      # Status page configuration
├── src/
│   ├── components/
│   │   ├── StatusCard.jsx      # Individual service status card
│   │   ├── StatusCard.css
│   │   ├── ConfigPage.jsx      # Configuration interface
│   │   └── ConfigPage.css
│   ├── App.jsx        # Main application component
│   ├── App.css        # Global styles
│   ├── main.jsx       # Entry point
│   └── index.css      # Base styles and gradient
├── index.html
├── vite.config.js
└── package.json
```

## Production Build

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Contributing

Feel free to submit issues and enhancement requests!

To add a new service:
1. Find the service's status page API URL
2. Add it to `server/config.js`
3. Restart the server
4. The service will appear in the configuration page

## License

MIT

## Future Enhancements

- Support for more status page formats (AWS, Azure, etc.)
- Email/SMS notifications for outages
- Custom status page grouping
- Mobile app
- Webhooks for status changes
- Status history graphs
- Uptime percentage tracking
