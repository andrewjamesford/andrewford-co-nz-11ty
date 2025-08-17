# PRD: Migrate 11ty Website from Netlify to Coolify

## Introduction/Overview

This PRD outlines the migration of an 11ty static site generator website from Netlify hosting to a self-hosted Coolify server environment. The primary drivers are gaining more infrastructure control and addressing technical limitations with Netlify. The migration involves containerizing the application, replacing Netlify Functions with a Node.js API server, and ensuring the build process can access required APIs for content generation.

**Goal:** Successfully migrate the 11ty website off Netlify to Coolify with zero data loss, maintained functionality, and improved infrastructure control.

## Goals

1. **Complete Migration**: Move from Netlify to Coolify with 99%+ uptime maintained
2. **Functional Parity**: Maintain all current website functionality including API endpoints
3. **Containerization**: Package the application in Docker containers for Coolify deployment
4. **API Replacement**: Replace 3 Netlify Functions with equivalent Node.js API endpoints
5. **Build Process**: Ensure 11ty build can access YouTube and Last.fm APIs during generation
6. **Performance**: Maintain or improve current site performance and response times
7. **Quick Implementation**: Complete migration ASAP with minimal complexity

## User Stories

### As a Website Visitor

- I want to access the website with the same speed and reliability as before
- I want all existing content and functionality to work exactly as it currently does
- I want the chatbot with RAG functionality to continue working seamlessly

### As a Content Creator (Website Owner)

- I want my build process to automatically trigger when content changes
- I want my APIs (YouTube and Last.fm integrations) to continue working during builds
- I want to maintain control over my hosting infrastructure
- I want to avoid any content or data loss during migration

### As a Developer

- I want a containerized application that's easy to deploy and manage
- I want clear documentation for the new deployment process
- I want the ability to easily rollback if issues arise

## Functional Requirements

### 1. Containerization

1.1. Create Dockerfile for the 11ty application with Node.js runtime
1.2. Create separate container for API server (Express or Hono)
1.3. Configure multi-container setup with proper networking
1.4. Ensure containers can communicate for build-time API access

### 2. API Server Development

2.1. Implement endpoint for content fetching from third-party APIs
2.2. Implement endpoint for YouTube API integration
2.3. Implement endpoint for Last.fm API integration  
2.4. Implement chatbot endpoint with RAG functionality
2.5. Ensure API endpoints match current Netlify Functions behavior
2.6. Add proper error handling and logging

### 3. Build Process Migration

3.1. Configure 11ty build to use new API endpoints instead of Netlify Functions
3.2. Ensure build process can access YouTube and Last.fm APIs
3.3. Maintain current build triggers on content changes
3.4. Implement build output serving mechanism

### 4. Coolify Deployment

4.1. Configure Coolify project for multi-container deployment
4.2. Set up environment variables for API keys and configuration
4.3. Configure domain routing and SSL certificates
4.4. Set up monitoring and health checks

### 5. Data Migration

5.1. Export all existing content and configuration from Netlify
5.2. Migrate environment variables and secrets securely
5.3. Test all migrated functionality before DNS cutover

## Non-Goals (Out of Scope)

- RAG chatbot improvements (explicitly noted for future development)
- Database implementation (current architecture uses APIs to third parties only)
- Performance optimization beyond maintaining current levels
- UI/UX changes to the website
- SEO or content improvements
- Migration of domain registration (DNS pointing only)
- Advanced monitoring or analytics setup
- Auto-scaling or load balancing (single server deployment)

## Design Considerations

### Architecture Overview

```
[User] → [Coolify/Nginx] → [11ty Static Files + API Server Container]
                          ↓
                    [Third-party APIs: YouTube, Last.fm]
```

### Container Strategy

- **Single Container Approach**: Package both static site and API server in one container for simplicity
- **Port Configuration**: API server on internal port, static files served via nginx
- **Build Strategy**: Multi-stage Docker build (build stage + serve stage)

### API Framework Choice

- No strong preference specified - recommend Express.js for familiarity and ecosystem
- Hono could be considered for performance benefits if needed

## Technical Considerations

### Current Netlify Functions Analysis

- **Function 1**: Content fetching from third-party APIs
- **Function 2**: YouTube API integration
- **Function 3**: Last.fm API integration + RAG chatbot functionality
- **Runtime**: Node.js environment required
- **Dependencies**: Existing packages need to be maintained

### Server Specifications

- **Available Resources**: 16GB RAM, 4 CPUs, 200GB storage
- **Current Usage**: Low traffic, other low-usage applications present
- **Container Requirements**: Sufficient resources for Node.js API + static serving

### Build Dependencies

- 11ty build process requires API access to YouTube and Last.fm
- APIs must be available during container build process
- Consider build-time vs runtime API access patterns

## Success Metrics

### Technical Success Criteria

1. **Uptime**: Maintain 99%+ availability during and after migration
2. **Performance**: Page load times within 10% of current performance
3. **Functionality**: All 3 API endpoints working with same response format
4. **Build Process**: Successful builds with API data integration
5. **Zero Data Loss**: All content and configuration preserved

### Migration Success Criteria

1. **DNS Cutover**: Successful pointing to new infrastructure
2. **SSL Certificates**: HTTPS working correctly post-migration
3. **API Compatibility**: All endpoints responding correctly
4. **Content Validation**: All pages rendering correctly

## Open Questions

1. **Domain Management**: Current domain provider and DNS management approach?
2. **SSL Certificates**: Coolify automatic SSL or manual certificate management?
3. **Build Triggers**: How will content change detection work without Netlify's git integration?
4. **Environment Variables**: Complete list of all current environment variables used?
5. **Backup Strategy**: What backup/disaster recovery approach should be implemented?
6. **Monitoring**: What level of application monitoring is desired post-migration?

## Implementation Timeline

### Phase 1: Preparation (1-2 days)

- Audit current Netlify Functions code
- Document all environment variables and configuration
- Set up local development environment

### Phase 2: Containerization (2-3 days)

- Create Dockerfile and container setup
- Implement API server with equivalent endpoints
- Test container deployment locally

### Phase 3: Coolify Setup (1-2 days)

- Configure Coolify project and deployment
- Set up domain and SSL configuration
- Deploy and test in staging environment

### Phase 4: Migration (1 day)

- Final testing and validation
- DNS cutover to new infrastructure
- Monitor and verify all functionality

**Total Estimated Timeline: 5-8 days**
