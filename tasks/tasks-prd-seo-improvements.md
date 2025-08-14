# Task List: SEO Improvements Implementation

## Relevant Files

- `_includes/schemas/article.njk` - Article schema template for blog posts and articles
- `_includes/schemas/person.njk` - Person schema template for author information
- `_includes/schemas/breadcrumb.njk` - BreadcrumbList schema template
- `_includes/schemas/website.njk` - WebSite schema with SearchAction
- `_includes/schemas/organization.njk` - Organization schema for site owner
- `_includes/schemas/video.njk` - VideoObject schema for YouTube embeds
- `_includes/schemas/faq.njk` - FAQ schema template
- `_includes/components/breadcrumb.njk` - Breadcrumb navigation component
- `_includes/components/related-posts.njk` - Related posts component for articles
- `_includes/layouts/base.njk` - Base template (modify for schema injection and title format)
- `_includes/layouts/post.njk` - Post template (modify for heading hierarchy)
- `_includes/layouts/home.njk` - Home template (fix multiple H1 issues)
- `_data/schemas.mjs` - Schema generator utilities and helpers
- `_data/seo.mjs` - SEO utilities for meta descriptions and title generation
- `eleventy.config.mjs` - Main config (add filters and validation)
- `eleventy.config.seo.mjs` - New SEO-specific configuration module
- `tests/seo-validation.test.mjs` - Tests for SEO validation functions
- `tests/schema-generation.test.mjs` - Tests for schema generation

### Notes

- Schema templates will use Nunjucks templating to dynamically generate JSON-LD
- The 11ty navigation plugin is already available and will be used for breadcrumbs
- Meta description auto-generation will use Eleventy filters for processing
- All schema markup will be validated using Google's Rich Results Test

## Tasks

- [x] 1.0 Implement Structured Data (JSON-LD) System ✅

  - [x] 1.1 Create `_includes/schemas/` directory structure
  - [x] 1.2 Create Article schema template with all required properties (headline, author, publisher, dates, image)
  - [x] 1.3 Create Person schema template for author information
  - [x] 1.4 Create Organization schema template with logo and contact info
  - [x] 1.5 Create WebSite schema with SearchAction for homepage
  - [x] 1.6 Create BreadcrumbList schema template
  - [x] 1.7 Create VideoObject schema for YouTube embeds detection
  - [x] 1.8 Create FAQ schema template for Q&A content
  - [x] 1.9 Create `_data/schemas.mjs` with helper functions for schema generation
  - [x] 1.10 Modify `base.njk` to inject appropriate schemas based on page type
  - [x] 1.11 Add schema type detection logic based on page frontmatter and content
  - [x] 1.12 Test all schemas with Google Rich Results Test

- [x] 2.0 Fix Title Tag Format and Optimization

  - [x] 2.1 Update title tag in `base.njk` to use "Andrew Ford - {{ title }}" format
  - [x] 2.2 Create title generation filter in `_data/seo.mjs`
  - [x] 2.3 Implement conditional logic for homepage title ("Andrew Ford - Full Stack Developer, Mentor & Educator")
  - [x] 2.4 Add title format for articles ("Andrew Ford - [Article Title]")
  - [x] 2.5 Add title format for archive pages ("Andrew Ford - Archive - [Year/Category]")
  - [x] 2.6 Add title format for notes ("Andrew Ford - Note - [Note Title]")
  - [x] 2.7 Implement title length validation (50-60 characters warning)
  - [x] 2.8 Update all page frontmatter to ensure proper titles

- [x] 3.0 Create Meta Description Auto-Generation System

  - [x] 3.1 Create `metaDescription` filter in `eleventy.config.mjs`
  - [x] 3.2 Implement content extraction logic (first 160 chars)
  - [x] 3.3 Add markdown stripping functionality
  - [x] 3.4 Add HTML tag removal functionality
  - [x] 3.5 Implement ellipsis addition for truncated descriptions
  - [x] 3.6 Create fallback hierarchy (frontmatter → auto-generate → site default)
  - [x] 3.7 Update `base.njk` to use new meta description system
  - [x] 3.8 Add character count validation (150-160 characters)
  - [x] 3.9 Ensure uniqueness checking across all pages

- [x] 4.0 Fix Heading Hierarchy and Add Validation

  - [x] 4.1 Audit and fix `home.njk` to have single H1
  - [x] 4.2 Convert homepage secondary headings to H2
  - [x] 4.3 Update "Latest" and "Latest Videos" sections to use H2
  - [x] 4.4 Review `post.njk` template heading structure
  - [x] 4.5 Create heading hierarchy validator in build process
  - [x] 4.6 Add validation for H-level skipping detection
  - [x] 4.7 Update existing article content to fix heading issues
  - [x] 4.8 Add build-time warnings for heading hierarchy violations
  - [x] 4.9 Document heading best practices in CLAUDE.md

- [x] 5.0 Implement Breadcrumb Navigation with Schema

  - [x] 5.1 Create `_includes/components/breadcrumb.njk` component
  - [x] 5.2 Configure 11ty navigation plugin for breadcrumb generation
  - [x] 5.3 Add breadcrumb CSS styling matching site design
  - [x] 5.4 Implement breadcrumb separator using CSS pseudo-elements (›)
  - [x] 5.5 Add breadcrumb schema generation inline with component
  - [x] 5.6 Insert breadcrumb component in article/post templates
  - [x] 5.7 Insert breadcrumb component in archive templates
  - [x] 5.8 Insert breadcrumb component in notes templates
  - [x] 5.9 Add ARIA labels for accessibility
  - [x] 5.10 Test responsive design on mobile devices

- [x] 6.0 Enhance Internal Linking and Related Posts
  - [x] 6.1 Create `_includes/components/related-posts.njk` component
  - [x] 6.2 Implement tag-based related posts algorithm
  - [x] 6.3 Add related posts data generation in `_data/` directory
  - [x] 6.4 Display 3-5 related posts at article end
  - [x] 6.5 Style related posts to match existing article list design
  - [x] 6.6 Add related posts to Article schema as relatedLink
  - [ ] 6.7 Create internal linking suggestions system
  - [ ] 6.8 Audit existing content for internal linking opportunities
  - [ ] 6.9 Update high-traffic articles with contextual internal links
  - [ ] 6.10 Create topic clusters documentation for content strategy
