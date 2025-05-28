# Environment Variables Reference

This document outlines the environment variables used in this Eleventy project and how they're exposed to the frontend.

## Backend Environment Variables

These are used during the build process and in serverless functions:

### Required

- `SITE_URL` - The main URL of the website (e.g., https://andrewford.co.nz)
- `API_URL` - URL for API endpoints (e.g., https://api.andrewford.co.nz)

### Optional

- `SERVERLESS_URL` - URL for serverless functions (defaults to NETLIFY_URL or SITE_URL)
- `NETLIFY_URL` - Automatically provided by Netlify
- `NODE_ENV` - Environment (development/production)
- `GTAG` - Google Analytics tracking ID
- `ENABLE_ANALYTICS` - Enable/disable analytics (true/false)

### Netlify-specific (automatically provided)

- `CONTEXT` - Build context (production, deploy-preview, branch-deploy)
- `DEPLOY_URL` - URL of the current deploy
- `DEPLOY_PRIME_URL` - URL of the primary deploy

## Frontend Exposure

Environment variables are safely exposed to the frontend through:

1. **Global Data Files** (`_data/metadata.js`, `_data/env.js`)
2. **Template Configuration** (`_includes/config.njk`)
3. **Generated Config File** (`content/config.njk`)

## Security Notes

⚠️ **Never expose sensitive data to the frontend:**

- API keys
- Database credentials
- Private tokens
- Internal URLs

✅ **Safe to expose:**

- Public URLs
- Feature flags
- Build information
- Public configuration

## Usage Examples

### In Templates

```nunjucks
<!-- Use metadata in templates -->
<link rel="canonical" href="{{ metadata.fullUrl }}{{ page.url }}">

<!-- Use environment data -->
{% if env.ENABLE_ANALYTICS %}
  <!-- Analytics code here -->
{% endif %}
```

### In Frontend JavaScript

```javascript
// Access configuration
const apiUrl = window.CONFIG.SERVERLESS_URL;
const isProduction = window.CONFIG.ENVIRONMENT === "production";

// Make API calls
fetch(`${window.CONFIG.ENDPOINTS.chat}`, {
  method: "POST",
  body: JSON.stringify({ message: "Hello" }),
});
```

## Development vs Production

The configuration automatically adjusts based on NODE_ENV:

- **Development**: Debug enabled, local URLs, verbose logging
- **Production**: Analytics enabled, production URLs, minimal logging
