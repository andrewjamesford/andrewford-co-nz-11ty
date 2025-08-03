## Relevant Files

- `functions/chatrag.mjs` - Current serverless function handling chat requests with Upstash rate limiting
- `functions/chatrag.test.mjs` - Unit tests for the chat function
- `public/scripts/chat.js` - Client-side chat widget JavaScript
- `_includes/chat.njk` - Chat widget HTML template
- `public/css/critical.css` - Contains chat widget styles
- `package.json` - Dependencies including LangChain and Upstash packages
- `.env` - Environment variables for API keys (OpenRouter, etc.)
- `netlify.toml` - Netlify function configuration

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `chatrag.mjs` and `chatrag.test.mjs` in the same directory).
- Use `npm test` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Remove Upstash Rate Limiting Implementation
- [x] 2.0 Implement OpenRouter Integration
- [x] 3.0 Update LangChain Configuration for OpenRouter
- [x] 4.0 Implement Response Streaming
- [x] 5.0 Update Frontend for Streaming Support
- [x] 6.0 Testing and Cleanup
