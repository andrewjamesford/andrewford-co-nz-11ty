# 11ty Build Process Verification with Containerized APIs

This document provides comprehensive testing procedures to verify that the 11ty build process works correctly with containerized APIs in the Coolify deployment.

## Overview

The 11ty build verification covers:

- **Static site generation** with API data integration
- **Build-time API calls** through `_data` files
- **Container build process** validation in multi-stage Docker setup
- **API server integration** for runtime API calls
- **Caching behavior** during build and runtime
- **Performance optimization** for build and serve phases
- **Production deployment** validation

## Current Architecture Analysis

### Build Process Architecture

Based on the current setup:

```javascript
// Static Site Generation (11ty)
// ├── Content files (content/**/*.md)
// ├── Templates (_includes/**/*.njk)
// ├── Data files (_data/**/*.mjs)
// │   ├── latestMusic.mjs - Fetches /api/lastplayed
// │   └── latestVideos.mjs - Fetches /api/latestUploads
// └── Output (_site/**)

// API Server (Express.js)
// ├── Health endpoint (/health)
// ├── Last.fm API (/api/lastplayed)
// ├── YouTube API (/api/latestUploads)
// └── RAG Chatbot (/api/chatrag)
```

### Key Components

1. **11ty Data Files**: `_data/latestMusic.mjs` and `_data/latestVideos.mjs`
2. **API Integration**: Uses `@11ty/eleventy-fetch` for caching
3. **Container Setup**: Multi-stage Docker build with separate build/runtime
4. **Environment Variables**: `API_URL` for build-time API calls

## 1. Data File Integration Testing

### 1.1 Local Build Testing

First, test the build process locally with API server running:

```bash
# Start API server in background
npm run api:dev &
API_PID=$!

# Wait for API to start
sleep 5

# Test API availability
curl -s http://localhost:3080/health | jq '.status'
# Expected: "healthy"

# Run 11ty build with local API
API_URL=http://localhost:3080 npm run build

# Check build output
ls -la _site/
echo "Build completed with exit code: $?"

# Stop API server
kill $API_PID
```

### 1.2 Data File Validation

Test that data files correctly fetch and cache API responses:

```bash
# Create data file test script
cat > test-data-files.js << 'EOF'
import dotenv from 'dotenv';
dotenv.config();

// Set environment for testing
process.env.API_URL = 'http://localhost:3080';

// Import data files
const latestMusic = (await import('./_data/latestMusic.mjs')).default;
const latestVideos = (await import('./_data/latestVideos.mjs')).default;

console.log('Testing _data files integration...');

// Test music data
try {
  console.log('\n1. Testing latestMusic.mjs:');
  const musicData = await latestMusic();
  console.log('✅ Music data structure:', Object.keys(musicData));
  console.log('✅ Music details:', {
    artist: musicData.music.artist,
    track: musicData.music.trackName,
    album: musicData.music.album
  });
} catch (error) {
  console.log('❌ Music data error:', error.message);
}

// Test video data
try {
  console.log('\n2. Testing latestVideos.mjs:');
  const videoData = await latestVideos();
  console.log('✅ Video data structure:', Object.keys(videoData));
  console.log('✅ Video count:', videoData.videos.length);
  if (videoData.videos.length > 0) {
    console.log('✅ First video:', {
      title: videoData.videos[0].snippet.title,
      published: videoData.videos[0].snippet.publishedAt
    });
  }
} catch (error) {
  console.log('❌ Video data error:', error.message);
}

console.log('\nData file testing completed');
EOF

# Run with API server
npm run api:dev &
API_PID=$!
sleep 5

node test-data-files.js

kill $API_PID
```

### 1.3 EleventyFetch Caching Validation

Test that `@11ty/eleventy-fetch` caching works correctly:

```bash
# Test caching behavior
cat > test-cache-behavior.js << 'EOF'
import EleventyFetch from "@11ty/eleventy-fetch";

async function testCaching() {
  console.log('Testing EleventyFetch caching behavior...');

  const baseUrl = 'http://localhost:3080';

  // First request - should be cached
  console.log('\n1. First request (should cache):');
  const start1 = Date.now();
  const data1 = await EleventyFetch(`${baseUrl}/api/lastplayed`, {
    duration: "1h",
    type: "json",
    directory: "/tmp/.cache/test/",
    verbose: true
  });
  const time1 = Date.now() - start1;
  console.log(`✅ First request time: ${time1}ms`);
  console.log(`✅ Data: ${data1.artist} - ${data1.trackName}`);

  // Second request - should be from cache
  console.log('\n2. Second request (should be cached):');
  const start2 = Date.now();
  const data2 = await EleventyFetch(`${baseUrl}/api/lastplayed`, {
    duration: "1h",
    type: "json",
    directory: "/tmp/.cache/test/",
    verbose: true
  });
  const time2 = Date.now() - start2;
  console.log(`✅ Second request time: ${time2}ms`);
  console.log(`✅ Data: ${data2.artist} - ${data2.trackName}`);

  if (time2 < time1 / 2) {
    console.log('✅ Caching working correctly (second request much faster)');
  } else {
    console.log('⚠️  Caching may not be working as expected');
  }
}

testCaching().catch(console.error);
EOF

# Run caching test
npm run api:dev &
API_PID=$!
sleep 5

node test-cache-behavior.js

kill $API_PID
```

## 2. Container Build Process Testing

### 2.1 Multi-Stage Build Validation

Test the Docker multi-stage build process:

```bash
# Clean any existing builds
rm -rf _site
docker system prune -f

# Test Docker build process
echo "Testing Docker multi-stage build..."

# Build the container
docker build -t andrewford-blog-test . --no-cache

# Check build success
if [ $? -eq 0 ]; then
  echo "✅ Docker build successful"
else
  echo "❌ Docker build failed"
  exit 1
fi

# Inspect build artifacts
echo "Build inspection:"
docker run --rm andrewford-blog-test ls -la _site/ | head -10
docker run --rm andrewford-blog-test ls -la api/
docker run --rm andrewford-blog-test ls -la vector_store/
```

### 2.2 Build Environment Variables Testing

Test that build-time environment variables work correctly:

```bash
# Test build with different API_URL values
echo "Testing build with staging API URL..."

# Build with staging API URL
docker build -t andrewford-blog-staging . \
  --build-arg API_URL=https://staging.andrewford.co.nz \
  --build-arg NODE_ENV=staging

# Verify the build includes data from staging APIs
docker run --rm andrewford-blog-staging cat _site/index.html | grep -i "artist\|video" | head -5
```

### 2.3 Build Performance Analysis

Analyze build performance and optimization:

```bash
# Create build performance test
cat > test-build-performance.sh << 'EOF'
#!/bin/bash

echo "11ty Build Performance Analysis"
echo "=============================="

# Test local build performance
echo "1. Local build performance:"
start_time=$(date +%s)
npm run build > build.log 2>&1
end_time=$(date +%s)
local_build_time=$((end_time - start_time))

echo "Local build time: ${local_build_time}s"
echo "Build log size: $(wc -l < build.log) lines"

# Check for build warnings/errors
if grep -i "error\|warning" build.log; then
  echo "⚠️  Build warnings/errors found"
else
  echo "✅ Clean build - no warnings/errors"
fi

# Analyze output size
echo ""
echo "2. Build output analysis:"
echo "Total _site size: $(du -sh _site | cut -f1)"
echo "HTML files: $(find _site -name "*.html" | wc -l)"
echo "CSS files: $(find _site -name "*.css" | wc -l)"
echo "JS files: $(find _site -name "*.js" | wc -l)"
echo "Image files: $(find _site -name "*.jpg" -o -name "*.png" -o -name "*.webp" | wc -l)"

# Check for API data integration
echo ""
echo "3. API data integration check:"
if grep -r "artist\|trackName" _site/index.html > /dev/null; then
  echo "✅ Music data found in built site"
else
  echo "❌ Music data missing from built site"
fi

if grep -r "youtube\|video" _site/index.html > /dev/null; then
  echo "✅ Video data found in built site"
else
  echo "❌ Video data missing from built site"
fi

# Performance recommendations
echo ""
echo "4. Performance recommendations:"
large_files=$(find _site -type f -size +100k -exec ls -lh {} \; | awk '{print $5, $9}')
if [ -n "$large_files" ]; then
  echo "Large files (>100KB) found:"
  echo "$large_files"
else
  echo "✅ No large files found"
fi
EOF

chmod +x test-build-performance.sh

# Start API server and run performance test
npm run api:dev &
API_PID=$!
sleep 5

./test-build-performance.sh

kill $API_PID
```

## 3. Production Build Testing

### 3.1 Production Environment Simulation

Test build process in production-like environment:

```bash
# Create production build test
cat > test-production-build.sh << 'EOF'
#!/bin/bash

echo "Production Build Test"
echo "===================="

# Set production environment variables
export NODE_ENV=production
export API_URL=https://staging.andrewford.co.nz
export SITE_URL=https://staging.andrewford.co.nz

# Clean previous builds
rm -rf _site
rm -rf /tmp/.cache

echo "1. Running production build..."
start_time=$(date +%s)
npm run build
end_time=$(date +%s)
build_time=$((end_time - start_time))

echo "Production build time: ${build_time}s"

# Validate production optimizations
echo ""
echo "2. Validating production optimizations:"

# Check for minification
if grep -r "console\.log" _site/ | grep -v "\.js$" > /dev/null; then
  echo "⚠️  Console logs found in production build"
else
  echo "✅ No console logs in production HTML"
fi

# Check for proper meta tags
if grep -r 'name="viewport"' _site/index.html > /dev/null; then
  echo "✅ Viewport meta tag present"
else
  echo "❌ Viewport meta tag missing"
fi

# Check for structured data
if grep -r 'application/ld+json' _site/index.html > /dev/null; then
  echo "✅ Structured data present"
else
  echo "⚠️  No structured data found"
fi

# Validate external API data integration
echo ""
echo "3. External API data validation:"

# Check Last.fm data integration
music_data=$(grep -o '"artist":\s*"[^"]*"' _site/index.html | head -1)
if [ -n "$music_data" ]; then
  echo "✅ Last.fm data integrated: $music_data"
else
  echo "❌ Last.fm data missing from build"
fi

# Check YouTube data integration
video_data=$(grep -o '"title":\s*"[^"]*"' _site/index.html | head -1)
if [ -n "$video_data" ]; then
  echo "✅ YouTube data integrated: $video_data"
else
  echo "❌ YouTube data missing from build"
fi

echo ""
echo "Production build test completed"
EOF

chmod +x test-production-build.sh
./test-production-build.sh
```

### 3.2 Container Runtime Testing

Test that the container serves the built site correctly:

```bash
# Test container runtime with built site
echo "Testing container runtime..."

# Remove any existing container
docker stop andrewford-blog-test 2>/dev/null || true
docker rm andrewford-blog-test 2>/dev/null || true

# Run container with environment variables
docker run -d --name andrewford-blog-test \
  -p 3001:3000 \
  -e NODE_ENV=production \
  -e API_URL=http://localhost:3080 \
  -e SITE_URL=http://localhost:3001 \
  -e ALLOWED_ORIGINS=http://localhost:3001 \
  andrewford-blog-test

# Wait for container to start
sleep 10

# Test container health
echo "Container health check:"
curl -s http://localhost:3001/health | jq '.'

# Test static site serving
echo "Static site serving test:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/
echo "Homepage status code: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/)"

# Test API endpoints
echo "API endpoints test:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/lastplayed
echo "Last.fm API status code: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/lastplayed)"

curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/latestUploads
echo "YouTube API status code: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/latestUploads)"

# Test that static files include API data
echo "API data in static files:"
curl -s http://localhost:3001/ | grep -i "artist\|currently" | head -3

# Clean up
docker stop andrewford-blog-test
docker rm andrewford-blog-test
```

## 4. Build-Time vs Runtime API Integration

### 4.1 Hybrid Architecture Validation

Test that both build-time and runtime API calls work correctly:

```bash
# Create hybrid integration test
cat > test-hybrid-integration.js << 'EOF'
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');

async function testHybridIntegration() {
  console.log('Testing Hybrid Build/Runtime Integration');
  console.log('======================================');

  // 1. Test build-time data (embedded in HTML)
  console.log('\n1. Build-time data validation:');

  try {
    const indexHtml = fs.readFileSync('_site/index.html', 'utf8');

    // Check for embedded music data
    const musicMatch = indexHtml.match(/"artist":\s*"([^"]+)"/);
    if (musicMatch) {
      console.log('✅ Build-time music data found:', musicMatch[1]);
    } else {
      console.log('❌ Build-time music data missing');
    }

    // Check for embedded video data
    const videoMatch = indexHtml.match(/"title":\s*"([^"]+)"/);
    if (videoMatch) {
      console.log('✅ Build-time video data found:', videoMatch[1]);
    } else {
      console.log('❌ Build-time video data missing');
    }

  } catch (error) {
    console.log('❌ Error reading build output:', error.message);
  }

  // 2. Test runtime data (live API calls)
  console.log('\n2. Runtime API validation:');

  try {
    // Test Last.fm API
    const musicResponse = await fetch('http://localhost:3001/api/lastplayed');
    if (musicResponse.ok) {
      const musicData = await musicResponse.json();
      console.log('✅ Runtime music data:', musicData.artist, '-', musicData.trackName);
    } else {
      console.log('❌ Runtime music API failed:', musicResponse.status);
    }

    // Test YouTube API
    const videoResponse = await fetch('http://localhost:3001/api/latestUploads');
    if (videoResponse.ok) {
      const videoData = await videoResponse.json();
      console.log('✅ Runtime video data:', videoData.length, 'videos');
      if (videoData.length > 0) {
        console.log('   Latest video:', videoData[0].snippet.title);
      }
    } else {
      console.log('❌ Runtime video API failed:', videoResponse.status);
    }

  } catch (error) {
    console.log('❌ Runtime API error:', error.message);
  }

  // 3. Test chatbot API (runtime only)
  console.log('\n3. Runtime-only services validation:');

  try {
    const chatResponse = await fetch('http://localhost:3001/api/chatrag', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test message',
        conversationHistory: []
      })
    });

    if (chatResponse.ok) {
      console.log('✅ Chatbot API functional');
    } else {
      console.log('❌ Chatbot API failed:', chatResponse.status);
    }

  } catch (error) {
    console.log('❌ Chatbot API error:', error.message);
  }

  console.log('\nHybrid integration test completed');
}

testHybridIntegration().catch(console.error);
EOF

# Run hybrid integration test (requires container to be running)
node test-hybrid-integration.js
```

## 5. Build Optimization and Caching

### 5.1 Cache Strategy Testing

Test caching strategies for both build and runtime:

```bash
# Create cache strategy test
cat > test-cache-strategy.sh << 'EOF'
#!/bin/bash

echo "Cache Strategy Testing"
echo "====================="

# 1. Test build cache directory
echo "1. Build cache analysis:"
cache_dir="/tmp/.cache"
if [ -d "$cache_dir" ]; then
  echo "Cache directory exists: $cache_dir"
  echo "Cache size: $(du -sh $cache_dir 2>/dev/null | cut -f1)"
  echo "Cache files: $(find $cache_dir -type f 2>/dev/null | wc -l)"

  # List cache files for APIs
  echo "API cache files:"
  find $cache_dir -name "*lastplayed*" -o -name "*latestUploads*" 2>/dev/null | head -5
else
  echo "No cache directory found"
fi

# 2. Test cache invalidation
echo ""
echo "2. Cache invalidation testing:"

# Build with cache
echo "Building with cache..."
start_time=$(date +%s)
npm run build > /dev/null 2>&1
end_time=$(date +%s)
cached_build_time=$((end_time - start_time))
echo "Cached build time: ${cached_build_time}s"

# Clear cache and rebuild
echo "Clearing cache and rebuilding..."
rm -rf /tmp/.cache
rm -rf _site

start_time=$(date +%s)
npm run build > /dev/null 2>&1
end_time=$(date +%s)
fresh_build_time=$((end_time - start_time))
echo "Fresh build time: ${fresh_build_time}s"

# Analyze improvement
if [ $cached_build_time -lt $fresh_build_time ]; then
  improvement=$((fresh_build_time - cached_build_time))
  echo "✅ Cache saves ${improvement}s on build time"
else
  echo "⚠️  Cache may not be providing expected speedup"
fi

# 3. Test cache persistence
echo ""
echo "3. Cache persistence testing:"

# Build again to test cache persistence
start_time=$(date +%s)
npm run build > /dev/null 2>&1
end_time=$(date +%s)
second_cached_time=$((end_time - start_time))
echo "Second cached build time: ${second_cached_time}s"

if [ $second_cached_time -le $((cached_build_time + 2)) ]; then
  echo "✅ Cache persistence working correctly"
else
  echo "⚠️  Cache persistence may have issues"
fi
EOF

chmod +x test-cache-strategy.sh

# Start API server for cache testing
npm run api:dev &
API_PID=$!
sleep 5

./test-cache-strategy.sh

kill $API_PID
```

### 5.2 Build Performance Optimization

Test and validate build performance optimizations:

```bash
# Create build optimization test
cat > test-build-optimization.js << 'EOF'
const fs = require('fs');
const path = require('path');

function testBuildOptimization() {
  console.log('Build Optimization Analysis');
  console.log('==========================');

  const siteDir = '_site';

  if (!fs.existsSync(siteDir)) {
    console.log('❌ Build output directory not found. Run build first.');
    return;
  }

  // 1. Analyze file sizes
  console.log('\n1. File size analysis:');

  function getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch {
      return 0;
    }
  }

  function analyzeDirectory(dir) {
    const stats = {
      html: { count: 0, totalSize: 0 },
      css: { count: 0, totalSize: 0 },
      js: { count: 0, totalSize: 0 },
      images: { count: 0, totalSize: 0 },
      other: { count: 0, totalSize: 0 }
    };

    function walkDir(currentDir) {
      const files = fs.readdirSync(currentDir);

      for (const file of files) {
        const filePath = path.join(currentDir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          const ext = path.extname(file).toLowerCase();
          const size = stat.size;

          if (ext === '.html') {
            stats.html.count++;
            stats.html.totalSize += size;
          } else if (ext === '.css') {
            stats.css.count++;
            stats.css.totalSize += size;
          } else if (ext === '.js') {
            stats.js.count++;
            stats.js.totalSize += size;
          } else if (['.jpg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
            stats.images.count++;
            stats.images.totalSize += size;
          } else {
            stats.other.count++;
            stats.other.totalSize += size;
          }
        }
      }
    }

    walkDir(dir);
    return stats;
  }

  const buildStats = analyzeDirectory(siteDir);

  Object.entries(buildStats).forEach(([type, data]) => {
    const avgSize = data.count > 0 ? (data.totalSize / data.count / 1024).toFixed(1) : 0;
    const totalKB = (data.totalSize / 1024).toFixed(1);
    console.log(`${type.toUpperCase()}: ${data.count} files, ${totalKB}KB total, ${avgSize}KB avg`);
  });

  // 2. Check for optimization opportunities
  console.log('\n2. Optimization opportunities:');

  // Check for large files
  const largeFiles = [];
  function findLargeFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findLargeFiles(filePath);
      } else if (stat.size > 100 * 1024) { // >100KB
        largeFiles.push({
          path: filePath.replace(siteDir + '/', ''),
          size: (stat.size / 1024).toFixed(1) + 'KB'
        });
      }
    }
  }

  findLargeFiles(siteDir);

  if (largeFiles.length > 0) {
    console.log('Large files (>100KB):');
    largeFiles.forEach(file => {
      console.log(`  ${file.path}: ${file.size}`);
    });
  } else {
    console.log('✅ No large files found');
  }

  // 3. Check API data integration
  console.log('\n3. API data integration check:');

  try {
    const indexPath = path.join(siteDir, 'index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');

    // Check for music data
    if (indexContent.includes('artist') || indexContent.includes('trackName')) {
      console.log('✅ Music data integrated into build');
    } else {
      console.log('❌ Music data missing from build');
    }

    // Check for video data
    if (indexContent.includes('youtube') || indexContent.includes('video')) {
      console.log('✅ Video data integrated into build');
    } else {
      console.log('❌ Video data missing from build');
    }

    // Check for chatbot integration
    if (indexContent.includes('chat') || indexContent.includes('assistant')) {
      console.log('✅ Chatbot interface integrated');
    } else {
      console.log('⚠️  Chatbot interface may be missing');
    }

  } catch (error) {
    console.log('❌ Error analyzing index.html:', error.message);
  }

  console.log('\nBuild optimization analysis completed');
}

testBuildOptimization();
EOF

node test-build-optimization.js
```

## 6. Production Deployment Simulation

### 6.1 Coolify Deployment Simulation

Simulate the production deployment process:

```bash
# Create Coolify deployment simulation
cat > test-coolify-deployment.sh << 'EOF'
#!/bin/bash

echo "Coolify Deployment Simulation"
echo "============================="

# 1. Simulate Git webhook trigger
echo "1. Simulating Git webhook deployment trigger..."

# Clean environment
rm -rf _site
rm -rf /tmp/.cache
docker system prune -f

# 2. Simulate Docker build in Coolify environment
echo ""
echo "2. Simulating Coolify Docker build..."

# Build with production environment variables
docker build -t andrewford-blog-coolify . \
  --build-arg NODE_ENV=production \
  --build-arg API_URL=https://staging.andrewford.co.nz \
  --build-arg SITE_URL=https://staging.andrewford.co.nz

if [ $? -eq 0 ]; then
  echo "✅ Coolify-style Docker build successful"
else
  echo "❌ Coolify-style Docker build failed"
  exit 1
fi

# 3. Simulate container deployment
echo ""
echo "3. Simulating container deployment..."

# Stop any existing test containers
docker stop andrewford-blog-coolify 2>/dev/null || true
docker rm andrewford-blog-coolify 2>/dev/null || true

# Run container with Coolify-style environment
docker run -d --name andrewford-blog-coolify \
  -p 3002:3000 \
  -e NODE_ENV=production \
  -e SITE_URL=https://staging.andrewford.co.nz \
  -e API_URL=https://staging.andrewford.co.nz \
  -e ALLOWED_ORIGINS=https://staging.andrewford.co.nz \
  -e LOG_LEVEL=info \
  andrewford-blog-coolify

# Wait for container to be ready
echo "Waiting for container to start..."
sleep 15

# 4. Test deployment health
echo ""
echo "4. Testing deployment health..."

# Health check
health_status=$(curl -s http://localhost:3002/health | jq -r '.status' 2>/dev/null)
if [ "$health_status" = "healthy" ]; then
  echo "✅ Container health check passed"
else
  echo "❌ Container health check failed: $health_status"
fi

# Static site serving
homepage_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/)
if [ "$homepage_status" = "200" ]; then
  echo "✅ Homepage serving correctly"
else
  echo "❌ Homepage serving failed: HTTP $homepage_status"
fi

# API endpoints
lastfm_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/lastplayed)
youtube_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/api/latestUploads)

echo "API endpoint status: Last.fm=$lastfm_status, YouTube=$youtube_status"

# 5. Test integrated data
echo ""
echo "5. Testing integrated data..."

# Check that build-time data is present
homepage_content=$(curl -s http://localhost:3002/)
if echo "$homepage_content" | grep -q "artist\|music"; then
  echo "✅ Music data present in deployed site"
else
  echo "❌ Music data missing from deployed site"
fi

if echo "$homepage_content" | grep -q "video\|youtube"; then
  echo "✅ Video data present in deployed site"
else
  echo "❌ Video data missing from deployed site"
fi

# 6. Performance validation
echo ""
echo "6. Performance validation..."

# Response time test
response_time=$(curl -w "%{time_total}" -s -o /dev/null http://localhost:3002/)
echo "Homepage response time: ${response_time}s"

if (( $(echo "$response_time < 2.0" | bc -l) )); then
  echo "✅ Response time acceptable (<2s)"
else
  echo "⚠️  Response time slow (>2s)"
fi

# Memory usage (from health endpoint)
memory_info=$(curl -s http://localhost:3002/health | jq '.memory')
echo "Container memory usage: $memory_info"

# Clean up
echo ""
echo "7. Cleanup..."
docker stop andrewford-blog-coolify
docker rm andrewford-blog-coolify

echo "Coolify deployment simulation completed"
EOF

chmod +x test-coolify-deployment.sh
./test-coolify-deployment.sh
```

## 7. Build Process Integration Testing

### 7.1 Comprehensive Build Workflow Test

Create a comprehensive test that validates the entire build workflow:

```bash
# Create comprehensive build workflow test
cat > test-complete-workflow.sh << 'EOF'
#!/bin/bash

echo "Complete 11ty Build Workflow Test"
echo "================================="

# Function to check command success
check_success() {
  if [ $? -eq 0 ]; then
    echo "✅ $1"
  else
    echo "❌ $1"
    exit 1
  fi
}

# 1. Environment setup
echo "1. Environment Setup"
echo "-------------------"

# Start API server
npm run api:dev &
API_PID=$!
sleep 5

curl -s http://localhost:3080/health > /dev/null
check_success "API server started"

# 2. Data file testing
echo ""
echo "2. Data Files Testing"
echo "--------------------"

# Test music data fetch
music_test=$(API_URL=http://localhost:3080 node -e "
const latestMusic = require('./_data/latestMusic.mjs').default;
latestMusic().then(data => {
  console.log(data.music.artist ? 'SUCCESS' : 'FAIL');
}).catch(() => console.log('FAIL'));
")

if [ "$music_test" = "SUCCESS" ]; then
  echo "✅ Music data file working"
else
  echo "❌ Music data file failed"
fi

# Test video data fetch
video_test=$(API_URL=http://localhost:3080 node -e "
const latestVideos = require('./_data/latestVideos.mjs').default;
latestVideos().then(data => {
  console.log(data.videos.length > 0 ? 'SUCCESS' : 'FAIL');
}).catch(() => console.log('FAIL'));
")

if [ "$video_test" = "SUCCESS" ]; then
  echo "✅ Video data file working"
else
  echo "❌ Video data file failed"
fi

# 3. Build process
echo ""
echo "3. Build Process"
echo "---------------"

# Clean previous build
rm -rf _site
rm -rf /tmp/.cache

# Run build with API integration
API_URL=http://localhost:3080 npm run build > build.log 2>&1
check_success "11ty build completed"

# Check build output
[ -d "_site" ] && check_success "Build output directory created"
[ -f "_site/index.html" ] && check_success "Homepage built"

# 4. Build content validation
echo ""
echo "4. Build Content Validation"
echo "--------------------------"

# Check for API data integration
if grep -q "artist\|music" _site/index.html; then
  echo "✅ Music data integrated in build"
else
  echo "❌ Music data missing from build"
fi

if grep -q "video\|youtube" _site/index.html; then
  echo "✅ Video data integrated in build"
else
  echo "❌ Video data missing from build"
fi

# Check for proper HTML structure
if grep -q "<!DOCTYPE html>" _site/index.html; then
  echo "✅ Valid HTML structure"
else
  echo "❌ Invalid HTML structure"
fi

# 5. Docker build integration
echo ""
echo "5. Docker Build Integration"
echo "--------------------------"

# Test Docker build
docker build -t andrewford-blog-workflow . > docker-build.log 2>&1
check_success "Docker build completed"

# Test Docker run
docker run -d --name workflow-test -p 3003:3000 andrewford-blog-workflow
sleep 10

# Test container health
health_check=$(curl -s http://localhost:3003/health | jq -r '.status' 2>/dev/null)
if [ "$health_check" = "healthy" ]; then
  echo "✅ Container health check passed"
else
  echo "❌ Container health check failed"
fi

# Test static site serving from container
container_homepage=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/)
if [ "$container_homepage" = "200" ]; then
  echo "✅ Container serving static site"
else
  echo "❌ Container static site serving failed"
fi

# 6. API integration in container
echo ""
echo "6. Container API Integration"
echo "---------------------------"

# Test that container APIs work
lastfm_container=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/api/lastplayed)
youtube_container=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3003/api/latestUploads)

if [ "$lastfm_container" = "200" ]; then
  echo "✅ Container Last.fm API working"
else
  echo "❌ Container Last.fm API failed: $lastfm_container"
fi

if [ "$youtube_container" = "200" ]; then
  echo "✅ Container YouTube API working"
else
  echo "❌ Container YouTube API failed: $youtube_container"
fi

# 7. Performance validation
echo ""
echo "7. Performance Validation"
echo "------------------------"

# Test response times
homepage_time=$(curl -w "%{time_total}" -s -o /dev/null http://localhost:3003/)
lastfm_time=$(curl -w "%{time_total}" -s -o /dev/null http://localhost:3003/api/lastplayed)

echo "Homepage response time: ${homepage_time}s"
echo "Last.fm API response time: ${lastfm_time}s"

if (( $(echo "$homepage_time < 2.0" | bc -l) )); then
  echo "✅ Homepage performance acceptable"
else
  echo "⚠️  Homepage performance needs improvement"
fi

# 8. Cleanup
echo ""
echo "8. Cleanup"
echo "---------"

# Stop and remove container
docker stop workflow-test > /dev/null 2>&1
docker rm workflow-test > /dev/null 2>&1

# Stop API server
kill $API_PID > /dev/null 2>&1

echo "✅ Cleanup completed"
echo ""
echo "Complete workflow test finished"
echo "=============================="

# Final summary
echo ""
echo "Build artifacts:"
echo "- _site directory: $(du -sh _site 2>/dev/null | cut -f1)"
echo "- HTML files: $(find _site -name "*.html" 2>/dev/null | wc -l)"
echo "- Total files: $(find _site -type f 2>/dev/null | wc -l)"
EOF

chmod +x test-complete-workflow.sh
./test-complete-workflow.sh
```

## 8. Production Readiness Assessment

### 8.1 Build Process Checklist

The 11ty build process is ready for production when:

**Critical (Must Pass)**:

- [ ] Local build completes successfully with API integration
- [ ] Docker multi-stage build completes without errors
- [ ] Built site includes data from both Last.fm and YouTube APIs
- [ ] Container serves static site and APIs correctly
- [ ] Environment variables work correctly in build and runtime
- [ ] No build errors or critical warnings

**Important (Should Pass)**:

- [ ] Build performance is acceptable (<2 minutes)
- [ ] Caching reduces subsequent build times
- [ ] Built site is optimized (reasonable file sizes)
- [ ] All static assets load correctly
- [ ] Container health checks pass consistently
- [ ] Memory usage remains stable during builds

**Nice to Have (May Pass)**:

- [ ] Build includes performance optimizations
- [ ] Advanced caching strategies implemented
- [ ] Build monitoring and alerting configured
- [ ] Graceful degradation when APIs are unavailable during build

### 8.2 Performance Benchmarks

| Metric            | Target      | Current Result | Status |
| ----------------- | ----------- | -------------- | ------ |
| Local build time  | <2 minutes  | [X]s           | ✅/❌  |
| Docker build time | <5 minutes  | [X]s           | ✅/❌  |
| Container startup | <30 seconds | [X]s           | ✅/❌  |
| Built site size   | <50MB       | [X]MB          | ✅/❌  |
| Cache hit ratio   | >80%        | [X]%           | ✅/❌  |

## 9. Troubleshooting Guide

### Common Build Issues

| Issue                      | Symptoms                               | Likely Cause                        | Solution                           |
| -------------------------- | -------------------------------------- | ----------------------------------- | ---------------------------------- |
| Build fails with API error | "Error in latestMusic.mjs"             | API server not running              | Start API server before build      |
| Empty API data in build    | Build succeeds but no music/video data | Wrong API_URL or API down           | Check API_URL environment variable |
| Docker build fails         | Container build errors                 | Missing dependencies or files       | Check Dockerfile and .dockerignore |
| Slow build times           | Build takes >5 minutes                 | No caching or large files           | Check EleventyFetch cache settings |
| Memory issues              | Build fails with out-of-memory         | Large vector store or API responses | Increase container memory limits   |

### Debug Commands

```bash
# Check build environment
npm run build -- --dry-run

# Test data files individually
node -e "require('./_data/latestMusic.mjs').default().then(console.log)"

# Check Docker build layers
docker build -t test . --progress=plain

# Monitor container during build
docker stats andrewford-blog-test

# Check build cache
ls -la /tmp/.cache/

# Validate built site
npx @11ty/eleventy --serve --dir=_site
```

## Next Steps

After completing 11ty build process verification:

1. ✅ Document all build test results and performance metrics
2. ✅ Address any critical build issues found
3. ✅ Validate build process works in Coolify environment
4. ✅ Proceed to rollback plan creation (Task 5.6)
5. ✅ Ensure build process is ready for production deployment
