# Netlify Rollback Plan and Backup Strategy

This document provides a comprehensive rollback plan and backup strategy for reverting from Coolify back to Netlify if issues occur during or after the migration.

## Overview

The rollback plan covers:

- **Immediate emergency rollback** procedures (DNS-based)
- **Complete backup** of current Netlify configuration
- **Data preservation** strategies during migration
- **Rollback validation** procedures
- **Recovery time objectives** and procedures
- **Communication plan** for rollback scenarios

## Emergency Rollback Strategy

### 1. Immediate DNS Rollback (< 5 minutes)

For critical issues requiring immediate rollback:

```bash
# Emergency DNS rollback procedure
echo "EMERGENCY ROLLBACK PROCEDURE"
echo "==========================="

# 1. Revert DNS records to Netlify
echo "1. DNS Rollback Steps:"
echo "   - Login to DNS provider dashboard"
echo "   - Change A record from Coolify IP back to Netlify"
echo "   - Change AAAA record (if applicable)"
echo "   - Verify TTL is set to 300 seconds for fast propagation"

# 2. Verify Netlify is still active
echo "2. Verify Netlify Status:"
curl -s -o /dev/null -w "%{http_code}" https://andrewford.netlify.app/
echo "Netlify site status: $(curl -s -o /dev/null -w "%{http_code}" https://andrewford.netlify.app/)"

# 3. Test critical functionality
echo "3. Test Critical Functions:"
curl -s https://andrewford.netlify.app/.netlify/functions/lastplayed | jq '.artist' 2>/dev/null || echo "Last.fm function test"
curl -s https://andrewford.netlify.app/.netlify/functions/latestUploads | jq 'length' 2>/dev/null || echo "YouTube function test"

echo "Emergency rollback initiated. Monitor DNS propagation."
```

### 2. DNS Configuration Backup

Current DNS configuration to restore:

```bash
# DNS Records Backup (to be executed before migration)
cat > dns-backup.txt << 'EOF'
# Current DNS Configuration for andrewford.co.nz
# Date: $(date)
# Provider: [DNS_PROVIDER]

# Primary domain records
andrewford.co.nz    A       [NETLIFY_A_RECORD]
andrewford.co.nz    AAAA    [NETLIFY_AAAA_RECORD] (if applicable)
www.andrewford.co.nz CNAME  andrewford.co.nz

# Subdomains (if any)
[subdomain].andrewford.co.nz  [TYPE]  [VALUE]

# Email records (if applicable)
andrewford.co.nz    MX      [MX_RECORDS]
andrewford.co.nz    TXT     [SPF_RECORDS]

# Verification records
andrewford.co.nz    TXT     [VERIFICATION_RECORDS]
EOF

echo "DNS backup created. Store this securely!"
```

## Comprehensive Netlify Backup

### 1. Site Configuration Backup

```bash
# Create comprehensive Netlify backup
echo "Creating Netlify Configuration Backup"
echo "===================================="

# Install Netlify CLI if not present
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to site directory
cd /path/to/andrewford-co-nz-11ty

# 1. Export site configuration
echo "1. Exporting site configuration..."
netlify sites:list > netlify-sites-backup.json
netlify api getSite --data='{"site_id":"[SITE_ID]"}' > netlify-site-config-backup.json

# 2. Export environment variables
echo "2. Exporting environment variables..."
netlify env:list --json > netlify-env-backup.json

# 3. Export build settings
echo "3. Exporting build settings..."
netlify api getSite --data='{"site_id":"[SITE_ID]"}' | jq '.build_settings' > netlify-build-settings-backup.json

# 4. Export deploy settings
echo "4. Exporting deploy settings..."
netlify api listSiteDeploys --data='{"site_id":"[SITE_ID]","per_page":5}' > netlify-recent-deploys-backup.json

# 5. Export custom domain settings
echo "5. Exporting domain settings..."
netlify api getSite --data='{"site_id":"[SITE_ID]"}' | jq '.custom_domain' > netlify-domain-backup.json

# 6. Export form settings (if applicable)
echo "6. Exporting form settings..."
netlify api listSiteForms --data='{"site_id":"[SITE_ID]"}' > netlify-forms-backup.json

# 7. Export function settings
echo "7. Exporting function settings..."
netlify functions:list > netlify-functions-backup.json

echo "Netlify backup completed!"
```

### 2. Code and Content Backup

```bash
# Create code and content backup
echo "Creating Code and Content Backup"
echo "==============================="

# 1. Create git tag for current state
git tag -a "pre-coolify-migration-$(date +%Y%m%d)" -m "Backup before Coolify migration"
git push origin "pre-coolify-migration-$(date +%Y%m%d)"

# 2. Export current build output
echo "2. Backing up current build..."
npm run build
tar -czf netlify-build-backup-$(date +%Y%m%d).tar.gz _site/

# 3. Backup vector store (if exists)
echo "3. Backing up vector store..."
if [ -d "vector_store" ]; then
  tar -czf vector-store-backup-$(date +%Y%m%d).tar.gz vector_store/
fi

# 4. Backup node_modules state
echo "4. Backing up dependencies..."
cp package-lock.json package-lock-backup-$(date +%Y%m%d).json

# 5. Export all content
echo "5. Backing up all content..."
tar -czf content-backup-$(date +%Y%m%d).tar.gz content/ _data/ _includes/ public/

echo "Code and content backup completed!"
```

### 3. Data Backup and Validation

```bash
# Create data validation backup
cat > backup-data-validation.sh << 'EOF'
#!/bin/bash

echo "Data Validation and Backup"
echo "========================="

# Test current Netlify functions
echo "1. Validating current Netlify function data..."

# Last.fm function
LASTFM_NETLIFY=$(curl -s https://andrewford.netlify.app/.netlify/functions/lastplayed)
echo "$LASTFM_NETLIFY" > netlify-lastfm-data-backup.json
echo "Last.fm data backed up: $(echo "$LASTFM_NETLIFY" | jq -r '.artist') - $(echo "$LASTFM_NETLIFY" | jq -r '.trackName')"

# YouTube function
YOUTUBE_NETLIFY=$(curl -s https://andrewford.netlify.app/.netlify/functions/latestUploads)
echo "$YOUTUBE_NETLIFY" > netlify-youtube-data-backup.json
echo "YouTube data backed up: $(echo "$YOUTUBE_NETLIFY" | jq 'length') videos"

# Chatbot function (if exists)
CHATBOT_TEST=$(curl -s -X POST https://andrewford.netlify.app/.netlify/functions/chatrag \
  -H "Content-Type: application/json" \
  -d '{"message":"test","conversationHistory":[]}')
echo "$CHATBOT_TEST" > netlify-chatbot-test-backup.json

# 2. Create function source backup
echo "2. Backing up function source code..."
if [ -d "netlify/functions" ]; then
  tar -czf netlify-functions-source-backup-$(date +%Y%m%d).tar.gz netlify/functions/
fi

# 3. Document API keys and configuration
echo "3. Creating configuration checklist..."
cat > netlify-config-checklist.md << 'CHECKLIST'
# Netlify Configuration Checklist

## Environment Variables Required
- [ ] OPENAI_API_KEY
- [ ] OPENROUTER_API_KEY
- [ ] LASTFM_API_KEY
- [ ] LASTFM_USERNAME
- [ ] YOUTUBE_API_KEY
- [ ] YOUTUBE_CHANNEL_ID
- [ ] NODE_ENV
- [ ] SITE_URL

## Build Settings
- [ ] Build command: npm run build
- [ ] Publish directory: _site
- [ ] Functions directory: netlify/functions

## Domain Settings
- [ ] Primary domain: andrewford.co.nz
- [ ] HTTPS enabled
- [ ] SSL certificate auto-provisioned

## Deploy Settings
- [ ] Auto-deploy from main branch
- [ ] Deploy previews enabled
- [ ] Branch deploys enabled

## Functions Configuration
- [ ] lastplayed function deployed
- [ ] latestUploads function deployed
- [ ] chatrag function deployed
CHECKLIST

echo "Data validation and backup completed!"
EOF

chmod +x backup-data-validation.sh
./backup-data-validation.sh
```

## Rollback Scenarios and Procedures

### Scenario 1: DNS Cutover Issues

**Symptoms**: Site unreachable after DNS change
**Timeline**: Immediate (0-5 minutes)

```bash
# DNS cutover rollback procedure
cat > rollback-dns-cutover.sh << 'EOF'
#!/bin/bash

echo "DNS Cutover Rollback Procedure"
echo "============================="

echo "CRITICAL: DNS cutover issues detected"
echo "Initiating immediate rollback..."

# 1. Check current DNS resolution
echo "1. Checking current DNS resolution:"
dig +short andrewford.co.nz
nslookup andrewford.co.nz

# 2. Verify Netlify is still accessible
echo "2. Verifying Netlify fallback:"
curl -s -o /dev/null -w "%{http_code}" https://andrewford.netlify.app/
netlify_status=$(curl -s -o /dev/null -w "%{http_code}" https://andrewford.netlify.app/)

if [ "$netlify_status" = "200" ]; then
  echo "✅ Netlify site is accessible"
else
  echo "❌ Netlify site is not accessible: HTTP $netlify_status"
fi

# 3. Manual DNS rollback instructions
echo ""
echo "3. MANUAL ACTION REQUIRED:"
echo "   → Login to DNS provider dashboard"
echo "   → Change A record back to Netlify:"
echo "     FROM: [COOLIFY_IP]"
echo "     TO:   [NETLIFY_IP] (from dns-backup.txt)"
echo "   → Set TTL to 300 seconds"
echo "   → Save changes"

# 4. Monitor rollback
echo ""
echo "4. Monitoring rollback progress:"
echo "   Run this command every 30 seconds:"
echo "   watch -n 30 'dig +short andrewford.co.nz'"

echo ""
echo "Expected resolution time: 5-15 minutes"
echo "Contact DNS provider if issues persist beyond 30 minutes"
EOF

chmod +x rollback-dns-cutover.sh
```

### Scenario 2: Performance Issues

**Symptoms**: Site slower than Netlify baseline
**Timeline**: Planned rollback (30 minutes - 2 hours)

```bash
# Performance-based rollback procedure
cat > rollback-performance-issues.sh << 'EOF'
#!/bin/bash

echo "Performance Issues Rollback Procedure"
echo "===================================="

# 1. Document performance issues
echo "1. Documenting performance baseline:"

# Test current Coolify performance
echo "Testing Coolify performance..."
coolify_homepage=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.co.nz/)
coolify_lastfm=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.co.nz/api/lastplayed)
coolify_youtube=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.co.nz/api/latestUploads)

echo "Coolify performance:"
echo "  Homepage: ${coolify_homepage}s"
echo "  Last.fm API: ${coolify_lastfm}s"
echo "  YouTube API: ${coolify_youtube}s"

# Test Netlify performance baseline
echo "Testing Netlify performance baseline..."
netlify_homepage=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.netlify.app/)
netlify_lastfm=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.netlify.app/.netlify/functions/lastplayed)
netlify_youtube=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.netlify.app/.netlify/functions/latestUploads)

echo "Netlify performance baseline:"
echo "  Homepage: ${netlify_homepage}s"
echo "  Last.fm API: ${netlify_lastfm}s"
echo "  YouTube API: ${netlify_youtube}s"

# Calculate performance difference
python3 -c "
import sys
coolify_total = $coolify_homepage + $coolify_lastfm + $coolify_youtube
netlify_total = $netlify_homepage + $netlify_lastfm + $netlify_youtube
diff_percent = ((coolify_total - netlify_total) / netlify_total) * 100

print(f'Performance difference: {diff_percent:.1f}%')
if diff_percent > 50:
    print('❌ Performance degradation > 50% - Rollback recommended')
    sys.exit(1)
elif diff_percent > 20:
    print('⚠️ Performance degradation > 20% - Monitor closely')
else:
    print('✅ Performance within acceptable range')
"

rollback_needed=$?

# 2. Initiate rollback if needed
if [ $rollback_needed -eq 1 ]; then
  echo ""
  echo "2. Performance rollback initiated..."
  echo "   → Switching DNS back to Netlify"
  echo "   → Allow 15-30 minutes for full propagation"
  echo "   → Monitor user experience during transition"

  # Log rollback decision
  echo "$(date): Performance rollback initiated due to >50% degradation" >> rollback-log.txt
fi

echo "Performance rollback procedure completed"
EOF

chmod +x rollback-performance-issues.sh
```

### Scenario 3: Functionality Issues

**Symptoms**: APIs not working, missing features
**Timeline**: Planned rollback (1-4 hours)

```bash
# Functionality rollback procedure
cat > rollback-functionality-issues.sh << 'EOF'
#!/bin/bash

echo "Functionality Issues Rollback Procedure"
echo "======================================"

# 1. Test all critical functionality
echo "1. Testing critical functionality on Coolify:"

# Health check
health_status=$(curl -s https://andrewford.co.nz/health | jq -r '.status' 2>/dev/null)
echo "Health check: $health_status"

# Last.fm API
lastfm_status=$(curl -s -o /dev/null -w "%{http_code}" https://andrewford.co.nz/api/lastplayed)
echo "Last.fm API: HTTP $lastfm_status"

# YouTube API
youtube_status=$(curl -s -o /dev/null -w "%{http_code}" https://andrewford.co.nz/api/latestUploads)
echo "YouTube API: HTTP $youtube_status"

# Chatbot API
chatbot_status=$(curl -s -X POST https://andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{"message":"test","conversationHistory":[]}' \
  -o /dev/null -w "%{http_code}")
echo "Chatbot API: HTTP $chatbot_status"

# 2. Compare with Netlify baseline
echo ""
echo "2. Testing Netlify baseline functionality:"

netlify_lastfm=$(curl -s -o /dev/null -w "%{http_code}" https://andrewford.netlify.app/.netlify/functions/lastplayed)
netlify_youtube=$(curl -s -o /dev/null -w "%{http_code}" https://andrewford.netlify.app/.netlify/functions/latestUploads)
netlify_chatbot=$(curl -s -X POST https://andrewford.netlify.app/.netlify/functions/chatrag \
  -H "Content-Type: application/json" \
  -d '{"message":"test","conversationHistory":[]}' \
  -o /dev/null -w "%{http_code}")

echo "Netlify Last.fm: HTTP $netlify_lastfm"
echo "Netlify YouTube: HTTP $netlify_youtube"
echo "Netlify Chatbot: HTTP $netlify_chatbot"

# 3. Determine rollback necessity
echo ""
echo "3. Functionality assessment:"

failed_apis=0
if [ "$lastfm_status" != "200" ]; then
  echo "❌ Last.fm API failed on Coolify"
  ((failed_apis++))
fi

if [ "$youtube_status" != "200" ]; then
  echo "❌ YouTube API failed on Coolify"
  ((failed_apis++))
fi

if [ "$chatbot_status" != "200" ]; then
  echo "❌ Chatbot API failed on Coolify"
  ((failed_apis++))
fi

if [ $failed_apis -gt 1 ]; then
  echo ""
  echo "ROLLBACK DECISION: $failed_apis critical APIs failed"
  echo "Initiating functionality rollback..."

  # Log rollback
  echo "$(date): Functionality rollback initiated - $failed_apis APIs failed" >> rollback-log.txt

  # Execute DNS rollback
  echo "Execute DNS rollback procedure:"
  echo "1. Change DNS A record back to Netlify"
  echo "2. Monitor API functionality recovery"
  echo "3. Validate all features working"
else
  echo "✅ Functionality within acceptable limits"
fi

echo "Functionality rollback assessment completed"
EOF

chmod +x rollback-functionality-issues.sh
```

## Data Recovery Procedures

### 1. Environment Variables Recovery

```bash
# Restore Netlify environment variables
cat > restore-netlify-env.sh << 'EOF'
#!/bin/bash

echo "Restoring Netlify Environment Variables"
echo "====================================="

# Check if backup exists
if [ ! -f "netlify-env-backup.json" ]; then
  echo "❌ Environment variables backup not found!"
  echo "Manual restoration required using the configuration checklist"
  exit 1
fi

# Login to Netlify
netlify login

# Restore environment variables from backup
echo "Restoring environment variables from backup..."

# Read backup and restore each variable
cat netlify-env-backup.json | jq -r '.[] | [.key, .value] | @tsv' | while IFS=$'\t' read -r key value; do
  echo "Restoring $key..."
  netlify env:set "$key" "$value"
done

echo "✅ Environment variables restored from backup"

# Verify restoration
echo "Verifying restored variables..."
netlify env:list

echo "Environment restoration completed"
EOF

chmod +x restore-netlify-env.sh
```

### 2. Build Settings Recovery

```bash
# Restore Netlify build settings
cat > restore-netlify-build.sh << 'EOF'
#!/bin/bash

echo "Restoring Netlify Build Settings"
echo "==============================="

# Check for build settings backup
if [ ! -f "netlify-build-settings-backup.json" ]; then
  echo "⚠️ Build settings backup not found"
  echo "Manual configuration required:"
  echo "  - Build command: npm run build"
  echo "  - Publish directory: _site"
  echo "  - Functions directory: netlify/functions"
  exit 1
fi

# Display build settings for manual restoration
echo "Build settings to restore:"
cat netlify-build-settings-backup.json | jq '.build_settings'

echo ""
echo "Manual restoration required in Netlify dashboard:"
echo "1. Go to Site Settings → Build & Deploy"
echo "2. Update build settings with values above"
echo "3. Redeploy site to verify settings"

echo "Build settings restoration guide completed"
EOF

chmod +x restore-netlify-build.sh
```

### 3. Functions Recovery

```bash
# Restore Netlify functions
cat > restore-netlify-functions.sh << 'EOF'
#!/bin/bash

echo "Restoring Netlify Functions"
echo "=========================="

# Check if functions backup exists
if [ ! -f "netlify-functions-source-backup-$(date +%Y%m%d).tar.gz" ]; then
  echo "⚠️ Functions backup not found for today"
  echo "Looking for most recent backup..."

  latest_backup=$(ls -t netlify-functions-source-backup-*.tar.gz 2>/dev/null | head -1)
  if [ -n "$latest_backup" ]; then
    echo "Found backup: $latest_backup"
    tar -xzf "$latest_backup"
  else
    echo "❌ No functions backup found"
    echo "Functions need to be restored from git repository"
    exit 1
  fi
else
  tar -xzf "netlify-functions-source-backup-$(date +%Y%m%d).tar.gz"
fi

# Verify functions are in place
if [ -d "netlify/functions" ]; then
  echo "✅ Functions directory restored"
  echo "Functions found:"
  ls -la netlify/functions/
else
  echo "❌ Functions directory not found after restoration"
  exit 1
fi

# Test functions locally (if netlify-cli supports it)
echo "Testing functions locally..."
netlify dev > /dev/null 2>&1 &
DEV_PID=$!
sleep 10

# Test function endpoints
curl -s http://localhost:3010/.netlify/functions/lastplayed | jq '.artist' && echo "✅ lastplayed function working"
curl -s http://localhost:3010/.netlify/functions/latestUploads | jq 'length' && echo "✅ latestUploads function working"

# Cleanup
kill $DEV_PID

echo "Functions restoration completed"
echo "Deploy to Netlify to activate functions"
EOF

chmod +x restore-netlify-functions.sh
```

## Recovery Time Objectives (RTO)

| Rollback Scenario           | Target RTO | Procedure                  |
| --------------------------- | ---------- | -------------------------- |
| **Critical DNS Issues**     | 5 minutes  | Immediate DNS revert       |
| **Performance Degradation** | 30 minutes | Planned DNS rollback       |
| **API Functionality Loss**  | 2 hours    | Full configuration restore |
| **Complete System Failure** | 4 hours    | Full backup restoration    |

## Recovery Point Objectives (RPO)

| Data Type                 | Target RPO | Backup Frequency           |
| ------------------------- | ---------- | -------------------------- |
| **Site Content**          | 0 minutes  | Git repository (real-time) |
| **Environment Variables** | 1 hour     | Pre-migration backup       |
| **Build Configuration**   | 1 hour     | Pre-migration backup       |
| **API Data**              | 5 minutes  | Live fallback to Netlify   |

## Rollback Validation Checklist

After executing any rollback procedure:

```bash
# Rollback validation checklist
cat > validate-rollback.sh << 'EOF'
#!/bin/bash

echo "Rollback Validation Checklist"
echo "============================="

# 1. DNS Resolution
echo "1. DNS Resolution:"
resolved_ip=$(dig +short andrewford.co.nz)
echo "   Current IP: $resolved_ip"
echo "   Expected: [NETLIFY_IP]"

# 2. Site Accessibility
echo ""
echo "2. Site Accessibility:"
homepage_status=$(curl -s -o /dev/null -w "%{http_code}" https://andrewford.co.nz/)
echo "   Homepage: HTTP $homepage_status"

# 3. API Functionality
echo ""
echo "3. API Functionality:"
lastfm_status=$(curl -s -o /dev/null -w "%{http_code}" https://andrewford.co.nz/.netlify/functions/lastplayed)
youtube_status=$(curl -s -o /dev/null -w "%{http_code}" https://andrewford.co.nz/.netlify/functions/latestUploads)
echo "   Last.fm API: HTTP $lastfm_status"
echo "   YouTube API: HTTP $youtube_status"

# 4. Content Integrity
echo ""
echo "4. Content Integrity:"
content_check=$(curl -s https://andrewford.co.nz/ | grep -i "andrew ford" | wc -l)
echo "   Content elements found: $content_check"

# 5. Performance Baseline
echo ""
echo "5. Performance Check:"
response_time=$(curl -w "%{time_total}" -s -o /dev/null https://andrewford.co.nz/)
echo "   Response time: ${response_time}s"

# 6. SSL Certificate
echo ""
echo "6. SSL Certificate:"
ssl_status=$(echo | openssl s_client -connect andrewford.co.nz:443 -servername andrewford.co.nz 2>/dev/null | grep -c "Verify return code: 0")
if [ $ssl_status -eq 1 ]; then
  echo "   SSL: ✅ Valid"
else
  echo "   SSL: ❌ Invalid"
fi

# Summary
echo ""
echo "Rollback Validation Summary:"
if [ "$homepage_status" = "200" ] && [ "$lastfm_status" = "200" ] && [ "$youtube_status" = "200" ]; then
  echo "✅ Rollback successful - all systems operational"
else
  echo "❌ Rollback issues detected - manual intervention required"
fi

echo ""
echo "Validation completed at $(date)"
EOF

chmod +x validate-rollback.sh
```

## Communication Plan

### 1. Internal Communication

```bash
# Internal rollback communication
cat > internal-rollback-communication.md << 'EOF'
# Internal Rollback Communication Plan

## Immediate Notification (0-5 minutes)
- [ ] Notify development team via Slack/email
- [ ] Update internal status page
- [ ] Document rollback reason and timeline

## Ongoing Updates (Every 30 minutes during rollback)
- [ ] Progress updates to stakeholders
- [ ] Technical status updates
- [ ] ETA for resolution

## Post-Rollback (Within 24 hours)
- [ ] Root cause analysis
- [ ] Lessons learned documentation
- [ ] Updated migration plan (if applicable)

## Key Contacts
- Primary: [DEVELOPER_NAME] - [EMAIL] - [PHONE]
- Secondary: [BACKUP_CONTACT] - [EMAIL] - [PHONE]
- DNS Provider: [PROVIDER_SUPPORT] - [CONTACT_INFO]
EOF
```

### 2. User Communication

```bash
# User communication templates
cat > user-rollback-communication.md << 'EOF'
# User Communication Templates

## Status Page Update
"We are experiencing technical difficulties and have temporarily reverted to our previous hosting configuration. All services are now operational. We apologize for any inconvenience."

## Email/Social Media
"Brief service interruption resolved. We've rolled back a recent infrastructure change and all systems are now fully operational. Thank you for your patience."

## Blog Post (if significant impact)
"Migration Update: We encountered some technical challenges during our recent infrastructure migration and made the decision to rollback to ensure consistent service. We're analyzing the issues and will retry the migration once resolved."
EOF
```

## Backup Verification

### 1. Pre-Migration Backup Verification

```bash
# Verify all backups before migration
cat > verify-backups.sh << 'EOF'
#!/bin/bash

echo "Pre-Migration Backup Verification"
echo "================================"

# 1. Git backup verification
echo "1. Git Repository Backup:"
git tag | grep "pre-coolify-migration" && echo "✅ Git tag created" || echo "❌ Git tag missing"

# 2. Configuration backups
echo ""
echo "2. Configuration Backups:"
[ -f "netlify-env-backup.json" ] && echo "✅ Environment variables backup" || echo "❌ Environment variables backup missing"
[ -f "netlify-build-settings-backup.json" ] && echo "✅ Build settings backup" || echo "❌ Build settings backup missing"
[ -f "dns-backup.txt" ] && echo "✅ DNS configuration backup" || echo "❌ DNS configuration backup missing"

# 3. Content backups
echo ""
echo "3. Content Backups:"
[ -f "content-backup-$(date +%Y%m%d).tar.gz" ] && echo "✅ Content backup" || echo "❌ Content backup missing"
[ -f "netlify-build-backup-$(date +%Y%m%d).tar.gz" ] && echo "✅ Build backup" || echo "❌ Build backup missing"

# 4. Function backups
echo ""
echo "4. Function Backups:"
[ -f "netlify-functions-source-backup-$(date +%Y%m%d).tar.gz" ] && echo "✅ Functions backup" || echo "❌ Functions backup missing"

# 5. Data validation backups
echo ""
echo "5. Data Validation Backups:"
[ -f "netlify-lastfm-data-backup.json" ] && echo "✅ Last.fm data backup" || echo "❌ Last.fm data backup missing"
[ -f "netlify-youtube-data-backup.json" ] && echo "✅ YouTube data backup" || echo "❌ YouTube data backup missing"

echo ""
echo "Backup verification completed"
echo "Ensure all missing backups are created before proceeding with migration"
EOF

chmod +x verify-backups.sh
```

### 2. Backup Integrity Testing

```bash
# Test backup integrity
cat > test-backup-integrity.sh << 'EOF'
#!/bin/bash

echo "Backup Integrity Testing"
echo "======================="

# 1. Test configuration backups
echo "1. Testing configuration backups:"
if [ -f "netlify-env-backup.json" ]; then
  env_count=$(cat netlify-env-backup.json | jq 'length')
  echo "   Environment variables: $env_count entries"
else
  echo "   ❌ Environment backup missing"
fi

# 2. Test content backups
echo ""
echo "2. Testing content backups:"
if [ -f "content-backup-$(date +%Y%m%d).tar.gz" ]; then
  tar -tzf "content-backup-$(date +%Y%m%d).tar.gz" | wc -l
  echo "   Content files: $(tar -tzf "content-backup-$(date +%Y%m%d).tar.gz" | wc -l) entries"
else
  echo "   ❌ Content backup missing"
fi

# 3. Test data backups
echo ""
echo "3. Testing data backups:"
if [ -f "netlify-lastfm-data-backup.json" ]; then
  artist=$(cat netlify-lastfm-data-backup.json | jq -r '.artist')
  echo "   Last.fm backup contains: $artist"
else
  echo "   ❌ Last.fm data backup missing"
fi

if [ -f "netlify-youtube-data-backup.json" ]; then
  video_count=$(cat netlify-youtube-data-backup.json | jq 'length')
  echo "   YouTube backup contains: $video_count videos"
else
  echo "   ❌ YouTube data backup missing"
fi

echo ""
echo "Backup integrity testing completed"
EOF

chmod +x test-backup-integrity.sh
```

## Rollback Decision Matrix

| Issue Severity | Impact                              | Response Time | Action                    |
| -------------- | ----------------------------------- | ------------- | ------------------------- |
| **Critical**   | Site completely down                | Immediate     | Emergency DNS rollback    |
| **High**       | Major functionality broken          | 30 minutes    | Planned rollback          |
| **Medium**     | Performance degradation >50%        | 2 hours       | Investigate then rollback |
| **Low**        | Minor issues, workarounds available | 24 hours      | Fix in place              |

## Post-Rollback Actions

### 1. Immediate Post-Rollback (0-1 hour)

- [ ] Validate all functionality restored
- [ ] Update monitoring systems
- [ ] Notify users of resolution
- [ ] Document rollback completion

### 2. Short-term Post-Rollback (1-24 hours)

- [ ] Conduct post-mortem analysis
- [ ] Identify root causes
- [ ] Update migration plan
- [ ] Review rollback procedures

### 3. Long-term Post-Rollback (1-7 days)

- [ ] Address identified issues
- [ ] Test fixes in staging
- [ ] Plan retry migration
- [ ] Update documentation

## Success Criteria for Rollback Completion

The rollback is considered successful when:

- [ ] DNS resolves to Netlify infrastructure
- [ ] Homepage loads in <2 seconds
- [ ] All API endpoints return HTTP 200
- [ ] Last.fm integration displays current data
- [ ] YouTube integration shows recent videos
- [ ] Chatbot functionality works correctly
- [ ] SSL certificate is valid
- [ ] No error reports from users
- [ ] Performance matches pre-migration baseline

## Next Steps

After completing rollback plan creation:

1. ✅ Verify all backup procedures are tested
2. ✅ Ensure rollback scripts are executable
3. ✅ Validate communication plans are in place
4. ✅ Proceed to DNS cutover execution (Task 5.7)
5. ✅ Keep rollback procedures readily available during migration
