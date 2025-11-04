# StatusWall

A beautiful web application that aggregates and displays status pages from multiple services in one unified dashboard. Monitor all your critical dependencies at a glance.

## Features

- **Real-time Monitoring**: Displays current status of multiple services
- **Auto-refresh**: Automatically updates every 5 minutes
- **Clean UI**: Modern, responsive design with status indicators
- **Component Details**: View individual component statuses for each service
- **Quick Links**: Direct links to full status pages
- **Overall Status**: At-a-glance view of whether all systems are operational

## Supported Status Pages

Currently supports services using Atlassian Statuspage.io format, including:
- GitHub
- Vercel
- OpenAI
- Stripe
- Cloudflare
- Slack
- Linear
- And many more!

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

## Configuration

### Adding/Removing Services

Edit `server/config.js` to customize which status pages to monitor:

```javascript
export const statusPages = [
  {
    name: 'Service Name',
    url: 'https://status.example.com/api/v2/status.json',
    type: 'atlassian'
  },
  // Add more services...
];
```

Most services using Statuspage.io follow the pattern:
- `https://status.servicename.com/api/v2/status.json`
- `https://www.servicenamestatus.com/api/v2/status.json`

## Production Build

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Status Indicators

- **Green (✓)**: Operational - All systems running normally
- **Yellow (⚠)**: Minor Issues - Some degraded performance
- **Orange (⚠)**: Major Issues - Significant outages
- **Red (✗)**: Critical - Major outage or critical issues
- **Blue (ℹ)**: Maintenance - Scheduled maintenance
- **Gray (?)**: Unknown - Unable to fetch status

## API Endpoints

The backend provides these endpoints:

- `GET /api/status` - Returns current status of all configured services
- `GET /api/config` - Returns list of configured services

## Technology Stack

- **Frontend**: React 18, Vite
- **Backend**: Express.js, Node.js
- **Styling**: Pure CSS with modern gradients and animations
- **HTTP Client**: node-fetch

## Project Structure

```
statuswall/
├── server/
│   ├── index.js       # Express server
│   └── config.js      # Status page configuration
├── src/
│   ├── components/
│   │   ├── StatusCard.jsx
│   │   └── StatusCard.css
│   ├── App.jsx        # Main application
│   ├── App.css
│   ├── main.jsx       # Entry point
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Future Enhancements

- Support for more status page formats (AWS, Azure, etc.)
- User authentication and personalized dashboards
- Email/SMS notifications for outages
- Historical status data and uptime tracking
- Custom status page grouping
- Dark mode
