# Coolify Staging Deployment Testing Guide

This guide provides a comprehensive testing plan for validating the staging deployment of andrewford.co.nz blog on Coolify before production cutover.

## Overview

The staging deployment test validates:

- **Container deployment** with Docker multi-stage build
- **API endpoint functionality** for all three migrated functions
- **Static site generation** and serving
- **Environment variable configuration**
- **Health monitoring** and logging
- **SSL certificate** and domain routing
- **Performance benchmarks** against current Netlify deployment

## Prerequisites

Before starting staging tests:

- ✅ Coolify server configured with all documentation guides
- ✅ Staging subdomain DNS configured (`staging.andrewford.co.nz`)
- ✅ All environment variables imported to Coolify
- ✅ GitHub repository webhook configured
- ✅ Docker build process tested locally

## Staging Environment Setup

### 1. Staging Branch Configuration

Ensure the staging environment uses the `migrate-from-netlify` branch:

```yaml
# Coolify staging environment settings
environment: staging
branch: migrate-from-netlify
domain: staging.andrewford.co.nz
auto_deploy: true
build_args:
  - NODE_ENV=staging
  - SITE_URL=https://staging.andrewford.co.nz
  - API_URL=https://staging.andrewford.co.nz
```

### 2. Environment Variables Validation

Test all required environment variables are configured:

```bash
# Required environment variables for staging
NODE_ENV=staging
SITE_URL=https://staging.andrewford.co.nz
API_URL=https://staging.andrewford.co.nz
ALLOWED_ORIGINS=https://staging.andrewford.co.nz,http://localhost:3000
LOG_LEVEL=debug

# API Keys (same as production)
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=sk-...
LASTFM_API_KEY=...
LASTFM_USERNAME=...
YOUTUBE_API_KEY=...
YOUTUBE_CHANNEL_ID=...
PORT=3000
```

## Deployment Testing

### 1. Initial Deployment Test

Deploy the application to staging environment:

1. **Trigger Deployment**:

   - Push commit to `migrate-from-netlify` branch
   - Or manually trigger deployment in Coolify dashboard
   - Or use webhook trigger

2. **Monitor Deployment Progress**:

   ```bash
   # Watch deployment logs in Coolify
   # Expected stages:
   # 1. Git clone
   # 2. Docker build (multi-stage)
   # 3. Container startup
   # 4. Health check validation
   # 5. Traefik routing configuration
   ```

3. **Deployment Success Criteria**:
   - Build completes without errors
   - Container starts successfully
   - Health check returns 200 OK
   - Domain routing works correctly

### 2. Container Health Validation

Test container health and resource usage:

```bash
# Test health endpoint
curl -s https://staging.andrewford.co.nz/health | jq

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-17T10:00:00.000Z",
  "environment": "staging",
  "uptime": 30,
  "memory": {
    "used": "45.2 MB",
    "total": "512.0 MB",
    "percentage": "8.8"
  },
  "apis": {
    "openai": "configured",
    "openrouter": "configured",
    "lastfm": "configured",
    "youtube": "configured"
  }
}

# Test response time
curl -w "Response time: %{time_total}s\n" -s https://staging.andrewford.co.nz/health

# Expected: < 500ms response time
```

## API Endpoint Testing

### 1. Last.fm API Integration Test

Test the music data integration:

```bash
# Test Last.fm endpoint
curl -s https://staging.andrewford.co.nz/api/lastplayed | jq

# Expected response structure:
{
  "recenttracks": {
    "track": [
      {
        "name": "Song Title",
        "artist": {
          "#text": "Artist Name"
        },
        "album": {
          "#text": "Album Name"
        },
        "date": {
          "#text": "17 Jan 2024, 10:00",
          "uts": "1705492800"
        }
      }
    ]
  }
}

# Test error handling
curl -s -w "%{http_code}" https://staging.andrewford.co.nz/api/lastplayed

# Expected: 200 status code
```

### 2. YouTube API Integration Test

Test the video feed integration:

```bash
# Test YouTube endpoint
curl -s https://staging.andrewford.co.nz/api/latestUploads | jq

# Expected response structure:
{
  "items": [
    {
      "id": {
        "videoId": "VIDEO_ID"
      },
      "snippet": {
        "title": "Video Title",
        "description": "Video description...",
        "publishedAt": "2024-01-17T10:00:00Z",
        "thumbnails": {
          "medium": {
            "url": "https://i.ytimg.com/vi/VIDEO_ID/mqdefault.jpg"
          }
        }
      }
    }
  ]
}

# Test response time
curl -w "Response time: %{time_total}s\n" -s https://staging.andrewford.co.nz/api/latestUploads

# Expected: < 2s response time
```

### 3. RAG Chatbot API Integration Test

Test the chatbot functionality:

```bash
# Test chatbot endpoint with simple query
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is this blog about?",
    "conversationHistory": []
  }'

# Expected: Streaming response with relevant content
# Should return contextual answer about the blog

# Test with technical question
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I set up Docker?",
    "conversationHistory": []
  }'

# Expected: Response based on blog content about Docker
```

## Static Site Testing

### 1. Homepage Validation

Test the main site functionality:

```bash
# Test homepage loads correctly
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/

# Expected: 200 status code

# Test specific pages
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/about/
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/articles/

# Expected: All return 200 status codes
```

### 2. Static Asset Validation

Verify static assets are served correctly:

```bash
# Test CSS files
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/styles/main.css

# Test JavaScript files
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/scripts/chat.js

# Test images
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/images/logo.png

# Expected: All return 200 status codes
```

### 3. Data Integration Testing

Verify 11ty data files work with new API endpoints:

```bash
# Check if music widget loads data
curl -s https://staging.andrewford.co.nz/ | grep -i "currently listening"

# Check if video feed displays
curl -s https://staging.andrewford.co.nz/ | grep -i "latest videos"

# Check chatbot is functional
curl -s https://staging.andrewford.co.nz/ | grep -i "chat"
```

## Performance Testing

### 1. Load Testing

Test application under load:

```bash
# Simple load test with curl
for i in {1..50}; do
  curl -s -o /dev/null -w "%{time_total}\n" https://staging.andrewford.co.nz/health &
done
wait

# Expected: All requests complete under 1 second

# Test API endpoints under load
for i in {1..10}; do
  curl -s -o /dev/null -w "%{time_total}\n" https://staging.andrewford.co.nz/api/lastplayed &
done
wait

# Expected: API responses under 3 seconds
```

### 2. Memory and CPU Monitoring

Monitor resource usage during testing:

```bash
# Monitor via Coolify dashboard
# Expected metrics:
# - Memory usage: < 256MB
# - CPU usage: < 50%
# - Response time: < 500ms average
```

## Security Testing

### 1. SSL Certificate Validation

```bash
# Test SSL configuration
openssl s_client -connect staging.andrewford.co.nz:443 -servername staging.andrewford.co.nz

# Expected: Valid Let's Encrypt certificate

# Test SSL grade
curl -s "https://api.ssllabs.com/api/v3/analyze?host=staging.andrewford.co.nz" | jq '.endpoints[0].grade'

# Expected: A or A+ grade
```

### 2. Security Headers Validation

```bash
# Test security headers
curl -I https://staging.andrewford.co.nz/

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 3. CORS Configuration Testing

```bash
# Test CORS preflight request
curl -H "Origin: https://staging.andrewford.co.nz" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS https://staging.andrewford.co.nz/api/chatrag

# Expected: Proper CORS headers in response
```

## Error Handling Testing

### 1. API Error Responses

Test error scenarios:

```bash
# Test invalid API request
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'

# Expected: Proper error response with status code

# Test non-existent endpoint
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/api/nonexistent

# Expected: 404 status code
```

### 2. Graceful Degradation

Test behavior when external APIs are unavailable:

```bash
# Temporarily disable API keys (if possible in staging)
# Test that site still loads without music/video data
# Chatbot should show appropriate error message
```

## Logging and Monitoring Validation

### 1. Log Collection Testing

Verify logs are being collected:

```bash
# Check Coolify logs contain expected entries
# Expected log patterns:
# - Request logs with method, path, status code
# - API response times
# - Error logs for any failures
# - Health check confirmations
```

### 2. Alert Testing

Test monitoring alerts:

```bash
# Temporarily stop the application
# Verify alerts are triggered within expected timeframe
# Restart and confirm recovery alerts
```

## Comparative Testing

### 1. Functionality Parity

Compare staging deployment against current Netlify version:

| Feature               | Netlify (Current) | Coolify (Staging) | Status |
| --------------------- | ----------------- | ----------------- | ------ |
| Homepage load time    | X.Xs              | Y.Ys              | ✅/❌  |
| Last.fm integration   | Working           | Working           | ✅/❌  |
| YouTube integration   | Working           | Working           | ✅/❌  |
| Chatbot functionality | Working           | Working           | ✅/❌  |
| Mobile responsiveness | Working           | Working           | ✅/❌  |
| SEO meta tags         | Present           | Present           | ✅/❌  |

### 2. Performance Comparison

Benchmark key metrics:

```bash
# Time to First Byte (TTFB)
curl -w "TTFB: %{time_starttransfer}s\n" -s -o /dev/null https://staging.andrewford.co.nz/

# Full page load time
curl -w "Total time: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/

# API response times
curl -w "API time: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed
```

## Test Results Documentation

### Test Report Template

```markdown
# Staging Deployment Test Report

**Date**: [Test Date]
**Tester**: [Name]
**Deployment Version**: [Git commit hash]

## Summary

- ✅ Container deployment successful
- ✅ All API endpoints functional
- ✅ Static site serving correctly
- ✅ Performance within acceptable limits
- ❌ [Any issues found]

## Test Results

### Deployment

- Build time: X minutes
- Container startup: X seconds
- Health check: ✅ Passing

### API Tests

- Last.fm endpoint: ✅ Working (Xs response time)
- YouTube endpoint: ✅ Working (Xs response time)
- Chatbot endpoint: ✅ Working (Xs response time)

### Performance

- Homepage load: Xs
- Memory usage: XMB
- CPU usage: X%

### Security

- SSL certificate: ✅ Valid
- Security headers: ✅ Present
- CORS configuration: ✅ Working

## Issues Found

[List any issues with severity and proposed fixes]

## Recommendations

[Any recommendations before production deployment]

## Approval

- [ ] Ready for production deployment
- [ ] Requires fixes before production
```

## Rollback Testing

### 1. Rollback Procedure Validation

Test the rollback process:

```bash
# Test rollback to previous deployment version
# Verify rollback completes successfully
# Confirm application returns to previous state
# Validate all functionality after rollback
```

### 2. Data Consistency

Ensure no data loss during rollback:

```bash
# Verify vector store files remain intact
# Check that any user data is preserved
# Confirm API configurations remain valid
```

## Automation Testing

### 1. Deployment Pipeline

Test automated deployment triggers:

```bash
# Push commit to migrate-from-netlify branch
git add .
git commit -m "test: staging deployment validation"
git push origin migrate-from-netlify

# Verify webhook triggers deployment
# Monitor automatic build and deployment process
# Confirm health checks pass automatically
```

### 2. Monitoring Integration

Validate monitoring automation:

```bash
# Verify uptime monitoring is active
# Confirm alert thresholds are properly configured
# Test notification delivery (email, Slack, etc.)
```

## Sign-off Criteria

Staging deployment is ready for production when:

- [ ] All API endpoints return expected responses
- [ ] Static site loads correctly on desktop and mobile
- [ ] Performance meets or exceeds current Netlify deployment
- [ ] SSL certificate is valid and properly configured
- [ ] Security headers are present and correct
- [ ] Monitoring and alerting are functional
- [ ] Error handling works as expected
- [ ] Load testing shows acceptable performance under stress
- [ ] Rollback procedure has been validated
- [ ] All documentation is complete and accurate

## Next Steps

After successful staging deployment testing:

1. ✅ Document all test results and performance metrics
2. ✅ Address any issues found during testing
3. ✅ Get stakeholder approval for production deployment
4. ✅ Proceed to Task 5.0: Migration and DNS cutover planning
