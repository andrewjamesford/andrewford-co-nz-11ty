- [x] Inspect current npm scripts, outdated packages, audit output, and open Dependabot alerts.
- [x] Update direct npm dependencies and refresh the lockfile.
- [x] Re-run audit/outdated checks to confirm the security posture.
- [x] Run the project verification suite.
- [x] Commit, push, and open a PR to `main`.

## Investigate YouTube embeds

- [x] Reproduce the missing YouTube embeds on the live site.
- [x] Trace how YouTube embeds are generated locally.
- [x] Fix the root cause with the smallest safe change.
- [x] Verify the fix locally and against representative pages.

## Review

- Updated direct npm dependencies and refreshed the lockfile, including Eleventy, Playwright, LangChain, Express, DOMPurify, Prettier, Jest, Lighthouse, markdownlint, sanitize-html, supertest, and related packages.
- Added targeted npm overrides for patched transitive security dependencies, bringing `npm audit` to zero vulnerabilities.
- Kept `dotenv` on `16.6.1` because `17.x` conflicts with the transitive `@browserbasehq/stagehand` peer dependency pulled in by LangChain.
- Added `http-server` as an explicit dev dependency so the site-wide link test can start its local static server reliably.
- Regenerated the lockfile with npm 10 so CI `npm ci` includes optional `@emnapi` package entries, and kept Lighthouse on `12.8.2` for Node 20 CI compatibility.
- Verified with `npm audit`, `npm run build`, `npm run prettier:check`, and `npm run test:all`.
- Found that live YouTube embeds rendered `<div class="lty-playbtn">` while `lite-youtube-embed@0.3.4` only styles `.lyt-playbtn`, making the play button invisible and unclickable.
- Added a local CSS compatibility rule for the legacy `lty-playbtn` class so the lazy YouTube embeds have a visible, clickable play target again.
- Verified the fix with a local browser click test, `npm audit`, `npm run build`, `npm run prettier:check`, and `npm run test:all`.
