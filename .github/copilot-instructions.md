# Andrew Ford 11ty Blog - Development Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap the Repository

```bash
# Install dependencies - takes 6-7 minutes
npm install
# NEVER CANCEL: Set timeout to 10+ minutes. This step rebuilds native modules like faiss-node.
```

### Build the Static Site

```bash
# Production build - takes 3-4 minutes
npm run build
# NEVER CANCEL: Set timeout to 10+ minutes. Generates ~152MB static site in _site/ directory.

# Development build (faster, includes drafts)
npm run build:dev
```

### Development Servers

```bash
# Start 11ty development server (port 8080)
npm run start
# Server available at http://localhost:8080/

# Start API server (port 3000) - run in separate terminal
npm run api:dev
# API endpoints available at http://localhost:3080/api/*

# Combined development (both servers)
npm run dev:api
# NEVER CANCEL: Takes 2-3 minutes to start both servers. Set timeout to 5+ minutes.
```

### Testing

```bash
# Jest unit tests (mock-based, fast)
npm test
# Takes ~7 seconds. Some tests may fail without API keys (expected).

# Supertest tests (HTTP-level testing)
npm run test:supertest

# Integration tests (requires both dev servers running)
npm run test:integration
# Start servers first: npm run start & npm run api:dev

# All tests (Jest + integration)
npm run test:all
# NEVER CANCEL: Set timeout to 5+ minutes when including integration tests.

# End-to-end tests with Playwright
npm run test:e2e
# NEVER CANCEL: Set timeout to 10+ minutes. Requires dev server running.
```

### Code Quality

```bash
# Format all code (takes ~24 seconds)
npm run prettier

# Check markdown linting (takes ~1.5 seconds)
npm run markdownlint
# May show H1 heading warnings - these are content issues, not code errors.

# Always run before committing
npm run prettier && npm run markdownlint
```

## Validation

### Always Complete These Steps After Changes

1. **Build validation**: Run `npm run build` and verify it completes without errors
2. **Test core functionality**: Run `npm test` and ensure Jest tests pass
3. **Format validation**: Run `npm run prettier` to ensure code style compliance
4. **Manual verification**: Start both development servers and test key functionality
5. **Content validation**: Run `npm run markdownlint` to check markdown quality

### Manual Testing Scenarios

After making changes, always test these scenarios:

#### Basic Site Functionality

```bash
# Start development server
npm run start
# Verify homepage loads: curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/
# Expected: 200

# Check archive pages load
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/archive/
# Expected: 200

# Check individual article loads
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/articles/automate-github-security-updates-comet-browser-copilot-agent-in-action/
# Expected: 200
```

#### API Integration Testing

```bash
# Start API server
npm run api:dev
# Test API endpoints (expect 500 without API keys)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3080/api/lastplayed
curl -s -o /dev/null -w "%{http_code}" http://localhost:3080/api/latestUploads
# Expected: 500 (no API keys) or 200 (with valid API keys)
```

#### Full Workflow Test

```bash
# Complete development workflow test
npm install && npm run build && npm test && npm run prettier
# NEVER CANCEL: Total time ~10-12 minutes. Set timeout to 20+ minutes.
```

## Environment Setup

### Required Environment Variables

Create `.env` file with:

```bash
API_URL=
LASTFM_API_KEY=
SITE_URL=
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
OPENAI_API_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

### Global Dependencies

```bash
# Verify Node.js version (required: 20+)
node --version
# Expected: v20.x.x or higher (see .nvmrc)

# Docker for local containerized testing (optional)
docker --version
# Expected: Docker version 20.x.x or higher
```

## Architecture Understanding

### Key Projects in Codebase

- **\_data/**: Data files for build-time API fetching (latestMusic.mjs, latestVideos.mjs)
- **api/**: Express API server with routes for Last.fm, YouTube, and chatbot
- **functions/**: Legacy serverless functions (maintained for compatibility)
- **content/**: All markdown content and articles
- **tests/**: Multi-layered testing (Jest, Supertest, Integration, E2E)
- **vector_store/**: Vector database for RAG chatbot functionality

### Build Process

1. **11ty Build**: Generates static site from markdown and templates
2. **Data Fetching**: Fetches music/video data during build (requires API server)
3. **API Integration**: Both build-time and runtime API calls supported
4. **Asset Processing**: Images, CSS bundling, syntax highlighting

### Development Workflow

1. **Dual Servers**: 11ty dev server (:8080) + API server (:3000)
2. **Hot Reloading**: 11ty watches for changes and rebuilds
3. **API Development**: API server provides endpoints during development
4. **Testing**: Multiple test layers for comprehensive coverage

## Common Issues and Solutions

### Build Failures

- **API Connection Errors**: Expected during build without API server running
- **Missing Dependencies**: Run `npm rebuild faiss-node` if vector store fails
- **Memory Issues**: Build may use significant memory (152MB output)

### Test Failures

- **API Key Errors**: Many tests expect API errors (500) without valid keys
- **Module Resolution**: Some tests may fail due to ES module/CommonJS conflicts
- **Integration Test Prerequisites**: Requires both dev servers running

### Content Validation Issues

- **H1 Heading Violations**: `content/about/index.md` and `content/privacy/index.md` have multiple H1 tags
- **SEO Title Warnings**: Many articles have titles longer than 60 characters (expected warnings)
- **API Connection Errors**: Build-time API fetching fails without API server (expected behavior)

### Development Server Issues

- **Port Conflicts**: 11ty uses :8080, API uses :3000
- **API Timeouts**: Initial API responses may be slow (vector store loading)
- **Hot Reload**: Changes to API require server restart

## Production Deployment

### Docker Build

```bash
# Build container image
npm run docker:build
# NEVER CANCEL: Set timeout to 15+ minutes. Builds production Docker image.

# Run containerized application locally
npm run docker:run
# Starts container on port 3000, requires .env file

# Development with Docker Compose
npm run docker:dev
# Starts full development environment in containers
```

### Coolify Deployment

The site is hosted on a personal VPS using Coolify with Docker containers:

- **Deployment**: Automatic deployment via Docker containers managed by Coolify
- **Configuration**: `coolify.yaml` defines container setup and resource limits
- **Build Process**: Docker build followed by container deployment
- **Environment**: Production variables configured in Coolify dashboard
- **Health Checks**: Built-in health monitoring at `/health` endpoint
- **SSL/TLS**: Automatic certificate management via Traefik and Let's Encrypt

## Performance Expectations

| Command              | Expected Time | Timeout Setting |
| -------------------- | ------------- | --------------- |
| npm install          | 6-7 minutes   | 10+ minutes     |
| npm run build        | 3-4 minutes   | 10+ minutes     |
| npm test             | 7 seconds     | 2 minutes       |
| npm run prettier     | 24 seconds    | 2 minutes       |
| npm run markdownlint | 1.5 seconds   | 1 minute        |
| npm run test:e2e     | 5+ minutes    | 10+ minutes     |
| npm run test:all     | 7+ minutes    | 15+ minutes     |

**CRITICAL**: NEVER CANCEL builds or long-running commands. Build processes may take significant time due to static site generation, native module compilation, and comprehensive testing.
