# Coolify Environment Variables Configuration

This document provides the complete list of environment variables that need to be configured in your Coolify dashboard for the andrewford.co.nz blog deployment.

## Required Environment Variables

### Application Configuration

| Variable          | Value                      | Description                                           |
| ----------------- | -------------------------- | ----------------------------------------------------- |
| `NODE_ENV`        | `production`               | Sets Node.js environment for production optimizations |
| `PORT`            | `3000`                     | Port the Express.js server will listen on             |
| `SITE_URL`        | `https://andrewford.co.nz` | Base URL for the website (used in API responses)      |
| `ALLOWED_ORIGINS` | `https://andrewford.co.nz` | CORS allowed origins for API requests                 |
| `LOG_LEVEL`       | `info`                     | Winston logging level (error, warn, info, debug)      |

### API Keys (Required for functionality)

| Variable             | Value                                   | Description                          |
| -------------------- | --------------------------------------- | ------------------------------------ |
| `OPENAI_API_KEY`     | `sk-...`                                | OpenAI API key for RAG embeddings    |
| `OPENROUTER_API_KEY` | `sk-...`                                | OpenRouter API key for LLM responses |
| `OPENROUTER_MODEL`   | `meta-llama/llama-3.2-3b-instruct:free` | LLM model for chatbot responses      |
| `LASTFM_API_KEY`     | `your-lastfm-key`                       | Last.fm API key for music widget     |
| `YOUTUBE_API_KEY`    | `your-youtube-key`                      | YouTube Data API v3 key              |
| `YOUTUBE_CHANNEL_ID` | `your-channel-id`                       | YouTube channel ID for video feed    |

### Build Configuration (Optional)

| Variable  | Value                      | Description                         |
| --------- | -------------------------- | ----------------------------------- |
| `API_URL` | `https://andrewford.co.nz` | API base URL for 11ty build process |
| `URL`     | `https://andrewford.co.nz` | Site URL for 11ty build             |

## Coolify Dashboard Configuration Steps

### 1. Access Environment Variables

1. Log in to your Coolify dashboard
2. Navigate to your project: `andrewford-blog`
3. Go to **Environment Variables** section
4. Click **Add Environment Variable**

### 2. Add Each Variable

For each variable in the tables above:

1. **Name**: Enter the variable name exactly as shown (case-sensitive)
2. **Value**: Enter the corresponding value
3. **Scope**: Select `Build & Runtime` for all variables
4. **Secret**: Mark as secret for API keys (OPENAI_API_KEY, OPENROUTER_API_KEY, etc.)
5. Click **Save**

### 3. Priority Configuration Order

Add variables in this order for optimal setup:

1. **Application Configuration** (NODE_ENV, PORT, SITE_URL, etc.)
2. **API Keys** (mark all as secrets)
3. **Build Configuration** (API_URL, URL)

### 4. Verification

After adding all variables, verify the configuration:

1. Check that all required variables are present
2. Ensure API keys are marked as secrets (🔒 icon)
3. Confirm build & runtime scope is selected
4. Save the configuration

## Security Best Practices

### API Key Management

- ✅ **Always mark API keys as secrets** in Coolify
- ✅ **Use separate keys** for production vs development
- ✅ **Rotate keys regularly** (quarterly recommended)
- ❌ **Never commit API keys** to version control

### CORS Configuration

- ✅ **Restrict ALLOWED_ORIGINS** to your domain only
- ✅ **Use HTTPS URLs** in production
- ❌ **Avoid wildcard origins** (`*`) in production

### Logging

- ✅ **Use `info` level** for production logging
- ✅ **Monitor log output** for errors
- ❌ **Avoid `debug` level** in production (performance impact)

## API Key Setup Instructions

### OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key starting with `sk-`
4. Add to Coolify as `OPENAI_API_KEY`

### OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Create a new API key
3. Copy the key starting with `sk-`
4. Add to Coolify as `OPENROUTER_API_KEY`

### Last.fm API Key

1. Visit [Last.fm API](https://www.last.fm/api/account/create)
2. Create a new application
3. Copy the API key (32-character string)
4. Add to Coolify as `LASTFM_API_KEY`

### YouTube API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Enable YouTube Data API v3
3. Create credentials (API Key)
4. Copy the API key
5. Add to Coolify as `YOUTUBE_API_KEY`

### YouTube Channel ID

1. Visit your YouTube channel
2. Copy the channel ID from the URL or channel settings
3. Add to Coolify as `YOUTUBE_CHANNEL_ID`

## Troubleshooting

### Common Issues

| Issue                           | Cause                        | Solution                                  |
| ------------------------------- | ---------------------------- | ----------------------------------------- |
| API endpoints return 500 errors | Missing API keys             | Verify all API keys are set and valid     |
| CORS errors in browser          | Incorrect ALLOWED_ORIGINS    | Check domain matches exactly              |
| Build fails                     | Missing API_URL              | Set API_URL to match SITE_URL             |
| Chatbot doesn't work            | OpenAI/OpenRouter key issues | Verify both keys are set and have credits |

### Environment Variable Validation

To verify your environment variables are working, check these endpoints after deployment:

- **Health Check**: `https://andrewford.co.nz/health`
- **Last.fm API**: `https://andrewford.co.nz/api/lastplayed`
- **YouTube API**: `https://andrewford.co.nz/api/latestUploads`
- **Chatbot API**: `POST https://andrewford.co.nz/api/chatrag`

## Next Steps

After configuring all environment variables in Coolify:

1. ✅ Verify all variables are set correctly
2. ✅ Ensure secrets are marked properly
3. ✅ Test the configuration with a staging deployment
4. ✅ Proceed to domain and SSL configuration (Task 4.3)
