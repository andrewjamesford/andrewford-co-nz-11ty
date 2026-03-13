- [x] Review the existing Playwright and CI setup for a site-wide internal link test.
- [x] Add an end-to-end link crawler test that walks internal URLs across the built site.
- [x] Wire the new test into package scripts and CI without slowing the quick local loop too much.
- [x] Run formatting and verification, then document the outcome here.

## Review

- Added a sitemap-seeded Playwright crawl that follows same-site links and fails on broken internal pages or linked assets.
- Kept the quick local loop intact by adding a dedicated `test:e2e:links` command and folding it into `test:all` rather than `npm test`.
- Fixed two broken links surfaced by the new crawl: the local-only `/api/products` article link and a video asset path mismatch in an archive post.
- Verified with `npm run build` and `npm run test:all`.
