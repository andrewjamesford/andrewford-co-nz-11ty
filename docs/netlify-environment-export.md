# Netlify Environment Variables Export and Migration Guide

This document provides a complete export of all environment variables from the current Netlify deployment and instructions for migrating them to Coolify.

## Overview

The migration involves transferring all environment variables from Netlify to Coolify while ensuring:

- **API keys remain secure** during the transfer process
- **Environment-specific values** are updated for the new deployment
- **Backup documentation** exists for rollback scenarios
- **Validation procedures** confirm all variables are correctly configured

## Current Netlify Environment Variables

### Production Environment Variables

Based on the current andrewford.co.nz deployment, the following environment variables are configured:

```bash
# Node.js Environment
NODE_ENV=production

# Site Configuration
SITE_URL=https://andrewford.co.nz
API_URL=https://andrewford.co.nz

# CORS Configuration
ALLOWED_ORIGINS=https://andrewford.co.nz

# Logging
LOG_LEVEL=info

# OpenAI API Configuration
OPENAI_API_KEY=sk-...
# Note: Full key value needs to be exported from Netlify dashboard

# OpenRouter API Configuration (Backup LLM provider)
OPENROUTER_API_KEY=sk-...
# Note: Full key value needs to be exported from Netlify dashboard

# Last.fm API Configuration
LASTFM_API_KEY=...
LASTFM_USERNAME=andrewjamesford
# Note: Full API key needs to be exported from Netlify dashboard

# YouTube API Configuration
YOUTUBE_API_KEY=...
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxx
# Note: Full API key and channel ID need to be exported from Netlify dashboard

# Server Configuration
PORT=3000
```

### Development/Preview Environment Variables

For Netlify deploy previews and branch deployments:

```bash
# Node.js Environment
NODE_ENV=development

# Site Configuration
SITE_URL=https://deploy-preview-XX--andrewford.netlify.app
API_URL=https://deploy-preview-XX--andrewford.netlify.app

# CORS Configuration
ALLOWED_ORIGINS=https://deploy-preview-XX--andrewford.netlify.app,http://localhost:3010

# Logging
LOG_LEVEL=debug

# API Keys (same as production)
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=sk-...
LASTFM_API_KEY=...
LASTFM_USERNAME=andrewjamesford
YOUTUBE_API_KEY=...
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxx
PORT=3000
```

## Netlify Environment Export Procedure

### 1. Manual Export from Netlify Dashboard

To export current environment variables:

1. **Login to Netlify Dashboard**:

   - Go to https://app.netlify.com/
   - Navigate to andrewford.co.nz site

2. **Access Environment Variables**:

   - Go to Site settings → Environment variables
   - Document all variable names and values
   - Note which variables are marked as "secret"

3. **Export Command Line Method** (Alternative):

   ```bash
   # Install Netlify CLI if not already installed
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Navigate to your site directory
   cd /path/to/andrewford-co-nz-11ty

   # Export environment variables
   netlify env:list --json > netlify-env-backup.json

   # View current environment variables
   netlify env:list
   ```

### 2. Secure Documentation Template

Create a secure backup of environment variables:

```bash
# Create secure backup file (DO NOT commit to git)
cat > .env.netlify.backup << 'EOF'
# Netlify Environment Variables Backup
# Date: 2024-01-17
# Site: andrewford.co.nz

# === PRODUCTION ENVIRONMENT ===
NODE_ENV=production
SITE_URL=https://andrewford.co.nz
API_URL=https://andrewford.co.nz
ALLOWED_ORIGINS=https://andrewford.co.nz
LOG_LEVEL=info
PORT=3000

# === API KEYS (REDACTED - RETRIEVE FROM NETLIFY) ===
# OPENAI_API_KEY=sk-[REDACTED]
# OPENROUTER_API_KEY=sk-[REDACTED]
# LASTFM_API_KEY=[REDACTED]
# YOUTUBE_API_KEY=[REDACTED]

# === SERVICE CONFIGURATION ===
LASTFM_USERNAME=andrewjamesford
YOUTUBE_CHANNEL_ID=[RETRIEVE_FROM_NETLIFY]
EOF

# Secure the backup file
chmod 600 .env.netlify.backup
```

## Coolify Environment Configuration

### 1. Production Environment Setup

Configure these variables in Coolify for the production deployment:

```bash
# Application Environment
NODE_ENV=production
SITE_URL=https://andrewford.co.nz
API_URL=https://andrewford.co.nz
ALLOWED_ORIGINS=https://andrewford.co.nz
LOG_LEVEL=info
PORT=3000

# API Keys (transfer from Netlify)
OPENAI_API_KEY=sk-[FROM_NETLIFY]
OPENROUTER_API_KEY=sk-[FROM_NETLIFY]
LASTFM_API_KEY=[FROM_NETLIFY]
LASTFM_USERNAME=andrewjamesford
YOUTUBE_API_KEY=[FROM_NETLIFY]
YOUTUBE_CHANNEL_ID=[FROM_NETLIFY]
```

### 2. Staging Environment Setup

Configure these variables in Coolify for the staging deployment:

```bash
# Application Environment
NODE_ENV=staging
SITE_URL=https://staging.andrewford.co.nz
API_URL=https://staging.andrewford.co.nz
ALLOWED_ORIGINS=https://staging.andrewford.co.nz,http://localhost:3010
LOG_LEVEL=debug
PORT=3000

# API Keys (same as production)
OPENAI_API_KEY=sk-[FROM_NETLIFY]
OPENROUTER_API_KEY=sk-[FROM_NETLIFY]
LASTFM_API_KEY=[FROM_NETLIFY]
LASTFM_USERNAME=andrewjamesford
YOUTUBE_API_KEY=[FROM_NETLIFY]
YOUTUBE_CHANNEL_ID=[FROM_NETLIFY]
```

## Coolify Configuration Steps

### 1. Environment Variables Import

In Coolify dashboard:

1. **Navigate to Application → Environment Variables**
2. **Add each variable individually**:

   - Click "Add Environment Variable"
   - Enter variable name and value
   - Mark sensitive variables as "Secret"
   - Save each variable

3. **Bulk Import Option** (if available):
   ```bash
   # Create environment file for Coolify import
   cat > coolify-env-import.txt << 'EOF'
   NODE_ENV=production
   SITE_URL=https://andrewford.co.nz
   API_URL=https://andrewford.co.nz
   ALLOWED_ORIGINS=https://andrewford.co.nz
   LOG_LEVEL=info
   PORT=3000
   OPENAI_API_KEY=sk-[FROM_NETLIFY]
   OPENROUTER_API_KEY=sk-[FROM_NETLIFY]
   LASTFM_API_KEY=[FROM_NETLIFY]
   LASTFM_USERNAME=andrewjamesford
   YOUTUBE_API_KEY=[FROM_NETLIFY]
   YOUTUBE_CHANNEL_ID=[FROM_NETLIFY]
   EOF
   ```

### 2. Secret Management

For sensitive API keys in Coolify:

1. **Mark as Secret**: Enable "Secret" flag for:

   - OPENAI_API_KEY
   - OPENROUTER_API_KEY
   - LASTFM_API_KEY
   - YOUTUBE_API_KEY

2. **Verify Access**: Ensure secrets are properly masked in logs

3. **Access Control**: Limit who can view/edit secret variables

## Environment Variable Validation

### 1. Health Check Validation

The application health endpoint validates environment variables:

```bash
# Test environment variable configuration
curl -s https://staging.andrewford.co.nz/health | jq '.apis'

# Expected response:
{
  "openai": "configured",
  "openrouter": "configured",
  "lastfm": "configured",
  "youtube": "configured"
}
```

### 2. API Endpoint Testing

Validate each API integration works with transferred variables:

```bash
# Test Last.fm integration
curl -s https://staging.andrewford.co.nz/api/lastplayed

# Test YouTube integration
curl -s https://staging.andrewford.co.nz/api/latestUploads

# Test OpenAI integration (via chatbot)
curl -X POST https://staging.andrewford.co.nz/api/chatrag \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message", "conversationHistory": []}'
```

### 3. Environment-Specific Validation

Verify environment-specific variables are correct:

```bash
# Check site URL configuration
curl -s https://staging.andrewford.co.nz/health | jq '.environment'

# Verify CORS configuration
curl -H "Origin: https://staging.andrewford.co.nz" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://staging.andrewford.co.nz/api/chatrag
```

## Migration Checklist

### Pre-Migration Verification

- [ ] All Netlify environment variables documented
- [ ] Secure backup of sensitive API keys created
- [ ] Environment variable mapping confirmed for Coolify
- [ ] Staging environment configured with test values

### Migration Execution

- [ ] Export all variables from Netlify dashboard/CLI
- [ ] Import variables to Coolify production environment
- [ ] Import variables to Coolify staging environment
- [ ] Mark sensitive variables as secrets in Coolify
- [ ] Verify health check passes with new variables

### Post-Migration Validation

- [ ] All API endpoints respond correctly
- [ ] Environment-specific URLs are correct
- [ ] CORS configuration allows expected origins
- [ ] Logging level is appropriate for environment
- [ ] No sensitive data exposed in logs

## Security Considerations

### 1. API Key Rotation (Recommended)

Consider rotating API keys during migration:

1. **Generate new OpenAI API key**:

   - Create new key in OpenAI dashboard
   - Update both Netlify and Coolify
   - Test functionality
   - Revoke old key after successful migration

2. **Generate new YouTube API key**:

   - Create new credentials in Google Cloud Console
   - Update API key in both environments
   - Verify video feed functionality

3. **Last.fm API key**: Generally stable, rotation optional

### 2. Environment Isolation

Ensure proper environment isolation:

```bash
# Production should only access production APIs
SITE_URL=https://andrewford.co.nz

# Staging should use staging-specific URLs
SITE_URL=https://staging.andrewford.co.nz

# Development allows localhost access
ALLOWED_ORIGINS=https://staging.andrewford.co.nz,http://localhost:3010
```

## Troubleshooting

### Common Issues

| Issue                        | Cause                 | Solution                                  |
| ---------------------------- | --------------------- | ----------------------------------------- |
| API endpoints return 401/403 | Invalid API keys      | Verify keys copied correctly from Netlify |
| CORS errors in browser       | Wrong ALLOWED_ORIGINS | Update origins for new domain             |
| Health check shows "missing" | Variable not set      | Check Coolify environment variables       |
| Build fails                  | Missing NODE_ENV      | Ensure all required variables are set     |

### Debug Commands

```bash
# Check environment variables in container
docker exec <container-id> env | grep -E "(OPENAI|LASTFM|YOUTUBE)"

# Test API key validity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models

# Verify Last.fm API key
curl "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=andrewjamesford&api_key=$LASTFM_API_KEY&format=json"
```

## Rollback Procedure

If environment variable issues occur:

1. **Immediate Rollback**:

   ```bash
   # Revert to Netlify deployment
   # Update DNS back to Netlify
   # Verify all functionality restored
   ```

2. **Variable Recovery**:

   ```bash
   # Restore from backup
   cp .env.netlify.backup .env.recovery
   # Re-import to Coolify with corrections
   ```

3. **Partial Migration**:
   - Keep Netlify active while debugging Coolify
   - Use staging environment to test fixes
   - Only cutover when all variables validated

## Next Steps

After completing environment variable export and migration:

1. ✅ Validate all API keys work in staging environment
2. ✅ Confirm environment-specific URLs are correct
3. ✅ Test health checks pass with new configuration
4. ✅ Proceed to comprehensive functionality testing (Task 5.2)

## Important Security Notes

⚠️ **NEVER commit environment files to git**
⚠️ **Store API keys securely during transfer**
⚠️ **Verify no sensitive data in logs**
⚠️ **Rotate keys if compromise suspected**
⚠️ **Use secure channels for key transfer**
