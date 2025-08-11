# Product Requirements Document: SEO Improvements for andrewford.co.nz

## Introduction/Overview

This PRD outlines comprehensive SEO improvements for the andrewford.co.nz website built with Eleventy v3. The implementation addresses critical technical SEO issues identified in a recent audit, focusing on structured data implementation, meta tag optimization, and content hierarchy improvements. These changes aim to improve search engine visibility, enable rich snippets, and enhance the overall discoverability of the site's content.

## Goals

1. **Implement comprehensive structured data** using JSON-LD schema markup to enable rich snippets in search results
2. **Fix title tag formatting** to follow SEO best practices (Brand - Page Title format)
3. **Auto-generate unique meta descriptions** from content to improve SERP click-through rates
4. **Establish proper heading hierarchy** across all pages (single H1, logical H2-H6 flow)
5. **Add breadcrumb navigation** with schema markup for better UX and SEO
6. **Improve internal linking structure** within article content
7. **Maintain or improve current Core Web Vitals** scores while implementing changes
8. **Achieve 100% pass rate** in Google Search Console's validation tools

## User Stories

1. **As a search engine crawler**, I want to find structured data on each page so that I can better understand the content and display rich snippets in search results.

2. **As a site visitor from search results**, I want to see accurate, descriptive meta titles and descriptions so that I know what content to expect before clicking.

3. **As a reader navigating the site**, I want breadcrumb navigation so that I can understand where I am in the site hierarchy and easily navigate to parent sections.

4. **As a content consumer**, I want properly structured headings so that I can quickly scan and understand the content hierarchy.

5. **As a search engine**, I want to find auto-generated meta descriptions for all pages so that I can display relevant snippets in search results.

6. **As Google Search Console**, I want to validate all structured data without errors so that rich results can be displayed.

## Functional Requirements

### 1. Structured Data Implementation

1.1. **Create JSON-LD schema templates** for the following types:

- Article schema for all blog posts and articles
- Person schema for author information
- BreadcrumbList schema for navigation hierarchy
- WebSite schema with SearchAction on homepage
- FAQ schema for applicable content
- VideoObject schema for pages with YouTube embeds
- Organization schema for the site owner

  1.2. **Implement schema injection system** in base template that:

- Dynamically generates appropriate schema based on page type
- Includes all required and recommended schema properties
- Validates against Google's structured data requirements

  1.3. **Schema must include** (where applicable):

- headline, description, datePublished, dateModified
- author with Person type
- publisher with Organization type
- image with proper dimensions (minimum 1200x630)
- mainEntityOfPage
- articleBody or full content where appropriate

### 2. Title Tag Optimization

2.1. **Reverse current title format** from `{{ title }} - Andrew Ford` to `Andrew Ford - {{ title }}`

2.2. **Implement conditional title logic**:

- Homepage: "Andrew Ford - Full Stack Developer, Mentor & Educator"
- Articles: "Andrew Ford - [Article Title]"
- Archive: "Andrew Ford - Archive - [Year/Category]"
- Notes: "Andrew Ford - Note - [Note Title]"

  2.3. **Title length validation**: Ensure titles stay within 50-60 characters when possible

### 3. Meta Description Auto-Generation

3.1. **Create meta description generator** that:

- Extracts first 160 characters of content (excluding markdown)
- Strips HTML tags and special characters
- Adds ellipsis if truncated
- Falls back to manual description if provided in frontmatter

  3.2. **Priority system**:

- Use frontmatter `description` if present
- Auto-generate from content if no description
- Use site default as last fallback

  3.3. **Ensure descriptions are**:

- Between 150-160 characters
- Unique per page
- Free of duplicate content

### 4. Heading Hierarchy Fixes

4.1. **Homepage heading structure**:

- Convert to single H1 for main heading
- Change subsequent headings to H2
- Ensure "Latest" and "Latest Videos" are H2

  4.2. **Article/Post templates**:

- Maintain single H1 for article title
- Ensure content headings start at H2
- Validate no H-level skipping (H1→H3)

  4.3. **Create heading validation** in build process to catch hierarchy issues

### 5. Breadcrumb Navigation

5.1. **Implement breadcrumb component** using 11ty navigation plugin:

- Display on all article, note, and archive pages
- Show hierarchy: Home > Category > Current Page
- Include structured data markup

  5.2. **Breadcrumb requirements**:

- Responsive design matching current site style
- Use existing CSS variables for consistency
- Include proper ARIA labels for accessibility
- Generate BreadcrumbList schema automatically

  5.3. **Breadcrumb position**: Place between header and main content

### 6. Internal Linking Improvements

6.1. **Create related posts system**:

- Auto-suggest related articles based on tags
- Display 3-5 related posts at article end
- Include in article schema as relatedLink

  6.2. **Enhance existing content**:

- Add contextual links between related articles
- Create topic clusters for main content themes
- Ensure all articles have at least 2 internal links

### 7. Technical Implementation Details

7.1. **File structure**:

- Create `_includes/schemas/` directory for schema templates
- Add schema generator utilities to `_data/`
- Modify base.njk to include schema injection

  7.2. **Build process updates**:

- Add validation step for structured data
- Check heading hierarchy during build
- Validate meta description generation

  7.3. **Performance considerations**:

- Inline JSON-LD in head (no external requests)
- Minimize schema size (no unnecessary properties)
- Use Eleventy's data cascade for efficiency

## Non-Goals (Out of Scope)

1. **URL structure changes** - Maintain all current URLs to avoid breaking existing links and losing SEO value
2. **Heavy JavaScript libraries** - No client-side schema generation or heavy SEO libraries
3. **Visual design changes** - SEO improvements should not alter the current visual design (except breadcrumbs)
4. **AMP implementation** - No Accelerated Mobile Pages implementation
5. **Cookie consent systems** - Not adding GDPR/cookie consent unless required
6. **Paid SEO tools integration** - Focus on organic, built-in improvements
7. **Content rewriting** - No modification of existing article content (only meta/structure)
8. **Multilingual support** - No hreflang or translation features in this phase

## Design Considerations

1. **Breadcrumb styling**:

   - Use existing site typography and color scheme
   - Implement with existing CSS variables
   - Mobile-responsive with proper touch targets
   - Separator using CSS pseudo-elements (›)

2. **Schema implementation**:

   - Hidden from visual display (in script tags)
   - No impact on page layout or design
   - Generated server-side during build

3. **Related posts display**:
   - Match existing article list styling
   - Use same card/list format as homepage
   - Maintain consistent spacing and typography

## Technical Considerations

1. **Eleventy v3 compatibility**: All implementations must work with current Eleventy v3 setup
2. **Build performance**: Keep build time increase under 10%
3. **No new dependencies**: Utilize Eleventy's built-in features where possible
4. **Progressive enhancement**: Site must work without JavaScript
5. **Caching strategy**: Leverage Eleventy's data cascade for efficient schema generation
6. **Validation tools**: Use Google's Rich Results Test and Schema.org validator
7. **Backwards compatibility**: Ensure changes work with existing content structure

## Success Metrics

1. **Technical validation**:

   - 100% pass rate in Google Search Console structured data report
   - All pages pass Google Rich Results Test
   - Zero errors in Schema.org validator

2. **Search visibility**:

   - Rich snippets appearing for 80%+ of eligible content within 30 days
   - Improved average position in Search Console by 10% within 60 days
   - Increased organic click-through rate by 15% within 60 days

3. **Performance metrics**:

   - Maintain or improve Core Web Vitals scores
   - Build time increase less than 10%
   - No increase in page load time

4. **Content metrics**:

   - All pages have unique meta descriptions
   - 100% of articles have proper heading hierarchy
   - All content pages have breadcrumb navigation

5. **User engagement**:
   - Reduced bounce rate by 5% within 30 days
   - Increased pages per session via improved internal linking
   - Better navigation patterns shown in analytics

## Open Questions

1. **Schema priorities**: Should we implement all schema types at once or phase them? (Recommendation: Phase by importance)

2. **Historical content**: Should we manually review and optimize meta descriptions for top 20 performing articles?

3. **Tag pages**: Should tag pages have custom meta descriptions or auto-generated?

4. **Search functionality**: Should the WebSite SearchAction schema point to a future search page?

5. **Image schemas**: Should we add ImageObject schema for all images or just featured images?

6. **Event schemas**: For YouTube live streams marked as "upcoming", should we add Event schema?

7. **Review/Rating schemas**: Should we add aggregate ratings for courses/tutorials if applicable?

8. **Monitoring**: Should we set up automated alerts for schema validation failures?

## Implementation Phases

### Phase 1: Critical Fixes (Week 1)

- Fix title tag format
- Implement Article and Person schemas
- Add auto-generated meta descriptions

### Phase 2: Structured Data (Week 2)

- Add WebSite and Organization schemas
- Implement BreadcrumbList schema
- Add VideoObject schema for YouTube content

### Phase 3: Content Structure (Week 3)

- Fix heading hierarchies
- Implement breadcrumb navigation component
- Add FAQ schema where applicable

### Phase 4: Enhancement (Week 4)

- Improve internal linking
- Add related posts functionality
- Implement validation and monitoring

## Testing Requirements

1. **Pre-deployment testing**:

   - Validate all schema with Google's Rich Results Test
   - Check meta descriptions are unique and properly formatted
   - Verify heading hierarchy on sample pages
   - Test breadcrumb navigation on all page types

2. **Post-deployment monitoring**:

   - Daily Google Search Console checks for first week
   - Monitor Core Web Vitals for any degradation
   - Track rich snippet appearance in SERPs
   - Validate all pages with structured data testing tool

3. **Regression testing**:
   - Ensure existing functionality remains intact
   - Verify no broken internal links
   - Confirm RSS feeds still work
   - Check social sharing previews
   - Ensure all tests and builds do not fail

## Appendix: Schema Examples

### Article Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ title }}",
  "description": "{{ description }}",
  "author": {
    "@type": "Person",
    "name": "Andrew Ford",
    "url": "https://andrewford.co.nz/about/"
  },
  "datePublished": "{{ date }}",
  "dateModified": "{{ modified }}",
  "publisher": {
    "@type": "Organization",
    "name": "Andrew Ford",
    "logo": {
      "@type": "ImageObject",
      "url": "https://andrewford.co.nz/images/AF-Logo.png"
    }
  }
}
```

### BreadcrumbList Schema Template

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://andrewford.co.nz/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{{ category }}",
      "item": "https://andrewford.co.nz/{{ category }}/"
    }
  ]
}
```

---

_Document Version: 1.0_  
_Created: 2025-08-11_  
_Status: Ready for Implementation_
