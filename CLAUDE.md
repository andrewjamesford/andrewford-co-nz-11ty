# CLAUDE.md

## Code Style

- Use Prettier for formatting.
- Avoid abbreviations in variable names.
- When completed task and all testing has passed, create a pull request (PR) to the main branch.

## Ignore

- Ignore `node_modules` and `build` folders in your PR.

## PR Instructions

- Title format: [Title] Short description
- Include a one-line summary and a "Testing Done" section

## SEO Content Guidelines

### Heading Hierarchy Best Practices

When writing content, follow these heading hierarchy rules to ensure proper SEO and accessibility:

#### Structure Rules

1. **Single H1 per page**: Each page should have exactly one H1 heading

   - The H1 should be the main topic of the page
   - For articles, this is typically the title
   - For pages, this should be the page's main heading

2. **Sequential heading levels**: Don't skip heading levels

   - ✅ Good: H1 → H2 → H3
   - ❌ Bad: H1 → H3 (skips H2)
   - ❌ Bad: H1 → H5 (skips H2, H3, H4)

3. **Proper nesting**: Use headings to create a logical content outline
   - H2 for major sections
   - H3 for subsections within H2
   - H4 for subsections within H3, etc.

#### Implementation

- The build process includes automatic validation that warns about:
  - Multiple H1 tags on a single page
  - Missing H1 tags (except for special pages like 404)
  - Heading level skips
- Fix any warnings that appear during the build process

#### Examples

**Good structure:**

```markdown
# Main Article Title (H1)

## Introduction (H2)

## Method 1 (H2)

### Step 1 (H3)

### Step 2 (H3)

## Method 2 (H2)

### Setup (H3)

### Implementation (H3)
```

**Bad structure:**

```markdown
## Title (Missing H1, starts with H2)

#### Details (Skips from H1 to H4)
```

### Meta Descriptions

- Keep meta descriptions between 150-160 characters
- Each page must have a unique meta description
- Auto-generation falls back to first 160 characters of content
- The build process validates uniqueness and warns about duplicates

## Documentation

- [11ty Documentation](https://www.11ty.dev/docs/) is available for reference.
- [markdownlint](https://github.com/DavidAnson/markdownlint) is available for reference.
- [Prettier Documentation](https://prettier.io/docs/en/index.html) is available for reference.
- [GitHub Markdown Cheatsheet](https://github.github.com/gfm/) is available for reference.
- [OpenAI Documentation](https://platform.openai.com/docs/overview) is available for reference.
