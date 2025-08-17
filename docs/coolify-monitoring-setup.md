# Coolify Health Checks and Monitoring Configuration

This guide covers setting up comprehensive health checks and monitoring for the andrewford.co.nz blog deployment on Coolify.

## Overview

The monitoring setup includes:

- **Application health checks** via `/health` endpoint
- **Container health monitoring** with Docker healthcheck
- **Uptime monitoring** through Coolify dashboard
- **Log aggregation** and error tracking
- **Performance metrics** collection
- **Alert notifications** for critical issues

## Health Check Endpoints

### Primary Health Check

The application includes a comprehensive health check endpoint:

```javascript
// GET /health
{
  "status": "healthy",
  "timestamp": "2024-01-17T10:00:00.000Z",
  "environment": "production",
  "uptime": 3600,
  "memory": {
    "used": "45.2 MB",
    "total": "1.0 GB",
    "percentage": 4.5
  },
  "apis": {
    "openai": "connected",
    "openrouter": "connected",
    "lastfm": "connected",
    "youtube": "connected"
  }
}
```

### Enhanced Health Check Implementation

Update the health endpoint in `api/server.js` to include detailed status:

```javascript
app.get("/health", async (req, res) => {
  const healthCheck = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    memory: {
      used: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`,
      total: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1)} MB`,
      percentage: (
        (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) *
        100
      ).toFixed(1),
    },
  };

  // Test API connections
  const apiStatus = {};

  try {
    // Test vector store loading
    const vectorStore = loadVectorStore();
    apiStatus.vectorStore =
      vectorStore.documents?.length > 0 ? "loaded" : "empty";

    // Test environment variables
    apiStatus.openai = process.env.OPENAI_API_KEY ? "configured" : "missing";
    apiStatus.openrouter = process.env.OPENROUTER_API_KEY
      ? "configured"
      : "missing";
    apiStatus.lastfm = process.env.LASTFM_API_KEY ? "configured" : "missing";
    apiStatus.youtube = process.env.YOUTUBE_API_KEY ? "configured" : "missing";

    healthCheck.apis = apiStatus;

    // Check for any critical issues
    const criticalIssues = Object.values(apiStatus).filter(
      (status) => status === "missing"
    ).length;
    if (criticalIssues > 0) {
      healthCheck.status = "degraded";
      healthCheck.warnings = `${criticalIssues} API keys missing`;
    }
  } catch (error) {
    healthCheck.status = "unhealthy";
    healthCheck.error = error.message;
  }

  const statusCode =
    healthCheck.status === "healthy"
      ? 200
      : healthCheck.status === "degraded"
      ? 200
      : 503;

  res.status(statusCode).json(healthCheck);
});
```

## Coolify Dashboard Monitoring

### 1. Application Health Checks

Configure in Coolify dashboard:

1. **Navigate to your application**
2. **Go to Health Checks section**
3. **Add HTTP Health Check**:
   - **URL**: `https://andrewford.co.nz/health`
   - **Method**: `GET`
   - **Expected Status**: `200`
   - **Timeout**: `10 seconds`
   - **Interval**: `30 seconds`
   - **Retries**: `3`
   - **Start Period**: `60 seconds`

### 2. Container Health Monitoring

The Docker health check is already configured in the Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: 3000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
      if (res.statusCode === 200) process.exit(0); \
      else process.exit(1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"
```

### 3. Uptime Monitoring Configuration

Set up uptime monitoring in Coolify:

1. **Go to Monitoring → Uptime**
2. **Add Monitor**:
   - **Name**: `Andrew Ford Blog`
   - **URL**: `https://andrewford.co.nz/health`
   - **Check Interval**: `60 seconds`
   - **Timeout**: `10 seconds`
   - **Expected Keywords**: `"status":"healthy"`
   - **Alert Threshold**: `3 consecutive failures`

## Log Management

### 1. Application Logging

The Winston logger is configured for structured logging:

```javascript
// Enhanced logging configuration
const winston = require("winston");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.metadata()
  ),
  defaultMeta: {
    service: "andrewford-blog",
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  },
  transports: [
    // Console logging
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "development"
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          : winston.format.json(),
    }),

    // File logging for production
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: "/app/logs/error.log",
            level: "error",
            maxsize: 50 * 1024 * 1024, // 50MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: "/app/logs/combined.log",
            maxsize: 100 * 1024 * 1024, // 100MB
            maxFiles: 3,
          }),
        ]
      : []),
  ],
});
```

### 2. Log Aggregation in Coolify

Configure log collection:

1. **Go to Application → Logs**
2. **Enable Log Collection**: ✅
3. **Log Retention**: `7 days` (adjust based on storage)
4. **Log Level**: `info` (production) / `debug` (development)
5. **Enable Log Streaming**: ✅ for real-time monitoring

### 3. Error Tracking

Add error tracking middleware to capture and log errors:

```javascript
// Enhanced error tracking middleware
app.use((err, req, res, next) => {
  const errorDetails = {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    correlationId: req.headers["x-correlation-id"] || Date.now(),
  };

  logger.error("Unhandled application error", errorDetails);

  // Don't expose stack traces in production
  const response = {
    error: "Internal server error",
    correlationId: errorDetails.correlationId,
    ...(process.env.NODE_ENV === "development" && {
      message: err.message,
      stack: err.stack,
    }),
  };

  res.status(err.status || 500).json(response);
});
```

## Performance Monitoring

### 1. Metrics Collection

Add performance metrics to the health endpoint:

```javascript
// Performance metrics collection
const startTime = Date.now();
let requestCount = 0;
let errorCount = 0;

// Request counting middleware
app.use((req, res, next) => {
  requestCount++;

  // Track response time
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400) errorCount++;

    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get("User-Agent"),
    });
  });

  next();
});

// Enhanced health check with metrics
app.get("/health", (req, res) => {
  const uptime = Date.now() - startTime;
  const metrics = {
    uptime: Math.floor(uptime / 1000),
    requests: {
      total: requestCount,
      errors: errorCount,
      errorRate:
        requestCount > 0 ? ((errorCount / requestCount) * 100).toFixed(2) : 0,
    },
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  };

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    metrics,
  });
});
```

### 2. Resource Monitoring

Monitor container resources in Coolify:

1. **Go to Application → Resources**
2. **Monitor**:
   - **CPU Usage**: Target < 70%
   - **Memory Usage**: Target < 80%
   - **Disk Usage**: Target < 85%
   - **Network I/O**: Monitor for spikes

## Alert Configuration

### 1. Coolify Notification Settings

Set up alerts in Coolify dashboard:

1. **Go to Settings → Notifications**
2. **Add Notification Channel**:
   - **Type**: Email / Slack / Discord
   - **Webhook URL**: (if using webhook)
   - **Email**: your-email@domain.com

### 2. Alert Rules

Configure alert conditions:

```yaml
# Alert conditions (configured in Coolify dashboard)
alerts:
  - name: "Application Down"
    condition: "health_check_failed"
    threshold: 3
    duration: "3 minutes"

  - name: "High Error Rate"
    condition: "error_rate > 5%"
    duration: "5 minutes"

  - name: "High Memory Usage"
    condition: "memory_usage > 80%"
    duration: "10 minutes"

  - name: "High CPU Usage"
    condition: "cpu_usage > 70%"
    duration: "15 minutes"

  - name: "SSL Certificate Expiry"
    condition: "ssl_expires_in < 30 days"
    duration: "immediate"
```

### 3. Notification Templates

Customize alert messages:

```
🚨 ALERT: {{alert_name}}
🔗 Service: andrewford.co.nz blog
⏰ Time: {{timestamp}}
📊 Details: {{details}}
🔧 Action Required: {{action}}
```

## External Monitoring (Optional)

### 1. UptimeRobot Integration

For external monitoring, set up UptimeRobot:

1. **Create UptimeRobot account**
2. **Add HTTP Monitor**:
   - **URL**: `https://andrewford.co.nz/health`
   - **Monitoring Interval**: `5 minutes`
   - **Monitor Type**: `HTTP(s)`
   - **Alert Contacts**: Your email/SMS

### 2. StatusPage Setup

Create a status page for transparency:

1. **Use statuspage.io or similar**
2. **Configure components**:
   - Website
   - API Services
   - Chatbot
   - Content Delivery
3. **Set up automated updates** from health checks

## Monitoring Dashboard

### 1. Custom Health Dashboard

Create a simple monitoring dashboard:

```html
<!-- /health/dashboard endpoint -->
<!DOCTYPE html>
<html>
  <head>
    <title>Andrew Ford Blog - System Status</title>
    <style>
      .status {
        padding: 10px;
        margin: 5px;
        border-radius: 5px;
      }
      .healthy {
        background: #d4edda;
        color: #155724;
      }
      .degraded {
        background: #fff3cd;
        color: #856404;
      }
      .unhealthy {
        background: #f8d7da;
        color: #721c24;
      }
    </style>
  </head>
  <body>
    <h1>System Status Dashboard</h1>
    <div id="status"></div>

    <script>
      async function updateStatus() {
        try {
          const response = await fetch("/health");
          const health = await response.json();

          const statusDiv = document.getElementById("status");
          statusDiv.innerHTML = `
                    <div class="status ${health.status}">
                        <h2>Overall Status: ${health.status.toUpperCase()}</h2>
                        <p>Last Updated: ${health.timestamp}</p>
                        <p>Uptime: ${health.uptime} seconds</p>
                        ${
                          health.metrics
                            ? `
                            <p>Total Requests: ${health.metrics.requests.total}</p>
                            <p>Error Rate: ${health.metrics.requests.errorRate}%</p>
                        `
                            : ""
                        }
                    </div>
                `;
        } catch (error) {
          document.getElementById("status").innerHTML = `
                    <div class="status unhealthy">
                        <h2>Status: UNAVAILABLE</h2>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
        }
      }

      updateStatus();
      setInterval(updateStatus, 30000); // Update every 30 seconds
    </script>
  </body>
</html>
```

## Testing and Validation

### 1. Health Check Testing

Test all monitoring endpoints:

```bash
# Test primary health check
curl -s https://andrewford.co.nz/health | jq

# Test response time
curl -w "Response time: %{time_total}s\n" -s https://andrewford.co.nz/health

# Test from different locations
curl -s https://andrewford.co.nz/health --connect-timeout 5
```

### 2. Alert Testing

Trigger test alerts:

1. **Stop the application** (simulate downtime)
2. **Verify alerts are sent** within expected timeframe
3. **Restart application** and confirm recovery alerts
4. **Test notification channels** (email, Slack, etc.)

## Troubleshooting

### Common Monitoring Issues

| Issue                 | Cause                      | Solution                            |
| --------------------- | -------------------------- | ----------------------------------- |
| Health check failing  | Application not responding | Check logs and restart if needed    |
| False positive alerts | Network latency            | Increase timeout values             |
| Missing metrics       | Logger not configured      | Verify Winston setup                |
| High memory alerts    | Memory leak                | Restart application and investigate |

### Log Analysis

Key log patterns to monitor:

```bash
# Error patterns
grep -i "error\|exception\|failed" /app/logs/combined.log

# Performance issues
grep -i "timeout\|slow\|high" /app/logs/combined.log

# Security concerns
grep -i "unauthorized\|forbidden\|attack" /app/logs/combined.log
```

## Next Steps

After completing health checks and monitoring setup:

1. ✅ Verify all health endpoints are responding correctly
2. ✅ Confirm monitoring alerts are configured and working
3. ✅ Test notification channels (email, Slack, etc.)
4. ✅ Validate log collection and aggregation
5. ✅ Proceed to build triggers and deployment automation (Task 4.5)
