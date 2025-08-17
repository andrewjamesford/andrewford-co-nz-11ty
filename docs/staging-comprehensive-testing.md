# Comprehensive Staging Environment Testing

This document provides a systematic testing plan to validate all functionality in the staging environment before production deployment.

## Overview

The comprehensive testing covers:

- **Full application functionality** across all features
- **Cross-browser compatibility** testing
- **Mobile responsiveness** validation
- **Performance benchmarking** against current Netlify deployment
- **Security and accessibility** compliance
- **API integration robustness** testing
- **User journey validation** end-to-end

## Testing Environment Setup

### Prerequisites

- ✅ Staging environment deployed to `staging.andrewford.co.nz`
- ✅ All environment variables configured
- ✅ SSL certificate issued and valid
- ✅ Health checks passing
- ✅ DNS records configured correctly

### Testing Tools Setup

```bash
# Install testing dependencies
npm install -g lighthouse
npm install -g pa11y
curl -L https://github.com/mozilla/geckodriver/releases/download/v0.33.0/geckodriver-v0.33.0-linux64.tar.gz | tar xz

# Performance testing tools
npm install -g @lhci/cli
```

## 1. Core Functionality Testing

### 1.1 Homepage Validation

Test the main landing page functionality:

```bash
# Basic connectivity test
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/
# Expected: 200

# Response time test
curl -w "Total: %{time_total}s, DNS: %{time_namelookup}s, Connect: %{time_connect}s, TTFB: %{time_starttransfer}s\n" -s -o /dev/null https://staging.andrewford.co.nz/

# Content validation
curl -s https://staging.andrewford.co.nz/ | grep -i "andrew ford"
# Expected: Should find content about Andrew Ford

# Meta tags validation
curl -s https://staging.andrewford.co.nz/ | grep -E "<title>|<meta.*description|<meta.*viewport"
# Expected: Proper meta tags present
```

### 1.2 Navigation Testing

Test all navigation elements:

```bash
# Test main navigation links
for path in "/" "/about/" "/articles/" "/contact/"; do
  echo "Testing: $path"
  curl -s -o /dev/null -w "%{http_code}" "https://staging.andrewford.co.nz$path"
done
# Expected: All return 200

# Test article pages (sample)
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/articles/sample-article/
# Expected: 200 or 404 if no articles yet

# Test 404 handling
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/non-existent-page/
# Expected: 404
```

### 1.3 Static Asset Loading

Validate all static assets load correctly:

```bash
# Test CSS files
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/styles/main.css
# Expected: 200

# Test JavaScript files
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/scripts/main.js
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/scripts/chat.js
# Expected: 200 for both

# Test images
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/images/logo.png
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/favicon.ico
# Expected: 200 for both

# Test font files (if any)
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/fonts/
# Expected: 200 or 404 if no custom fonts
```

## 2. API Integration Testing

### 2.1 Health Check Validation

```bash
# Comprehensive health check
curl -s https://staging.andrewford.co.nz/health | jq '.'

# Expected response structure:
{
  "status": "healthy",
  "timestamp": "2024-01-17T10:00:00.000Z",
  "environment": "staging",
  "uptime": 300,
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
```

### 2.2 Last.fm API Integration

Test music data retrieval:

```bash
# Test Last.fm endpoint
curl -s https://staging.andrewford.co.nz/api/lastplayed | jq '.'

# Validate response structure
curl -s https://staging.andrewford.co.nz/api/lastplayed | jq '.recenttracks.track[0] | {name: .name, artist: .artist["#text"], date: .date.uts}'

# Test response time
curl -w "API Response time: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed
# Expected: < 3 seconds

# Test error handling (simulate API failure)
# Temporarily modify API key if possible and test graceful degradation
```

### 2.3 YouTube API Integration

Test video feed retrieval:

```bash
# Test YouTube endpoint
curl -s https://staging.andrewford.co.nz/api/latestUploads | jq '.'

# Validate response structure
curl -s https://staging.andrewford.co.nz/api/latestUploads | jq '.items[0] | {title: .snippet.title, videoId: .id.videoId, publishedAt: .snippet.publishedAt}'

# Test response time
curl -w "API Response time: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/api/latestUploads
# Expected: < 5 seconds

# Test multiple requests for consistency
for i in {1..3}; do
  echo "Request $i:"
  curl -s https://staging.andrewford.co.nz/api/latestUploads | jq '.items | length'
done
# Expected: Consistent results
```

### 2.4 RAG Chatbot Integration

Test AI chatbot functionality:

```bash
# Test basic chatbot query
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is this blog about?",
    "conversationHistory": []
  }' | head -20

# Test technical query
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I set up Docker?",
    "conversationHistory": []
  }' | head -20

# Test conversation context
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me more about that",
    "conversationHistory": [
      {"role": "user", "content": "What is Docker?"},
      {"role": "assistant", "content": "Docker is a containerization platform..."}
    ]
  }' | head -20

# Test response time
curl -w "Chatbot Response time: %{time_total}s\n" -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{"message": "Quick test", "conversationHistory": []}' \
  -s -o /dev/null
# Expected: < 10 seconds
```

## 3. Frontend Integration Testing

### 3.1 Music Widget Integration

Test Last.fm integration in the frontend:

```bash
# Check if music data is embedded in homepage
curl -s https://staging.andrewford.co.nz/ | grep -i "currently listening\|recently played"
# Expected: Should find music widget content

# Validate data structure in page
curl -s https://staging.andrewford.co.nz/ | grep -o '"track":\s*{[^}]*}' | head -1
# Expected: Should find track data structure
```

### 3.2 Video Feed Integration

Test YouTube integration in the frontend:

```bash
# Check if video data is embedded in homepage
curl -s https://staging.andrewford.co.nz/ | grep -i "latest videos\|youtube"
# Expected: Should find video content

# Validate video thumbnails and links
curl -s https://staging.andrewford.co.nz/ | grep -o 'youtube\.com/watch?v=[a-zA-Z0-9_-]*' | head -3
# Expected: Should find YouTube video links
```

### 3.3 Chatbot Interface Testing

Test chatbot UI integration:

```bash
# Check if chatbot interface is present
curl -s https://staging.andrewford.co.nz/ | grep -i "chat\|ask\|assistant"
# Expected: Should find chatbot interface elements

# Validate chat JavaScript is loaded
curl -s https://staging.andrewford.co.nz/scripts/chat.js | grep -i "api/chatrag"
# Expected: Should find API endpoint reference

# Test chat form elements
curl -s https://staging.andrewford.co.nz/ | grep -E '<input.*chat|<textarea.*chat|<button.*chat'
# Expected: Should find chat form elements
```

## 4. Cross-Browser Compatibility Testing

### 4.1 Browser Testing Matrix

Test across major browsers (manual testing required):

| Browser | Version | Desktop | Mobile | Status |
| ------- | ------- | ------- | ------ | ------ |
| Chrome  | Latest  | ✅      | ✅     |        |
| Firefox | Latest  | ✅      | ✅     |        |
| Safari  | Latest  | ✅      | ✅     |        |
| Edge    | Latest  | ✅      | ✅     |        |

### 4.2 Automated Browser Testing Script

```bash
# Create browser testing script
cat > test-browsers.js << 'EOF'
const puppeteer = require('puppeteer');

async function testBrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Test homepage load
  await page.goto('https://staging.andrewford.co.nz/');
  const title = await page.title();
  console.log('Page title:', title);

  // Test navigation
  await page.click('a[href="/about/"]');
  await page.waitForNavigation();
  const aboutTitle = await page.title();
  console.log('About page title:', aboutTitle);

  // Test chatbot (if interactive)
  try {
    await page.click('#chat-button');
    await page.type('#chat-input', 'Test message');
    await page.click('#chat-send');
    console.log('Chatbot interaction successful');
  } catch (error) {
    console.log('Chatbot test skipped:', error.message);
  }

  await browser.close();
}

testBrowser().catch(console.error);
EOF

# Run browser test (if Node.js available)
node test-browsers.js
```

## 5. Mobile Responsiveness Testing

### 5.1 Viewport Testing

```bash
# Test mobile viewport meta tag
curl -s https://staging.andrewford.co.nz/ | grep -o '<meta name="viewport"[^>]*>'
# Expected: <meta name="viewport" content="width=device-width, initial-scale=1">

# Test responsive images
curl -s https://staging.andrewford.co.nz/ | grep -E 'srcset=|sizes='
# Expected: Should find responsive image attributes
```

### 5.2 Mobile Performance Testing

```bash
# Test mobile page speed with Lighthouse
lighthouse https://staging.andrewford.co.nz/ --chrome-flags="--headless" --output=json --output-path=./mobile-lighthouse.json --form-factor=mobile

# Extract key metrics
cat mobile-lighthouse.json | jq '.audits["first-contentful-paint"].displayValue'
cat mobile-lighthouse.json | jq '.audits["largest-contentful-paint"].displayValue'
cat mobile-lighthouse.json | jq '.audits["cumulative-layout-shift"].displayValue'
```

## 6. Performance Testing

### 6.1 Load Testing

```bash
# Simple load test
echo "Starting load test..."
for i in {1..50}; do
  curl -s -o /dev/null -w "%{time_total}\n" https://staging.andrewford.co.nz/ &
done
wait

# API load testing
echo "Testing API endpoints under load..."
for i in {1..20}; do
  curl -s -o /dev/null -w "%{time_total}\n" https://staging.andrewford.co.nz/api/lastplayed &
done
wait
```

### 6.2 Performance Benchmarking

```bash
# Lighthouse performance audit
lighthouse https://staging.andrewford.co.nz/ --output=json --output-path=./performance-audit.json

# Extract performance score
cat performance-audit.json | jq '.categories.performance.score * 100'

# Extract Core Web Vitals
echo "Core Web Vitals:"
cat performance-audit.json | jq '.audits["first-contentful-paint"].displayValue'
cat performance-audit.json | jq '.audits["largest-contentful-paint"].displayValue'
cat performance-audit.json | jq '.audits["cumulative-layout-shift"].displayValue'
cat performance-audit.json | jq '.audits["total-blocking-time"].displayValue'
```

### 6.3 Resource Usage Monitoring

```bash
# Monitor during testing
echo "Monitoring resource usage..."

# Check memory usage over time
for i in {1..10}; do
  curl -s https://staging.andrewford.co.nz/health | jq '.memory.percentage'
  sleep 30
done

# Expected: Memory usage should remain stable under 80%
```

## 7. Security Testing

### 7.1 SSL Certificate Validation

```bash
# Test SSL configuration
echo | openssl s_client -connect staging.andrewford.co.nz:443 -servername staging.andrewford.co.nz 2>/dev/null | openssl x509 -noout -text | grep -E "(Issuer|Subject|Not After)"

# Test SSL security grade
curl -s "https://api.ssllabs.com/api/v3/analyze?host=staging.andrewford.co.nz&publish=off&startNew=on&all=done"
```

### 7.2 Security Headers Testing

```bash
# Test security headers
curl -I https://staging.andrewford.co.nz/ | grep -E "(X-Content-Type-Options|X-Frame-Options|X-XSS-Protection|Strict-Transport-Security)"

# Expected headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 7.3 CORS Testing

```bash
# Test CORS preflight
curl -H "Origin: https://staging.andrewford.co.nz" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://staging.andrewford.co.nz/api/chatrag

# Test CORS with invalid origin
curl -H "Origin: https://malicious-site.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://staging.andrewford.co.nz/api/chatrag
# Expected: Should reject invalid origins
```

## 8. Accessibility Testing

### 8.1 Automated Accessibility Testing

```bash
# Install pa11y for accessibility testing
npm install -g pa11y

# Run accessibility audit
pa11y https://staging.andrewford.co.nz/ --reporter json > accessibility-report.json

# Check for issues
cat accessibility-report.json | jq '.issues | length'
cat accessibility-report.json | jq '.issues[] | {type: .type, message: .message}'
```

### 8.2 Keyboard Navigation Testing

Manual testing checklist:

- [ ] Tab navigation works through all interactive elements
- [ ] Focus indicators are visible
- [ ] Skip links are present and functional
- [ ] All buttons and links are keyboard accessible
- [ ] Chat interface is keyboard navigable

## 9. SEO and Content Testing

### 9.1 SEO Validation

```bash
# Test meta descriptions
curl -s https://staging.andrewford.co.nz/ | grep -o '<meta name="description" content="[^"]*">'

# Test structured data
curl -s https://staging.andrewford.co.nz/ | grep -o '<script type="application/ld+json">[^<]*</script>'

# Test heading structure
curl -s https://staging.andrewford.co.nz/ | grep -oE '<h[1-6][^>]*>.*?</h[1-6]>' | head -10
```

### 9.2 Content Validation

```bash
# Test for broken internal links
curl -s https://staging.andrewford.co.nz/ | grep -oE 'href="[^"]*"' | grep -E "^href=\"/" | while read link; do
  url=$(echo $link | sed 's/href="//; s/"//')
  response=$(curl -s -o /dev/null -w "%{http_code}" "https://staging.andrewford.co.nz$url")
  echo "$url: $response"
done
```

## 10. Error Handling Testing

### 10.1 API Error Scenarios

```bash
# Test invalid API requests
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{"invalid": "request"}'
# Expected: Proper error response

# Test rate limiting (if implemented)
for i in {1..100}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://staging.andrewford.co.nz/api/lastplayed
done | sort | uniq -c
# Monitor for any rate limiting responses

# Test large request payload
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"$(python3 -c 'print("x" * 10000)')\"}"
# Expected: Should handle large requests gracefully
```

### 10.2 Network Failure Simulation

```bash
# Test timeout scenarios (manual configuration needed)
# - Configure firewall to block external API calls temporarily
# - Verify application degrades gracefully
# - Confirm error messages are user-friendly
```

## 11. User Journey Testing

### 11.1 Complete User Workflows

Test end-to-end user scenarios:

1. **New Visitor Journey**:

   ```bash
   # Land on homepage
   curl -s https://staging.andrewford.co.nz/ | grep -i "welcome\|intro\|about"

   # Navigate to about page
   curl -s https://staging.andrewford.co.nz/about/ | grep -i "andrew\|bio\|background"

   # View articles
   curl -s https://staging.andrewford.co.nz/articles/ | grep -i "post\|article\|blog"
   ```

2. **Content Consumer Journey**:

   ```bash
   # Check music updates
   curl -s https://staging.andrewford.co.nz/api/lastplayed | jq '.recenttracks.track[0].name'

   # Check video updates
   curl -s https://staging.andrewford.co.nz/api/latestUploads | jq '.items[0].snippet.title'

   # Interact with chatbot
   curl -X POST https://staging.andrewford.co.nz/api/chatrag \
     -H "Content-Type: application/json" \
     -d '{"message": "What are your latest projects?", "conversationHistory": []}'
   ```

3. **Technical Visitor Journey**:

   ```bash
   # Search for technical content
   curl -X POST https://staging.andrewford.co.nz/api/chatrag \
     -H "Content-Type: application/json" \
     -d '{"message": "Show me Docker tutorials", "conversationHistory": []}'

   # View technical articles
   curl -s https://staging.andrewford.co.nz/ | grep -i "docker\|kubernetes\|devops"
   ```

## 12. Comparative Analysis

### 12.1 Performance Comparison

Compare staging vs. current Netlify deployment:

```bash
# Create comparison script
cat > compare-performance.sh << 'EOF'
#!/bin/bash

echo "=== Performance Comparison ==="
echo "Testing Netlify (current):"
netlify_time=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.co.nz/)
echo "Netlify response time: ${netlify_time}s"

echo "Testing Coolify (staging):"
coolify_time=$(curl -w "%{time_total}" -s -o /dev/null https://staging.andrewford.co.nz/)
echo "Coolify response time: ${coolify_time}s"

# Calculate difference
python3 -c "
netlify = $netlify_time
coolify = $coolify_time
diff = ((coolify - netlify) / netlify) * 100
print(f'Performance difference: {diff:.1f}%')
print('Faster' if diff < 0 else 'Slower')
"
EOF

chmod +x compare-performance.sh
./compare-performance.sh
```

### 12.2 Feature Parity Check

```bash
# Create feature comparison matrix
cat > feature-comparison.md << 'EOF'
# Feature Parity Comparison

| Feature | Netlify (Current) | Coolify (Staging) | Status |
|---------|-------------------|-------------------|---------|
| Homepage load | ✅ | ✅ | ✅ |
| Last.fm integration | ✅ | ✅ | ✅ |
| YouTube integration | ✅ | ✅ | ✅ |
| Chatbot functionality | ✅ | ✅ | ✅ |
| Mobile responsiveness | ✅ | ✅ | ✅ |
| SSL certificate | ✅ | ✅ | ✅ |
| SEO optimization | ✅ | ✅ | ✅ |
| Performance | ✅ | ✅ | ✅ |
EOF
```

## 13. Test Result Documentation

### 13.1 Test Report Template

```bash
# Generate comprehensive test report
cat > staging-test-report.md << 'EOF'
# Staging Environment Test Report

**Date**: $(date)
**Environment**: staging.andrewford.co.nz
**Tester**: [Name]
**Duration**: [X hours]

## Executive Summary
- Overall Status: ✅ PASS / ❌ FAIL
- Critical Issues: [Number]
- Performance: [Acceptable/Needs Improvement]
- Recommendation: [Ready for Production/Needs Fixes]

## Test Results Summary

### Core Functionality
- [ ] Homepage loading: ✅ PASS / ❌ FAIL
- [ ] Navigation: ✅ PASS / ❌ FAIL
- [ ] Static assets: ✅ PASS / ❌ FAIL

### API Integration
- [ ] Health checks: ✅ PASS / ❌ FAIL
- [ ] Last.fm API: ✅ PASS / ❌ FAIL
- [ ] YouTube API: ✅ PASS / ❌ FAIL
- [ ] Chatbot API: ✅ PASS / ❌ FAIL

### Performance
- [ ] Load time: [X]s (Target: <2s)
- [ ] API response time: [X]s (Target: <3s)
- [ ] Mobile performance: [Score]/100

### Security
- [ ] SSL certificate: ✅ PASS / ❌ FAIL
- [ ] Security headers: ✅ PASS / ❌ FAIL
- [ ] CORS configuration: ✅ PASS / ❌ FAIL

### Compatibility
- [ ] Desktop browsers: ✅ PASS / ❌ FAIL
- [ ] Mobile browsers: ✅ PASS / ❌ FAIL
- [ ] Accessibility: ✅ PASS / ❌ FAIL

## Issues Found
[List any issues with priority and impact]

## Performance Metrics
- Homepage load time: [X]s
- API response times: Last.fm [X]s, YouTube [X]s, Chatbot [X]s
- Memory usage: [X]MB
- Lighthouse score: [X]/100

## Recommendations
[Specific recommendations for improvement]

## Sign-off
- [ ] Ready for production deployment
- [ ] Requires minor fixes
- [ ] Requires major fixes
EOF
```

## 14. Automated Testing Pipeline

### 14.1 Continuous Testing Script

```bash
# Create automated testing pipeline
cat > automated-staging-tests.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting comprehensive staging tests..."

# Health check
echo "1. Health Check Test"
health_status=$(curl -s https://staging.andrewford.co.nz/health | jq -r '.status')
if [ "$health_status" == "healthy" ]; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed: $health_status"
  exit 1
fi

# API tests
echo "2. API Integration Tests"
lastfm_status=$(curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/api/lastplayed)
youtube_status=$(curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/api/latestUploads)

if [ "$lastfm_status" == "200" ] && [ "$youtube_status" == "200" ]; then
  echo "✅ API tests passed"
else
  echo "❌ API tests failed: Last.fm $lastfm_status, YouTube $youtube_status"
  exit 1
fi

# Performance test
echo "3. Performance Test"
response_time=$(curl -w "%{time_total}" -s -o /dev/null https://staging.andrewford.co.nz/)
if (( $(echo "$response_time < 3.0" | bc -l) )); then
  echo "✅ Performance test passed: ${response_time}s"
else
  echo "❌ Performance test failed: ${response_time}s (>3s)"
fi

# Security test
echo "4. Security Test"
ssl_status=$(echo | openssl s_client -connect staging.andrewford.co.nz:443 -servername staging.andrewford.co.nz 2>/dev/null | grep -c "Verify return code: 0")
if [ "$ssl_status" -eq 1 ]; then
  echo "✅ SSL test passed"
else
  echo "❌ SSL test failed"
fi

echo "🎉 All tests completed!"
EOF

chmod +x automated-staging-tests.sh
```

## 15. Go/No-Go Decision Criteria

### 15.1 Production Readiness Checklist

The staging environment is ready for production when:

**Critical (Must Pass)**:

- [ ] All health checks return "healthy" status
- [ ] All API endpoints respond with 200 status codes
- [ ] Homepage loads in under 3 seconds
- [ ] SSL certificate is valid and properly configured
- [ ] No critical security vulnerabilities found
- [ ] All core functionality works as expected

**Important (Should Pass)**:

- [ ] Performance meets or exceeds current Netlify deployment
- [ ] Mobile responsiveness is maintained
- [ ] SEO meta tags are correct
- [ ] Accessibility standards are met
- [ ] Cross-browser compatibility confirmed

**Nice to Have (May Pass)**:

- [ ] Lighthouse performance score >90
- [ ] Zero accessibility violations
- [ ] All minor UI improvements implemented

### 15.2 Decision Matrix

| Category        | Weight | Score (1-5) | Weighted Score |
| --------------- | ------ | ----------- | -------------- |
| Functionality   | 30%    | [X]         | [X]            |
| Performance     | 25%    | [X]         | [X]            |
| Security        | 20%    | [X]         | [X]            |
| Compatibility   | 15%    | [X]         | [X]            |
| User Experience | 10%    | [X]         | [X]            |
| **Total**       | 100%   |             | **[X]/5**      |

**Decision Threshold**: Score ≥4.0 = Ready for Production

## Next Steps

After completing comprehensive staging testing:

1. ✅ Document all test results and performance metrics
2. ✅ Address any critical issues found
3. ✅ Get stakeholder approval for findings
4. ✅ Proceed to individual API validation (Tasks 5.3-5.5)
5. ✅ Create production rollback plan (Task 5.6)
