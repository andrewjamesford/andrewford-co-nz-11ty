# End-to-End Tests for Chatbot

This directory contains Playwright end-to-end tests to verify the chatbot functionality is working correctly.

## Test Files

### `basic.spec.js`

- Basic site functionality tests
- Homepage loading and navigation
- Chat toggle button presence

### `chatbot.spec.js`

- Comprehensive chatbot UI interaction tests
- Chat opening/closing animations
- Message sending and receiving
- Input validation and sanitization
- Loading states and animations
- Source link display
- Multiple message conversations
- Scroll behavior

### `chatbot-api.spec.js`

- API endpoint testing
- Request validation (missing, empty, too short, too long questions)
- Response format validation
- Streaming support testing
- Concurrent request handling
- CORS header verification
- Rate limiting behavior
- Response time testing
- Input sanitization at API level

## Running Tests

### Prerequisites

1. Make sure the development server is running: `npm run dev`
2. Ensure the vector store is generated: `npm run genvector:simple`
3. Install Playwright browsers: `npx playwright install`

### Test Commands

```bash
# Run quick tests (recommended - fast and reliable)
npm run test:e2e:quick

# Run simple tests (includes basic API test)
npm run test:e2e:simple

# Run all e2e tests (may be slow due to AI responses)
npm run test:e2e

# Run with browser UI visible
npm run test:e2e:headed

# Run with Playwright UI for debugging
npm run test:e2e:ui

# Run specific test file
npx playwright test tests/e2e/chatbot-quick.spec.js

# Run specific test by name
npx playwright test -g "should display chat toggle button"

# Run tests on specific browser
npx playwright test --project=chromium
```

### Recommended Test Flow

1. **Start with quick tests**: `npm run test:e2e:quick` (6 tests, ~10 seconds)

   - UI functionality tests
   - Basic API validation tests
   - No AI API calls (fast and reliable)

2. **Run simple tests for full validation**: `npm run test:e2e:simple` (15 tests, ~60 seconds)

   - Includes one AI API test
   - More comprehensive but still reasonable runtime

3. **Full test suite**: `npm run test:e2e` (75 tests, may timeout)
   - Comprehensive testing including AI responses
   - May have timeout issues due to AI API response times

### Test Coverage

The tests verify:

#### UI Functionality ✅

- Chat toggle button visibility and functionality
- Chat container opening/closing animations
- Welcome message display
- Input field and send button presence
- Message history display
- Loading animations during API calls
- Source links when provided
- Scroll behavior for long conversations

#### API Functionality ✅

- Successful chatbot responses
- Input validation (length, content)
- Error handling for invalid requests
- Streaming response support
- CORS headers
- Response time performance
- Concurrent request handling
- Input sanitization for security

#### Chatbot Intelligence ✅

- Relevant responses to questions about Andrew Ford
- Professional background information retrieval
- Technology stack questions
- Article and experience queries
- Source attribution when applicable

## Configuration

The tests are configured in `playwright.config.js` with:

- Base URL: `http://localhost:3080`
- Test timeout: Default Playwright settings
- Browsers: Chromium, Firefox, WebKit
- Automatic server startup via `npm run dev`
- Screenshots on failure
- Trace recording on retry

## Troubleshooting

1. **Tests fail with "Server not found"**

   - Ensure `npm run dev` is running
   - Check that the server is accessible at `http://localhost:3080`

2. **Chatbot API tests fail**

   - Verify the vector store exists: `ls vector_store/simple_vector_store.json`
   - Check environment variables in `.env` file
   - Ensure OpenAI API key is configured

3. **Long response times**

   - This is normal for AI responses (up to 30 seconds)
   - Cold starts may take longer

4. **Browser installation issues**
   - Run `npx playwright install` to download browsers
   - Check disk space for browser installations

## Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This provides detailed test results, screenshots, and traces for debugging failed tests.
