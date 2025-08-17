# Tasks: Migrate 11ty Website from Netlify to Coolify

## Relevant Files

- `api/server.js` - Main Express.js API server (to be created)
- `api/routes/chatrag.js` - RAG chatbot endpoint migrated from Netlify Function
- `api/routes/lastplayed.js` - Last.fm API endpoint migrated from Netlify Function
- `api/routes/latestUploads.js` - YouTube API endpoint migrated from Netlify Function
- `api/utils/vectorSearch.js` - Vector search utility (migrated from functions/vectorSearch.js)
- `Dockerfile` - Multi-stage Docker build for 11ty + API server (to be created)
- `docker-compose.yml` - Local development container setup (to be created)
- `.dockerignore` - Docker build optimization (to be created)
- `_data/latestMusic.mjs` - Update to use new API endpoint
- `_data/latestVideos.mjs` - Update to use new API endpoint
- `package.json` - Update scripts for containerized development
- `eleventy.config.mjs` - Update configuration for containerized build
- `.env.example` - Document required environment variables
- `coolify.yaml` - Coolify deployment configuration (to be created)
- `tests/api/chatrag.test.js` - API endpoint tests (to be created)
- `tests/api/lastplayed.test.js` - API endpoint tests (to be created)
- `tests/api/latestUploads.test.js` - API endpoint tests (to be created)
- `public/scripts/chat.js` - Update chatbot to use new API endpoint

### Notes

- API tests should be placed in `tests/api/` directory to separate from existing Netlify Function tests
- Use `npm test` to run all tests including new API endpoint tests
- Vector store files (`vector_store/`) need to be included in Docker container
- Environment variables must be migrated from Netlify to Coolify deployment

## Tasks

- [ ] 1.0 Create containerized Node.js API server to replace Netlify Functions
  - [ ] 1.1 Set up Express.js server structure with CORS and middleware
  - [ ] 1.2 Create `/api/chatrag` endpoint with streaming support and RAG functionality
  - [ ] 1.3 Create `/api/lastplayed` endpoint for Last.fm integration
  - [ ] 1.4 Create `/api/latestUploads` endpoint for YouTube API integration
  - [ ] 1.5 Migrate vector search utility and ensure vector store loading
  - [ ] 1.6 Add comprehensive error handling and logging
  - [ ] 1.7 Write unit tests for all API endpoints

- [ ] 2.0 Containerize 11ty application with Docker multi-stage build
  - [ ] 2.1 Create Dockerfile with Node.js base image and multi-stage build
  - [ ] 2.2 Configure build stage for 11ty static site generation
  - [ ] 2.3 Configure production stage with API server and static file serving
  - [ ] 2.4 Include vector store files and required dependencies
  - [ ] 2.5 Create .dockerignore for optimized build
  - [ ] 2.6 Create docker-compose.yml for local development
  - [ ] 2.7 Test container build and local deployment

- [ ] 3.0 Update 11ty build configuration to use new API endpoints
  - [ ] 3.1 Update _data/latestMusic.mjs to use containerized API endpoint
  - [ ] 3.2 Update _data/latestVideos.mjs to use containerized API endpoint
  - [ ] 3.3 Update public/scripts/chat.js to use new chatbot API endpoint
  - [ ] 3.4 Modify package.json scripts for containerized development workflow
  - [ ] 3.5 Update eleventy.config.mjs for container-compatible build process
  - [ ] 3.6 Test local build process with new API endpoints

- [ ] 4.0 Implement Coolify deployment configuration and environment setup
  - [ ] 4.1 Create coolify.yaml deployment configuration
  - [ ] 4.2 Configure environment variables in Coolify dashboard
  - [ ] 4.3 Set up domain routing and SSL certificate configuration
  - [ ] 4.4 Configure health checks and monitoring
  - [ ] 4.5 Set up build triggers and deployment automation
  - [ ] 4.6 Test staging deployment on Coolify server

- [ ] 5.0 Migrate and test complete system with DNS cutover
  - [ ] 5.1 Export and document all current Netlify environment variables
  - [ ] 5.2 Perform comprehensive testing of all functionality in staging
  - [ ] 5.3 Validate chatbot RAG functionality with vector store
  - [ ] 5.4 Test Last.fm and YouTube API integrations
  - [ ] 5.5 Verify 11ty build process works with containerized APIs
  - [ ] 5.6 Create rollback plan and backup of current Netlify setup
  - [ ] 5.7 Execute DNS cutover to Coolify server
  - [ ] 5.8 Monitor system performance and validate all endpoints post-migration