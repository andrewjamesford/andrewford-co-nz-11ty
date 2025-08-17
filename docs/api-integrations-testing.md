# Last.fm and YouTube API Integrations Testing

This document provides comprehensive testing procedures for validating the Last.fm and YouTube API integrations in the Coolify deployment.

## Overview

The API integrations testing covers:

- **Last.fm API functionality** - Recent tracks retrieval and data formatting
- **YouTube API functionality** - Latest uploads retrieval and channel data
- **API endpoint reliability** - Response consistency and error handling
- **Performance benchmarking** - Response times and caching behavior
- **Data integrity validation** - Correct data structure and content
- **Error scenarios testing** - API failures and rate limiting
- **Integration with frontend** - Data consumption and display

## Last.fm API Integration Testing

### Current Implementation Analysis

Based on `api/routes/lastplayed.js`:

```javascript
// API Endpoint: GET /api/lastplayed
// Retrieves recent tracks for user 'indysonic' from Last.fm
// Returns: Formatted track data with artist, track name, album, URL, and album art
```

**Key Features**:

- Environment variable validation (`LASTFM_API_KEY`)
- Error handling with descriptive messages
- Data structure validation and normalization
- Album artwork extraction (multiple sizes)
- User configuration: `indysonic` (hardcoded)

### 1. Last.fm API Connectivity Testing

#### 1.1 Basic Endpoint Validation

```bash
# Test Last.fm endpoint availability
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/api/lastplayed
# Expected: 200

# Test response time
curl -w "Last.fm Response time: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed
# Expected: < 3 seconds

# Test response format
curl -s https://staging.andrewford.co.nz/api/lastplayed | jq '.'
# Expected: Valid JSON response with track data
```

#### 1.2 Response Structure Validation

```bash
# Test complete response structure
curl -s https://staging.andrewford.co.nz/api/lastplayed | jq 'keys'
# Expected: ["artist", "trackName", "album", "url", "albumArt", "albumArtLarge"]

# Validate individual fields
curl -s https://staging.andrewford.co.nz/api/lastplayed | jq '{
  artist: .artist,
  trackName: .trackName,
  album: .album,
  hasUrl: (.url != ""),
  hasAlbumArt: (.albumArt != "")
}'

# Expected output structure:
{
  "artist": "Artist Name",
  "trackName": "Track Title",
  "album": "Album Name",
  "hasUrl": true,
  "hasAlbumArt": true
}
```

#### 1.3 Data Quality Validation

```bash
# Create Last.fm data quality test
cat > test-lastfm-quality.js << 'EOF'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLastfmQuality() {
  console.log("Last.fm Data Quality Test");
  console.log("========================");

  try {
    const response = await fetch('https://staging.andrewford.co.nz/api/lastplayed');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Data quality checks
    const checks = {
      hasArtist: data.artist && data.artist !== "Unknown Artist",
      hasTrackName: data.trackName && data.trackName !== "Unknown Track",
      hasAlbum: data.album && data.album !== "Unknown Album",
      hasValidUrl: data.url && data.url.startsWith('http'),
      hasAlbumArt: data.albumArt && data.albumArt.startsWith('http'),
      hasLargeAlbumArt: data.albumArtLarge && data.albumArtLarge.startsWith('http')
    };

    console.log("Data Quality Results:");
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${check}: ${passed}`);
    });

    console.log("\nSample Data:");
    console.log(`Artist: ${data.artist}`);
    console.log(`Track: ${data.trackName}`);
    console.log(`Album: ${data.album}`);
    console.log(`URL: ${data.url}`);
    console.log(`Album Art: ${data.albumArt ? 'Available' : 'Missing'}`);

    // Overall quality score
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const qualityScore = (passedChecks / Object.keys(checks).length) * 100;
    console.log(`\nQuality Score: ${qualityScore.toFixed(1)}%`);

  } catch (error) {
    console.error('Last.fm quality test failed:', error.message);
  }
}

testLastfmQuality();
EOF

node test-lastfm-quality.js
```

### 2. YouTube API Integration Testing

### Current Implementation Analysis

Based on `api/routes/latestUploads.js`:

```javascript
// API Endpoint: GET /api/latestUploads
// Retrieves latest 10 videos from specified YouTube channel
// Returns: YouTube API response with video data and metadata
```

**Key Features**:

- Environment variable validation (`YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`)
- YouTube Data API v3 integration
- Video search by channel with date ordering
- Error handling for API failures
- Returns full YouTube API response structure

#### 2.1 Basic Endpoint Validation

```bash
# Test YouTube endpoint availability
curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/api/latestUploads
# Expected: 200

# Test response time
curl -w "YouTube Response time: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/api/latestUploads
# Expected: < 5 seconds

# Test response format
curl -s https://staging.andrewford.co.nz/api/latestUploads | jq '.'
# Expected: Valid JSON response with YouTube video data
```

#### 2.2 Response Structure Validation

```bash
# Test YouTube API response structure
curl -s https://staging.andrewford.co.nz/api/latestUploads | jq 'type'
# Expected: "array"

# Validate first video structure
curl -s https://staging.andrewford.co.nz/api/latestUploads | jq '.[0] | keys'
# Expected: ["etag", "id", "kind", "snippet"]

# Check video data completeness
curl -s https://staging.andrewford.co.nz/api/latestUploads | jq '.[0].snippet | {
  title: .title,
  description: .description[0:100],
  publishedAt: .publishedAt,
  channelTitle: .channelTitle,
  hasThumbnail: (.thumbnails.medium.url != null)
}'
```

#### 2.3 Video Data Quality Validation

```bash
# Create YouTube data quality test
cat > test-youtube-quality.js << 'EOF'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testYoutubeQuality() {
  console.log("YouTube Data Quality Test");
  console.log("========================");

  try {
    const response = await fetch('https://staging.andrewford.co.nz/api/latestUploads');

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const videos = await response.json();

    if (!Array.isArray(videos) || videos.length === 0) {
      throw new Error('No videos returned or invalid format');
    }

    console.log(`Total videos returned: ${videos.length}`);

    // Quality checks for first video
    const video = videos[0];
    const snippet = video.snippet;

    const checks = {
      hasValidId: video.id && video.id.videoId,
      hasTitle: snippet.title && snippet.title.length > 0,
      hasDescription: snippet.description && snippet.description.length > 0,
      hasPublishDate: snippet.publishedAt && new Date(snippet.publishedAt).getTime() > 0,
      hasChannelTitle: snippet.channelTitle && snippet.channelTitle.length > 0,
      hasThumbnails: snippet.thumbnails && snippet.thumbnails.medium,
      hasValidThumbnailUrl: snippet.thumbnails?.medium?.url?.startsWith('http')
    };

    console.log("\nData Quality Results (First Video):");
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${check}: ${passed}`);
    });

    console.log("\nSample Video Data:");
    console.log(`Title: ${snippet.title}`);
    console.log(`Published: ${snippet.publishedAt}`);
    console.log(`Channel: ${snippet.channelTitle}`);
    console.log(`Video ID: ${video.id.videoId}`);
    console.log(`Description: ${snippet.description.substring(0, 100)}...`);

    // Check all videos for basic quality
    const allVideosValid = videos.every(v =>
      v.id && v.id.videoId && v.snippet && v.snippet.title
    );
    console.log(`\nAll videos have valid structure: ${allVideosValid ? '✅' : '❌'}`);

    // Overall quality score
    const passedChecks = Object.values(checks).filter(Boolean).length;
    const qualityScore = (passedChecks / Object.keys(checks).length) * 100;
    console.log(`Quality Score: ${qualityScore.toFixed(1)}%`);

  } catch (error) {
    console.error('YouTube quality test failed:', error.message);
  }
}

testYoutubeQuality();
EOF

node test-youtube-quality.js
```

## 3. Performance and Reliability Testing

### 3.1 Response Time Benchmarking

```bash
# Performance benchmark script
cat > benchmark-apis.sh << 'EOF'
#!/bin/bash

echo "API Performance Benchmark"
echo "========================"

# Test Last.fm performance
echo "Last.fm API Performance:"
for i in {1..5}; do
  time=$(curl -w "%{time_total}" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed)
  echo "Request $i: ${time}s"
done

echo ""

# Test YouTube performance
echo "YouTube API Performance:"
for i in {1..5}; do
  time=$(curl -w "%{time_total}" -s -o /dev/null https://staging.andrewford.co.nz/api/latestUploads)
  echo "Request $i: ${time}s"
done

echo ""

# Concurrent request test
echo "Concurrent Request Test (3 parallel):"
(curl -w "Last.fm: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed &)
(curl -w "YouTube: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/api/latestUploads &)
(curl -w "Health: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/health &)
wait

echo "Benchmark completed"
EOF

chmod +x benchmark-apis.sh
./benchmark-apis.sh
```

### 3.2 Consistency Testing

```bash
# Test response consistency over time
echo "Testing API response consistency..."

# Last.fm consistency test
echo "Last.fm consistency test (3 requests):"
for i in {1..3}; do
  echo "Request $i:"
  curl -s https://staging.andrewford.co.nz/api/lastplayed | jq '{artist: .artist, track: .trackName}'
  sleep 2
done

echo ""

# YouTube consistency test
echo "YouTube consistency test (checking video count):"
for i in {1..3}; do
  count=$(curl -s https://staging.andrewford.co.nz/api/latestUploads | jq 'length')
  echo "Request $i: $count videos"
  sleep 2
done
```

### 3.3 Caching Behavior Analysis

```bash
# Test if APIs implement caching
echo "Analyzing caching behavior..."

# Check response headers for caching
echo "Last.fm response headers:"
curl -I https://staging.andrewford.co.nz/api/lastplayed | grep -i cache

echo "YouTube response headers:"
curl -I https://staging.andrewford.co.nz/api/latestUploads | grep -i cache

# Time multiple requests to detect caching
echo "Timing requests for cache detection:"
time1=$(curl -w "%{time_total}" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed)
time2=$(curl -w "%{time_total}" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed)
echo "Last.fm - First: ${time1}s, Second: ${time2}s"
```

## 4. Error Handling and Edge Cases

### 4.1 Environment Variable Testing

```bash
# Test behavior when environment variables are missing
# (This would require temporary modification of environment)

echo "Testing environment variable handling..."

# Test response when API might be unavailable
curl -s https://staging.andrewford.co.nz/api/lastplayed | jq 'if has("error_description") then .error_description else "success" end'

curl -s https://staging.andrewford.co.nz/api/latestUploads | jq 'if has("error_description") then .error_description else "success" end'
```

### 4.2 API Rate Limiting Testing

```bash
# Test rate limiting behavior
echo "Testing API rate limiting..."

# Rapid requests to test rate limiting
echo "Sending rapid requests to Last.fm endpoint:"
for i in {1..10}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/api/lastplayed)
  echo "Request $i: HTTP $status"
  sleep 0.1
done

echo ""

echo "Sending rapid requests to YouTube endpoint:"
for i in {1..10}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" https://staging.andrewford.co.nz/api/latestUploads)
  echo "Request $i: HTTP $status"
  sleep 0.1
done
```

### 4.3 Network Failure Simulation

```bash
# Test timeout behavior
echo "Testing timeout handling..."

# Test with very short timeout
timeout 1s curl https://staging.andrewford.co.nz/api/lastplayed
timeout_exit_code=$?
echo "Timeout test exit code: $timeout_exit_code"

# Test connection timeout
curl --connect-timeout 1 --max-time 2 https://staging.andrewford.co.nz/api/latestUploads
```

## 5. Data Integration Testing

### 5.1 Frontend Data Consumption

```bash
# Test that frontend can consume API data
echo "Testing frontend data integration..."

# Check if homepage includes music data
curl -s https://staging.andrewford.co.nz/ | grep -i "currently listening\|recently played\|music"

# Check if homepage includes video data
curl -s https://staging.andrewford.co.nz/ | grep -i "latest videos\|youtube\|uploads"

# Validate data embedding
curl -s https://staging.andrewford.co.nz/ | grep -o '"artist":\s*"[^"]*"' | head -1
curl -s https://staging.andrewford.co.nz/ | grep -o '"title":\s*"[^"]*"' | head -1
```

### 5.2 11ty Build Integration Testing

```bash
# Test that 11ty can fetch and process API data during build
echo "Testing 11ty build integration..."

# Check if _data files exist for APIs
ls -la _data/
# Expected: Files like music.js, videos.js or similar

# Test build process with API calls
# (This would be part of the build verification in next task)
echo "API integration with 11ty build will be tested in task 5.5"
```

## 6. Comparative Analysis

### 6.1 Netlify vs Coolify Performance

```bash
# Create performance comparison
cat > compare-api-performance.sh << 'EOF'
#!/bin/bash

echo "API Performance Comparison: Netlify vs Coolify"
echo "=============================================="

# Test current Netlify deployment (if still available)
echo "Testing Netlify (current production):"
netlify_lastfm=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.co.nz/.netlify/functions/lastplayed 2>/dev/null || echo "N/A")
netlify_youtube=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.co.nz/.netlify/functions/latestUploads 2>/dev/null || echo "N/A")

echo "Netlify Last.fm: ${netlify_lastfm}s"
echo "Netlify YouTube: ${netlify_youtube}s"

echo ""

# Test Coolify staging deployment
echo "Testing Coolify (staging):"
coolify_lastfm=$(curl -w "%{time_total}" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed)
coolify_youtube=$(curl -w "%{time_total}" -s -o /dev/null https://staging.andrewford.co.nz/api/latestUploads)

echo "Coolify Last.fm: ${coolify_lastfm}s"
echo "Coolify YouTube: ${coolify_youtube}s"

echo ""

# Calculate improvements (if Netlify data available)
if [ "$netlify_lastfm" != "N/A" ] && [ "$netlify_youtube" != "N/A" ]; then
  python3 -c "
import sys
netlify_lf = $netlify_lastfm
netlify_yt = $netlify_youtube
coolify_lf = $coolify_lastfm
coolify_yt = $coolify_youtube

lf_improvement = ((netlify_lf - coolify_lf) / netlify_lf) * 100 if netlify_lf > 0 else 0
yt_improvement = ((netlify_yt - coolify_yt) / netlify_yt) * 100 if netlify_yt > 0 else 0

print(f'Last.fm performance change: {lf_improvement:.1f}%')
print(f'YouTube performance change: {yt_improvement:.1f}%')
print('Positive = faster on Coolify, Negative = slower on Coolify')
"
else
  echo "Netlify comparison unavailable"
fi
EOF

chmod +x compare-api-performance.sh
./compare-api-performance.sh
```

### 6.2 Feature Parity Check

```bash
# Verify feature parity between Netlify Functions and Express APIs
echo "Feature Parity Verification"
echo "=========================="

# Test Last.fm data structure consistency
echo "Last.fm structure check:"
curl -s https://staging.andrewford.co.nz/api/lastplayed | jq 'keys | sort'

# Test YouTube data structure consistency
echo "YouTube structure check:"
curl -s https://staging.andrewford.co.nz/api/latestUploads | jq '.[0].snippet | keys | sort'

# Validate expected fields are present
echo "Expected field validation:"
lastfm_fields=("artist" "trackName" "album" "url" "albumArt" "albumArtLarge")
for field in "${lastfm_fields[@]}"; do
  present=$(curl -s https://staging.andrewford.co.nz/api/lastplayed | jq "has(\"$field\")")
  echo "Last.fm $field: $present"
done
```

## 7. Security Testing

### 7.1 API Key Security

```bash
# Test that API keys are not exposed
echo "API Key Security Test"
echo "===================="

# Check that API keys are not in responses
curl -s https://staging.andrewford.co.nz/api/lastplayed | grep -i "api.*key\|secret\|token"
curl -s https://staging.andrewford.co.nz/api/latestUploads | grep -i "api.*key\|secret\|token"

# Test error responses don't leak keys
curl -s https://staging.andrewford.co.nz/api/nonexistent | grep -i "api.*key\|secret\|token"

echo "If no output above, API keys are properly secured"
```

### 7.2 Input Validation Testing

```bash
# Test input validation and sanitization
echo "Input Validation Test"
echo "==================="

# Test malicious query parameters (APIs should ignore them)
curl -s -o /dev/null -w "%{http_code}" "https://staging.andrewford.co.nz/api/lastplayed?malicious=<script>"
curl -s -o /dev/null -w "%{http_code}" "https://staging.andrewford.co.nz/api/latestUploads?injection='; DROP TABLE"

# Expected: Should return 200 (parameters ignored) or 400 (rejected)
```

## 8. Automated Testing Suite

### 8.1 Comprehensive API Test Suite

```bash
# Create comprehensive automated test suite
cat > automated-api-tests.js << 'EOF'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class APITestSuite {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async test(name, testFn) {
    console.log(`Running: ${name}`);
    try {
      const startTime = Date.now();
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({name, status: 'PASS', duration});
      console.log(`✅ ${name} (${duration}ms)`);
    } catch (error) {
      this.results.push({name, status: 'FAIL', error: error.message});
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  async testLastfmBasic() {
    const response = await fetch(`${this.baseUrl}/api/lastplayed`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!data.artist || !data.trackName) {
      throw new Error('Missing required fields');
    }
  }

  async testYoutubeBasic() {
    const response = await fetch(`${this.baseUrl}/api/latestUploads`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid response format');
    }
  }

  async testLastfmPerformance() {
    const startTime = Date.now();
    const response = await fetch(`${this.baseUrl}/api/lastplayed`);
    const duration = Date.now() - startTime;

    if (duration > 5000) {
      throw new Error(`Too slow: ${duration}ms`);
    }
  }

  async testYoutubePerformance() {
    const startTime = Date.now();
    const response = await fetch(`${this.baseUrl}/api/latestUploads`);
    const duration = Date.now() - startTime;

    if (duration > 8000) {
      throw new Error(`Too slow: ${duration}ms`);
    }
  }

  async testLastfmDataQuality() {
    const response = await fetch(`${this.baseUrl}/api/lastplayed`);
    const data = await response.json();

    const requiredFields = ['artist', 'trackName', 'album', 'url'];
    for (const field of requiredFields) {
      if (!data[field] || data[field] === `Unknown ${field.charAt(0).toUpperCase() + field.slice(1)}`) {
        throw new Error(`Poor quality data for ${field}`);
      }
    }
  }

  async testYoutubeDataQuality() {
    const response = await fetch(`${this.baseUrl}/api/latestUploads`);
    const data = await response.json();

    if (data.length < 1) {
      throw new Error('No videos returned');
    }

    const video = data[0];
    if (!video.snippet || !video.snippet.title || !video.id.videoId) {
      throw new Error('Invalid video data structure');
    }
  }

  async runAllTests() {
    console.log('API Integration Test Suite');
    console.log('=========================');

    await this.test('Last.fm Basic Functionality', () => this.testLastfmBasic());
    await this.test('YouTube Basic Functionality', () => this.testYoutubeBasic());
    await this.test('Last.fm Performance', () => this.testLastfmPerformance());
    await this.test('YouTube Performance', () => this.testYoutubePerformance());
    await this.test('Last.fm Data Quality', () => this.testLastfmDataQuality());
    await this.test('YouTube Data Quality', () => this.testYoutubeDataQuality());

    this.printSummary();
  }

  printSummary() {
    console.log('\nTest Summary');
    console.log('============');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;

    console.log(`Total tests: ${this.results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failed > 0) {
      console.log('\nFailures:');
      this.results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`- ${r.name}: ${r.error}`);
      });
    }

    const successRate = (passed / this.results.length) * 100;
    console.log(`\nSuccess Rate: ${successRate.toFixed(1)}%`);

    if (successRate >= 90) {
      console.log('🎉 APIs are ready for production!');
    } else if (successRate >= 70) {
      console.log('⚠️  APIs need some improvements');
    } else {
      console.log('❌ APIs have significant issues');
    }
  }
}

// Run the test suite
const tester = new APITestSuite('https://staging.andrewford.co.nz');
tester.runAllTests().catch(console.error);
EOF

node automated-api-tests.js
```

## 9. Production Readiness Assessment

### 9.1 API Integration Checklist

The API integrations are ready for production when:

**Critical (Must Pass)**:

- [ ] Last.fm endpoint returns 200 status code consistently
- [ ] YouTube endpoint returns 200 status code consistently
- [ ] Both APIs return well-formatted data structures
- [ ] Response times are under acceptable limits (Last.fm <5s, YouTube <8s)
- [ ] Environment variables are properly configured
- [ ] Error handling works for API failures

**Important (Should Pass)**:

- [ ] Data quality meets expected standards (no "Unknown" values)
- [ ] APIs handle concurrent requests properly
- [ ] Rate limiting is handled gracefully
- [ ] Frontend can consume API data correctly
- [ ] Performance matches or exceeds Netlify Functions

**Nice to Have (May Pass)**:

- [ ] Caching is implemented for better performance
- [ ] Monitoring and alerting for API health
- [ ] Graceful degradation when APIs are unavailable
- [ ] Advanced error recovery mechanisms

### 9.2 Performance Benchmarks

| API                 | Target Response Time | Staging Result | Status |
| ------------------- | -------------------- | -------------- | ------ |
| Last.fm             | <5 seconds           | [X]s           | ✅/❌  |
| YouTube             | <8 seconds           | [X]s           | ✅/❌  |
| Concurrent requests | All complete <10s    | [X]s           | ✅/❌  |
| Error rate          | <1%                  | [X]%           | ✅/❌  |

## 10. Troubleshooting Guide

### Common API Issues

| Issue          | Symptoms                      | Likely Cause                  | Solution                         |
| -------------- | ----------------------------- | ----------------------------- | -------------------------------- |
| 500 errors     | API returns error_description | Missing environment variables | Check Coolify environment config |
| Slow responses | >10s response time            | External API latency          | Monitor third-party API status   |
| Empty data     | Valid response but no content | API rate limiting             | Check API quotas and limits      |
| CORS errors    | Frontend can't access APIs    | CORS misconfiguration         | Verify ALLOWED_ORIGINS setting   |
| Invalid data   | Malformed or incomplete data  | API response changes          | Update data parsing logic        |

### Debug Commands

```bash
# Check API health
curl -s https://staging.andrewford.co.nz/health | jq '.apis'

# Test individual APIs
curl -v https://staging.andrewford.co.nz/api/lastplayed
curl -v https://staging.andrewford.co.nz/api/latestUploads

# Monitor API performance
watch -n 30 'curl -w "Last.fm: %{time_total}s, YouTube: %{time_total}s\n" -s -o /dev/null https://staging.andrewford.co.nz/api/lastplayed https://staging.andrewford.co.nz/api/latestUploads'

# Check environment variables (in Coolify dashboard)
# Verify LASTFM_API_KEY, YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID are set
```

## Next Steps

After completing API integrations testing:

1. ✅ Document all test results and performance metrics
2. ✅ Address any critical API issues found
3. ✅ Validate frontend integration works correctly
4. ✅ Proceed to 11ty build process verification (Task 5.5)
5. ✅ Ensure APIs are ready for production traffic
