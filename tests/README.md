# Test Suite

This project combines fast Node-native unit/API tests with Playwright E2E tests.

## Test Strategy

- **Unit/API tests** (`node:test`) check deterministic request-handling logic (validation, error paths, CORS, helper functions) directly against the Express app, with no browser and no real external API calls.
- **E2E tests** (Playwright) drive a real browser against the built site to verify full user workflows, UI interactions, and (where safe) live API integration.
- A small subset of E2E tests exercise the real `/api/chatrag` endpoint with a real LLM call — those are excluded from the CI-safe "essential" set and only run locally with credentials.

## Commands

```bash
# Fast local sanity check (used by the pre-commit hook)
npm test                    # test:unit + test:e2e:quick

# Comprehensive suite (used by the pre-push hook and CI)
npm run test:all            # test:unit + test:e2e:essential + test:e2e:links

# Individual pieces
npm run test:unit           # node:test unit/API tests only
npm run test:e2e:essential  # CI-safe Playwright suite (basic, chatbot-quick, chatbot-simple, audio-player)
npm run test:e2e:links      # crawl the built site and verify every internal link resolves
npm run test:e2e:full       # LOCAL ONLY - chatbot.spec.js + chatbot-api.spec.js, real OPENROUTER_API_KEY required
npm run test:e2e            # every Playwright spec (equivalent to essential + full)
npm run test:e2e:headed     # essential suite with a visible browser
npm run test:e2e:ui         # interactive Playwright UI
```

## When each suite runs

| Suite                | Pre-commit | Pre-push | CI  |    Needs real API key?     |
| -------------------- | :--------: | :------: | :-: | :------------------------: |
| `test:unit`          |     ✅     |    ✅    | ✅  |             No             |
| `test:e2e:quick`     |     ✅     |    —     |  —  |        No (mocked)         |
| `test:e2e:essential` |     —      |    ✅    | ✅  |    No (mocked/skipped)     |
| `test:e2e:links`     |     —      |    ✅    | ✅  |             No             |
| `test:e2e:full`      |     —      |    —     |  —  | Yes (`OPENROUTER_API_KEY`) |

Git hooks live in `.husky/`: `pre-commit` runs `npm test`, `pre-push` runs `npm run test:all` followed by a `docker build` sanity check. CI (`.github/workflows/ci.yml`) runs `prettier:check`, `test:unit`, `test:e2e:essential`, and `test:e2e:links` against a production build.

## Unit/API Tests (Node test runner)

- **Location**: `tests/*.test.mjs`, `tests/api/*.test.mjs`
- **Runner**: Node's built-in `node:test`, not Jest — this repo is ESM-only (`"type": "module"`) and there is no Jest config; Jest's ESM support needs extra setup that was previously a source of flaky, unmaintained tests

Covers:

- `tests/api/cors.test.mjs` - CORS configuration behavior against the live Express app
- `tests/chatrag-helpers.test.mjs` - Pure helper function tests (slug formatting, source links)
- `tests/chatrag.test.mjs` - `/api/chatrag` input validation (missing/short/long question, CORS headers)
- `tests/lastplayed.test.mjs` - `/api/lastplayed` missing-config error path
- `tests/latestuploads.test.mjs` - `/api/latestUploads` missing-config error paths

These tests use `supertest` against the real `api/server.mjs` app and only assert on deterministic paths (validation errors, missing env vars) — they don't call real external APIs (Last.fm, YouTube, OpenAI), so they're safe to run without credentials and won't flake on network issues.

## E2E Tests (Playwright)

- **Location**: `tests/e2e/`

### CI-safe / "essential" (`test:e2e:essential`)

- `tests/e2e/basic.spec.js` - Homepage load, navigation
- `tests/e2e/chatbot-quick.spec.js` - Chat UI, validation, loading state (real `/api/chatrag` calls are mocked with `page.route()`; requests that need a live API are skipped via `test.skip(!!process.env.CI, ...)`)
- `tests/e2e/chatbot-simple.spec.js` - Same coverage style as chatbot-quick, shorter workflow
- `tests/e2e/audio-player.spec.js` - Article audio player rendering, no API dependency

### Local-only, real API required (`test:e2e:full`)

- `tests/e2e/chatbot.spec.js` - Full chat workflow against the live `/api/chatrag` endpoint (streaming, multi-turn, sanitization)
- `tests/e2e/chatbot-api.spec.js` - Direct API-level tests (rate limiting, concurrency, CORS headers, timing) against the live endpoint

These two files make real, unmocked calls to `/api/chatrag`, which requires a working `OPENROUTER_API_KEY` in `.env` and costs real API usage. They intentionally aren't run in CI or in the git hooks — run them manually with `npm run test:e2e:full` after setting up local credentials.

### Internal link crawl (`test:e2e:links`)

- `tests/e2e/site-links.spec.js` - Builds/uses `_site` and asserts every internal link on every page resolves (200, not 404). Written with `node:test`, not Playwright's test API — despite living in `tests/e2e/` and matching the `*.spec.js` naming pattern, it's excluded from Playwright's own test discovery via `testIgnore` in `playwright.config.cjs`, because if Playwright imported it directly its top-level `describe`/`it` calls would execute as an import side effect outside Playwright's runner, racing with real Playwright tests. Always run it via `npm run test:e2e:links` (`node --test`), never via `npx playwright test`.

## Removed Tests

The following problematic test files were removed (Jest-only, incompatible with this repo's ESM setup, or referencing a since-removed serverless handler architecture):

- `tests/api/*.test.js` (CommonJS Jest tests using `require()`/`jest.mock()`)
- `tests/*.supertest.mjs`, `tests/*.contract.test.mjs`, `tests/integration.test.mjs` (used `@jest/globals`, no Jest config exists in this repo)
- The old `tests/chatrag.test.mjs` and `tests/latestuploads.test.mjs` referenced a `handler(event, context)` serverless-style API that no longer exists; they were rewritten against the current Express router in `api/routes/`

**Result**: Simpler, more reliable test suite with better coverage and faster execution.
