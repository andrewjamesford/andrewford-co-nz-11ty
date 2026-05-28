- [x] Inspect current npm scripts, outdated packages, audit output, and open Dependabot alerts.
- [x] Update direct npm dependencies and refresh the lockfile.
- [x] Re-run audit/outdated checks to confirm the security posture.
- [x] Run the project verification suite.
- [x] Commit, push, and open a PR to `main`.

## Review

- Updated direct npm dependencies and refreshed the lockfile, including Eleventy, Playwright, LangChain, Express, DOMPurify, Prettier, Jest, Lighthouse, markdownlint, sanitize-html, supertest, and related packages.
- Added targeted npm overrides for patched transitive security dependencies, bringing `npm audit` to zero vulnerabilities.
- Kept `dotenv` on `16.6.1` because `17.x` conflicts with the transitive `@browserbasehq/stagehand` peer dependency pulled in by LangChain.
- Added `http-server` as an explicit dev dependency so the site-wide link test can start its local static server reliably.
- Regenerated the lockfile with npm 10 so CI `npm ci` includes optional `@emnapi` package entries, and kept Lighthouse on `12.8.2` for Node 20 CI compatibility.
- Verified with `npm audit`, `npm run build`, `npm run prettier:check`, and `npm run test:all`.
