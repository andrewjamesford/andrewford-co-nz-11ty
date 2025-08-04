# Testing Strategy

This project uses a multi-layered testing approach to ensure comprehensive coverage of the Netlify serverless functions.

## Test Types

### 1. Unit Tests (Jest)

**Command**: `npm test`

**Location**: `tests/*.test.mjs` (except integration tests)

**Purpose**: Test individual function logic with mocked dependencies

- ✅ `tests/latestuploads.test.mjs` - YouTube API function unit tests
- ✅ All Supertest files - Mock-based testing with Express wrapper

**Features**:

- Full ES module support
- Comprehensive mocking of external APIs
- Isolated testing environment
- Fast execution

### 2. Supertest Tests (Jest + Express)

**Command**: `npm run test:supertest`

**Location**: `tests/*.supertest.mjs`

**Purpose**: HTTP-level testing of functions using Express wrapper

- ✅ `tests/lastplayed.supertest.mjs` - Last.fm API testing
- ✅ `tests/latestuploads.supertest.mjs` - YouTube API testing
- ✅ `tests/chatrag.supertest.mjs` - Chat RAG function testing

**Coverage**:

- HTTP request/response handling
- CORS behavior
- Error scenarios
- Input validation
- Streaming responses (for chat function)

### 3. Integration Tests (Node.js Test Runner)

**Command**: `npm run test:integration`

**Location**: `tests/lastplayed.test.mjs`, `tests/chatrag.test.mjs`

**Purpose**: End-to-end testing against live Netlify functions

**Requirements**:

```bash
# Start Netlify dev server first
netlify dev

# Then run integration tests in another terminal
npm run test:integration
```

**Note**: These tests require:

- Running Netlify dev server on `http://localhost:8888`
- Valid API keys in environment variables
- Live external API availability

## Running All Tests

```bash
# Jest tests only (unit + supertest)
npm test

# Supertest tests only
npm run test:supertest

# Integration tests only (requires netlify dev)
npm run test:integration

# All tests (Jest + integration, requires netlify dev)
npm run test:all
```

## Test Results Summary

### Jest Tests (✅ All Passing)

- **latestuploads.test.mjs**: 5/5 tests passing
- **chatrag.supertest.mjs**: 15/15 tests passing
- **lastplayed.supertest.mjs**: 9/9 tests passing
- **latestuploads.supertest.mjs**: 9/9 tests passing

**Total: 38/38 Jest tests passing** 🎉

### Integration Tests (⚠️ Requires Live Server)

- Designed for end-to-end validation
- Tests real API endpoints with live data
- Validates CORS headers in production environment
- Should be run before deployment

## Mock vs Live Testing

**Mocked Tests (Jest/Supertest)**:

- ✅ Fast execution
- ✅ Deterministic results
- ✅ No external dependencies
- ✅ Perfect for CI/CD

**Integration Tests**:

- ✅ Real environment validation
- ✅ End-to-end verification
- ⚠️ Requires live server
- ⚠️ Dependent on external APIs

## CI/CD Recommendation

For automated testing (GitHub Actions, etc.):

```bash
npm test  # Run only Jest tests
```

For local development validation:

```bash
netlify dev &  # Start dev server
npm run test:all  # Run all tests
```
