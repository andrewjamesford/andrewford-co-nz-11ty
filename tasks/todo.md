- [x] Review the currently open GitHub issues and identify the affected files and behaviors.
- [x] Refactor chatbot message rendering to share DOM creation logic and prevent duplicate submissions while a request is in flight.
- [x] Deduplicate chatbot source slug generation in the API route.
- [x] Run targeted formatting and tests for the affected chatbot paths.
- [x] Record the implementation and verification results.

## Review

- Added shared chat message DOM helpers in `public/scripts/chat.js`, reused them for normal messages, streaming placeholders, and source links, and disabled the textarea/send button while a request is active to block duplicate submissions.
- Extracted raw-slug inference and slug formatting into reusable helpers in `api/routes/chatrag.mjs`, then reused the resulting source-link builder in both streaming and non-streaming response paths.
- Added a pure helper test in `tests/chatrag-helpers.test.mjs` for article and metadata-derived source urls, plus a focused Playwright assertion in `tests/e2e/chatbot-quick.spec.js` that verifies chat controls disable during an in-flight request and re-enable after completion.
- Verified with `node --test tests/chatrag-helpers.test.mjs`, `npm run build`, and `npx playwright test tests/e2e/chatbot-quick.spec.js --project=chromium`.
