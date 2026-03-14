import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../../api/server.mjs";

// Simple expect wrapper for better readability
const expect = (actual) => ({
  toBe: (expected) => assert.strictEqual(actual, expected),
  toContain: (expected) =>
    assert.ok(
      actual.includes(expected),
      `Expected '${actual}' to contain '${expected}'`
    ),
  toHaveProperty: (prop) =>
    assert.ok(
      actual.hasOwnProperty(prop),
      `Expected object to have property '${prop}'`
    ),
});

describe("CORS Configuration Tests", () => {
  let originalAllowedOrigins;

  beforeEach(() => {
    // Store original environment variable
    originalAllowedOrigins = process.env.ALLOWED_ORIGINS;
  });

  // Restore environment after each test
  function restoreEnv() {
    if (originalAllowedOrigins) {
      process.env.ALLOWED_ORIGINS = originalAllowedOrigins;
    } else {
      delete process.env.ALLOWED_ORIGINS;
    }
  }

  it("should allow requests from https://andrewford.co.nz by default", async () => {
    restoreEnv();
    delete process.env.ALLOWED_ORIGINS; // Use default origins

    const response = await request(app)
      .options("/api/chatrag")
      .set("Origin", "https://andrewford.co.nz")
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://andrewford.co.nz"
    );
  });

  it("should handle JSON array format in ALLOWED_ORIGINS", async () => {
    process.env.ALLOWED_ORIGINS =
      '["https://andrewford.co.nz", "http://localhost:3080"]';

    const response = await request(app)
      .options("/api/chatrag")
      .set("Origin", "https://andrewford.co.nz")
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://andrewford.co.nz"
    );

    restoreEnv();
  });

  it("should handle comma-separated string format in ALLOWED_ORIGINS", async () => {
    process.env.ALLOWED_ORIGINS =
      "https://andrewford.co.nz,http://localhost:3080";

    const response = await request(app)
      .options("/api/chatrag")
      .set("Origin", "https://andrewford.co.nz")
      .set("Access-Control-Request-Method", "POST");

    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://andrewford.co.nz"
    );

    restoreEnv();
  });

  it("should handle malformed double-escaped JSON (reproducing production issue)", async () => {
    // This reproduces the exact malformed format from the error logs
    process.env.ALLOWED_ORIGINS = '["[\\"https://andrewford.co.nz\\"]"]';

    const response = await request(app)
      .options("/api/chatrag")
      .set("Origin", "https://andrewford.co.nz")
      .set("Access-Control-Request-Method", "POST");

    // This should pass after we fix the parsing logic
    expect(response.status).toBe(204);
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://andrewford.co.nz"
    );

    restoreEnv();
  });

  it("should reject requests from unauthorized origins", async () => {
    process.env.ALLOWED_ORIGINS = '["https://andrewford.co.nz"]';

    const response = await request(app)
      .options("/api/chatrag")
      .set("Origin", "https://malicious-site.com")
      .set("Access-Control-Request-Method", "POST");

    // Should be rejected by CORS
    expect(response.status).toBe(500); // CORS error

    restoreEnv();
  });

  it("should allow actual POST request to /api/chatrag with valid origin", async () => {
    process.env.ALLOWED_ORIGINS = '["https://andrewford.co.nz"]';

    const response = await request(app)
      .post("/api/chatrag")
      .set("Origin", "https://andrewford.co.nz")
      .send({ question: "What is your favorite programming language?" });

    // Should not fail with CORS error (might fail with 500 due to missing API keys, but not CORS)
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://andrewford.co.nz"
    );

    restoreEnv();
  });

  it("should handle various malformed environment variable formats", async () => {
    // Test different malformed formats that could occur in production
    const malformedFormats = [
      // Double-escaped JSON (the original production issue)
      '["[\\"https://andrewford.co.nz\\"]"]',
      // Triple-nested arrays
      '[["https://andrewford.co.nz"]]',
      // Mixed quotes
      '["https://andrewford.co.nz"]',
      // With extra spaces and newlines
      ' [ "https://andrewford.co.nz" ] ',
    ];

    for (const format of malformedFormats) {
      process.env.ALLOWED_ORIGINS = format;

      const response = await request(app)
        .options("/api/chatrag")
        .set("Origin", "https://andrewford.co.nz")
        .set("Access-Control-Request-Method", "POST");

      expect(response.status).toBe(204);
      expect(response.headers["access-control-allow-origin"]).toBe(
        "https://andrewford.co.nz"
      );
    }

    restoreEnv();
  });
});
