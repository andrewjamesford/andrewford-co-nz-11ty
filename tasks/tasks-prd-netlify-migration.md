# Tasks: Migrate 11ty Website from Netlify to Coolify

## Relevant Files

- `api/server.js` - Main Express.js API server with health check endpoint ✅
- `api/routes/chatrag.js` - RAG chatbot endpoint with streaming support ✅
- `api/routes/lastplayed.js` - Last.fm API endpoint for music widget ✅
- `api/routes/latestUploads.js` - YouTube API endpoint for video feed ✅
- `api/utils/vectorSearch.js` - Vector search utility for RAG functionality ✅
- `api/utils/logger.js` - Winston logging configuration ✅
- `Dockerfile` - Multi-stage Docker build for 11ty + API server ✅
- `docker-compose.yml` - Local development and production container setup ✅
- `.dockerignore` - Docker build optimization configuration ✅
- `_data/latestMusic.mjs` - Updated to use new /api/lastplayed endpoint ✅
- `_data/latestVideos.mjs` - Updated to use new /api/latestUploads endpoint ✅
- `package.json` - Updated with containerized scripts and dependencies ✅
- `eleventy.config.mjs` - Compatible with containerized build process ✅
- `.env.example` - Environment variables template (created but gitignored)
- `coolify.yaml` - Coolify deployment configuration with Docker and Traefik settings ✅
- `docs/coolify-environment-setup.md` - Complete environment variables setup guide ✅
- `docs/coolify-domain-ssl-setup.md` - Domain routing and SSL certificate configuration guide ✅
- `docs/coolify-monitoring-setup.md` - Comprehensive health checks and monitoring configuration ✅
- `api/server.js` - Enhanced health endpoint with detailed status and API validation ✅
- `tests/api/chatrag.test.js` - Comprehensive API endpoint tests ✅
- `tests/api/lastplayed.test.js` - Last.fm endpoint unit tests ✅
- `tests/api/latestUploads.test.js` - YouTube endpoint unit tests ✅
- `public/scripts/chat.js` - Updated to use new /api/chatrag endpoint ✅

### Notes

- API tests should be placed in `tests/api/` directory to separate from existing Netlify Function tests
- Use `npm test` to run all tests including new API endpoint tests
- Vector store files (`vector_store/`) need to be included in Docker container
- Environment variables must be migrated from Netlify to Coolify deployment

## Tasks

- [x] 1.0 Create containerized Node.js API server to replace Netlify Functions

  - [x] 1.1 Set up Express.js server structure with CORS and middleware
  - [x] 1.2 Create `/api/chatrag` endpoint with streaming support and RAG functionality
  - [x] 1.3 Create `/api/lastplayed` endpoint for Last.fm integration
  - [x] 1.4 Create `/api/latestUploads` endpoint for YouTube API integration
  - [x] 1.5 Migrate vector search utility and ensure vector store loading
  - [x] 1.6 Add comprehensive error handling and logging
  - [x] 1.7 Write unit tests for all API endpoints

- [x] 2.0 Containerize 11ty application with Docker multi-stage build

  - [x] 2.1 Create Dockerfile with Node.js base image and multi-stage build
  - [x] 2.2 Configure build stage for 11ty static site generation
  - [x] 2.3 Configure production stage with API server and static file serving
  - [x] 2.4 Include vector store files and required dependencies
  - [x] 2.5 Create .dockerignore for optimized build
  - [x] 2.6 Create docker-compose.yml for local development
  - [x] 2.7 Test container build and local deployment

- [x] 3.0 Update 11ty build configuration to use new API endpoints

  - [x] 3.1 Update \_data/latestMusic.mjs to use containerized API endpoint
  - [x] 3.2 Update \_data/latestVideos.mjs to use containerized API endpoint
  - [x] 3.3 Update public/scripts/chat.js to use new chatbot API endpoint
  - [x] 3.4 Modify package.json scripts for containerized development workflow
  - [x] 3.5 Update eleventy.config.mjs for container-compatible build process
  - [x] 3.6 Test local build process with new API endpoints

- [ ] 4.0 Implement Coolify deployment configuration and environment setup

  - [x] 4.1 Create coolify.yaml deployment configuration
  - [x] 4.2 Configure environment variables in Coolify dashboard
  - [x] 4.3 Set up domain routing and SSL certificate configuration
  - [x] 4.4 Configure health checks and monitoring
  - [x] 4.5 Set up build triggers and deployment automation
  - [x] 4.6 Test staging deployment on Coolify server

- [ ] 5.0 Migrate and test complete system with DNS cutover
  - [x] 5.1 Export and document all current Netlify environment variables
  - [x] 5.2 Perform comprehensive testing of all functionality in staging
  - [x] 5.3 Validate chatbot RAG functionality with vector store
  - [x] 5.4 Test Last.fm and YouTube API integrations
  - [x] 5.5 Verify 11ty build process works with containerized APIs
  - [x] 5.6 Create rollback plan and backup of current Netlify setup
  - [ ] 5.7 Execute DNS cutover to Coolify server
  - [ ] 5.8 Monitor system performance and validate all endpoints post-migration
