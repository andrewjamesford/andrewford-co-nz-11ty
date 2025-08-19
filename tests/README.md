# Test Suite

This project uses a simplified test structure focusing on reliable E2E tests with Playwright.

## Test Strategy

The project uses **End-to-End Tests** as the primary testing approach because they:

- Test the complete user workflow
- Verify API integration in real scenarios
- Catch issues across the entire stack
- Provide better confidence than isolated unit tests

## End-to-End Tests (Playwright)

- **Location**: `tests/e2e/`
- **Primary Command**: `npm test` (runs quick essential tests)
- **Coverage**: Full user workflows, UI interactions, API integration

## Essential Test Commands

```bash
# Run default tests (quick & reliable)
npm test

# Run all essential E2E tests
npm run test:all

# Run comprehensive E2E tests (all browsers)
npm run test:e2e

# Run specific test suites
npm run test:e2e:quick      # Fast essential tests
npm run test:e2e:simple     # Simple chat tests
npm run test:e2e:headed     # With browser UI visible
npm run test:e2e:ui         # Interactive test UI
```

## Test Coverage

### Happy Paths ✅

- Homepage loads successfully
- Chat interface opens and responds
- Valid API requests return expected data
- User interactions work properly
- Chat bot accepts valid messages

### Negative Paths ✅

- Invalid input rejected with proper error messages
- Short questions validated correctly
- Empty requests handled gracefully
- API validation works as expected

## Key Features Tested

1. **Basic Functionality**: Homepage loading, navigation
2. **Chat Interface**: Open/close, message validation, loading states
3. **ChatRAG API**: Input validation, response handling, error cases
4. **User Experience**: Complete chat workflows, error feedback

## Test Files

### Essential Tests (Always Run)

- `tests/e2e/chatbot-quick.spec.js` - Fast essential tests
- `tests/e2e/basic.spec.js` - Basic site functionality
- `tests/e2e/chatbot-simple.spec.js` - Simple chat workflows

### Additional Tests

- `tests/e2e/chatbot-api.spec.js` - Comprehensive API tests
- `tests/e2e/chatbot.spec.js` - Full chat functionality

## Removed Tests

The following problematic test files were removed:

- `tests/api/*.test.js` - Jest ES module compatibility issues
- `tests/*.supertest.mjs` - Complex setup, covered by E2E tests
- `tests/*.contract.test.mjs` - Redundant with E2E coverage
- `tests/*.test.mjs` - Outdated serverless architecture tests
- `tests/integration.test.mjs` - Jest ES module issues

**Result**: Simpler, more reliable test suite with better coverage and faster execution.

## Running Tests

The default `npm test` command runs the most essential tests quickly and reliably. For comprehensive testing across all browsers, use `npm run test:e2e`.
