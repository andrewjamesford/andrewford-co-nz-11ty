- [x] Inspect the failing Playwright report and identify the exact test/runtime failure.
- [x] Reproduce the failure locally or isolate the root cause from the generated artifacts.
- [x] Implement the smallest reliable fix and verify the affected e2e coverage.
- [x] Update the review notes with what failed and how it was resolved.

## Review

- Reproduced the three failing tests from the Playwright report locally.
- Fixed `tests/e2e/chatbot-api.spec.js` to verify preflight-specific CORS headers on an `OPTIONS` request instead of assuming they appear on the normal `POST` response.
- Fixed `tests/e2e/chatbot.spec.js` to assert against answer bubbles rather than the last `.chat-message.bot`, because source links are rendered as separate bot messages.
- Relaxed the multi-message assertion to count actual answer bubbles while still confirming source links were added.
- Verified with targeted reruns of the three failing tests and a full run of `tests/e2e/chatbot.spec.js` plus `tests/e2e/chatbot-api.spec.js` (23 tests passed).
