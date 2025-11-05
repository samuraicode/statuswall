# StatusWall - Future Improvements

## High Priority Features

### 1. Search & Filter (Quick Win) ✅
- [✅] Add search bar to filter services by name (client-side)
- [✅] "Show only issues" toggle to hide operational services
- [✅] Filter by status type (operational, minor, major, critical)
- [✅] Service count badge showing "X issues, Y operational"

### 2. Cloud Provider Support (High Value)
- [ ] AWS Status Parser - https://status.aws.amazon.com/ (custom format)
- [ ] Azure Status Parser - https://status.azure.com/ (custom format)
- [ ] Google Cloud Platform Parser - https://status.cloud.google.com/ (custom format)

### 3. Enhanced Historical Data
- [ ] Calculate uptime percentages (7-day, 30-day, 90-day)
- [ ] Historical status chart/timeline visualization
- [ ] Incident count per service
- [ ] MTTR (Mean Time To Recovery) statistics
- [ ] Export historical data to CSV

### 4. Browser Notifications
- [ ] Request notification permission
- [ ] Send notifications when services go down
- [ ] Send notifications when services recover
- [ ] Optional notification per service
- [ ] Notification sound toggle

### 5. Service Categories & Organization
- [ ] Group services by category (Cloud, Communication, Databases, DevOps, etc.)
- [ ] Collapsible category sections
- [ ] Custom tags for services
- [ ] Drag-and-drop reordering

## Medium Priority Features

### 6. Incident Details
- [ ] Click to expand incident descriptions
- [ ] Show affected components in detail
- [ ] Display incident updates/timeline
- [ ] Link to postmortems when available
- [ ] Show incident severity history

### 7. Multiple Dashboards
- [ ] Create named dashboards ("Production Stack", "Dev Tools", etc.)
- [ ] Switch between dashboards
- [ ] Share dashboard configs via URL
- [ ] Import/export dashboard configurations
- [ ] Default dashboard setting

### 8. Performance Monitoring
- [ ] Track external API response times
- [ ] Show which services are slow to report
- [ ] Display last successful fetch timestamp per service
- [ ] Warning indicator if data is stale (>5 minutes)
- [ ] Health check endpoint for monitoring

### 9. UI/UX Enhancements
- [ ] Compact list view option (alternative to grid)
- [ ] Service logos/icons instead of just names
- [ ] Color-coded status bar at top of page
- [ ] "All clear" celebration animation
- [ ] Export current status report as PDF
- [ ] Export current status report as CSV
- [ ] Dark/light mode auto-switch based on system preference
- [ ] Keyboard shortcuts (c=config, r=refresh, /=search, esc=close)
- [ ] Favicon changes color when issues detected
- [ ] Click to copy status for sharing

### 10. Mobile & PWA
- [ ] Progressive Web App (PWA) configuration
- [ ] Add to home screen support
- [ ] Offline support with cached data
- [ ] Push notifications (mobile)
- [ ] Touch gestures (swipe to refresh)
- [ ] Responsive improvements for mobile

## Lower Priority Features

### 11. Social & Collaborative
- [ ] Public dashboard URLs (read-only sharing)
- [ ] Team workspaces with shared configurations
- [ ] Comment system on incidents
- [ ] Internal notes per service
- [ ] User accounts (optional)

### 12. Integrations
- [ ] Slack bot integration ("@statuswall check github")
- [ ] Discord webhook support
- [ ] Microsoft Teams webhook
- [ ] Zapier integration
- [ ] Public REST API for status data
- [ ] RSS feed of current incidents
- [ ] Webhook notifications to custom URLs
- [ ] IFTTT integration

### 13. Advanced Analytics
- [ ] Correlation analysis (which services fail together?)
- [ ] Reliability score per service
- [ ] Historical trend graphs
- [ ] Downtime patterns (time of day, day of week)
- [ ] Comparison between services
- [ ] SLA tracking

### 14. Configuration Options
- [ ] Environment variable for cache TTL
- [ ] Custom polling intervals per service
- [ ] Retry logic configuration for failed fetches
- [ ] Timeout configuration per service
- [ ] Rate limit configuration
- [ ] Admin panel for server configuration

### 15. Embed & Share
- [ ] Embeddable iframe widget for other websites
- [ ] Customizable embed appearance
- [ ] Status badge images (like shields.io)
- [ ] Public API endpoint
- [ ] Markdown status reports

## Technical Improvements

### 16. Infrastructure
- [ ] Docker containerization
- [ ] Docker Compose for easy deployment
- [ ] Kubernetes manifests
- [ ] Heroku deployment guide
- [ ] Vercel/Netlify deployment guide
- [ ] Environment variable documentation

### 17. Database (for scaling)
- [ ] PostgreSQL support for history
- [ ] Redis caching layer for distributed deployments
- [ ] Database migration scripts
- [ ] Backup and restore functionality

### 18. Testing & Quality
- [ ] Unit tests for API endpoints
- [ ] Integration tests
- [ ] E2E tests with Playwright/Cypress
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated dependency updates (Dependabot)
- [ ] Code coverage reporting

### 19. Monitoring & Logging
- [ ] Structured logging
- [ ] Error tracking (Sentry integration)
- [ ] Performance monitoring
- [ ] Uptime monitoring for StatusWall itself
- [ ] Analytics (privacy-friendly)

### 20. Documentation
- [ ] API documentation
- [ ] Deployment guide
- [ ] Contributing guide
- [ ] Architecture documentation
- [ ] Adding new status page formats guide
- [ ] Troubleshooting guide

## Services to Add

### Already Using Atlassian Statuspage Format (Easy to Add)
- [ ] Datadog - https://status.datadoghq.com/api/v2/status.json
- [ ] PagerDuty - https://status.pagerduty.com/api/v2/status.json
- [ ] Fastly - https://status.fastly.com/api/v2/status.json
- [ ] Auth0 - https://status.auth0.com/api/v2/status.json
- [ ] Salesforce - https://status.salesforce.com/api/v2/status.json
- [ ] HubSpot - https://status.hubspot.com/api/v2/status.json
- [ ] Shopify - https://status.shopify.com/api/v2/status.json
- [ ] Airtable - https://status.airtable.com/api/v2/status.json
- [ ] Contentful - https://www.contentfulstatus.com/api/v2/status.json
- [ ] LaunchDarkly - https://status.launchdarkly.com/api/v2/status.json
- [ ] Algolia - https://status.algolia.com/api/v2/status.json
- [ ] Segment - https://status.segment.com/api/v2/status.json
- [ ] Intercom - https://www.intercomstatus.com/api/v2/status.json
- [ ] CircleCI - https://status.circleci.com/api/v2/status.json
- [ ] Travis CI - https://www.traviscistatus.com/api/v2/status.json
- [ ] GitLab - https://status.gitlab.com/api/v2/status.json
- [ ] Bitbucket - https://bitbucket.status.atlassian.com/api/v2/status.json
- [ ] Grafana Cloud - https://status.grafana.com/api/v2/status.json
- [ ] New Relic - https://status.newrelic.com/api/v2/status.json
- [ ] Elastic Cloud - https://cloud-status.elastic.co/api/v2/status.json

### Custom Format (Require Parser Development)
- [ ] AWS - https://status.aws.amazon.com/
- [ ] Azure - https://status.azure.com/
- [ ] Google Cloud - https://status.cloud.google.com/
- [ ] Kubernetes - https://k8s.io/status/

## Notes
- Items marked with ✅ are completed
- Priority may change based on user feedback
- Some features may be moved to paid tier if commercialized
