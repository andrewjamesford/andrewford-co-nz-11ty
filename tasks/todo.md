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

## Fix Local YouTube Dev Warning

- [x] Reproduce the local YouTube data fetch issue from placeholder env values.
- [x] Treat placeholder YouTube credentials as unconfigured.
- [x] Verify `npm run dev` no longer logs the YouTube API 400 error.

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
- Found that README placeholder YouTube values were treated as real credentials during local dev, causing a YouTube API 400 response.
- Changed optional YouTube fetch failures to a concise skip message so local dev can continue without logging a stack-like API error.

## Generate F5 audio for top articles

- [x] Map the analytics top 10 to production article files and exclude the homepage and audio fixture.
- [x] Make F5-TTS the default provider and include archived articles in discovery.
- [x] Enable audio for the eight production articles in the analytics list.
- [x] Keep the automated audio fixture pinned to its original provider.
- [x] Reduce F5 chunk size and preserve completed chunks after native model failures.
- [x] Persist each completed manifest entry and recover completed work after interruption.
- [x] Record generation timestamps using the local calendar date.
- [x] Update audio browser tests for the newly enabled articles and stable hover measurement.
- [x] Generate or refresh F5-TTS audio and article metadata.
- [x] Run formatting, build, and audio verification checks.
- [x] Commit, push, and open a PR to `main`.

### Review

- Enabled F5-TTS audio for the eight real article pages in the analytics top 10; excluded the homepage and kept the test fixture on its original provider.
- Generated seven new MP3 files and retained the current F5 recording for `zero-swift-to-app-store`.
- Added archived-article discovery, stable archive slug handling, 120-character F5 chunks, resumable chunk caching, incremental manifest writes, interrupted-run recovery, and local generation dates.
- Verified every manifest entry has a valid MP3 with `ffprobe`; the final dry run skipped all nine enabled entries as current.
- Passed `npm run prettier:check`, `npm run build`, `npm run test:all`, and the five dedicated audio-player Playwright tests on desktop and mobile.

## Add audio through Create Custom Components in MUI

- [x] Define the cutoff as 1 May 2024 and identify the six missing production articles.
- [x] Enable audio for the six missing articles without changing current recordings.
- [x] Exclude custom highlight shortcode blocks from narrated text.
- [x] Move the no-audio browser fixture outside the newly covered date range.
- [x] Generate F5-TTS audio and update frontmatter and the manifest.
- [x] Verify every production article from the cutoff onward has a valid MP3.
- [x] Run formatting, build, and browser tests.
- [x] Commit, push, and open a PR to `main`.

### Review

- Generated six F5-TTS recordings for the missing production articles from 1 May 2024 onward, including `custom-components-mui`.
- Added support for excluding `{% highlight %}` shortcode blocks after finding a JavaScript diff in the cleaned narration text.
- Verified all 11 real production articles in the cutoff range have F5 manifest entries, durations, and existing MP3 files.
- Confirmed all six new MP3s with `ffprobe`; the final dry run skipped all 15 enabled entries as current.
- Passed `npm run prettier:check`, `npm run build`, `npm run test:all`, and the five dedicated audio-player Playwright tests.
