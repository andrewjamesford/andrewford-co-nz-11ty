import { describe, it } from "node:test";
import assert from "node:assert";
import { handler } from "../functions/chatrag.mjs";

// Simple expect wrapper for better readability
const expect = (actual) => ({
  toBe: (expected) => assert.strictEqual(actual, expected),
  toHaveProperty: (prop) => assert.ok(actual.hasOwnProperty(prop), `Expected object to have property '${prop}'`)
});

// Mock environment variables for testing
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "mock-api-key";
process.env.UPSTASH_REDIS_REST_URL =
  process.env.UPSTASH_REDIS_REST_URL || "mock-redis-url";
process.env.UPSTASH_REDIS_REST_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN || "mock-redis-token";
process.env.SITE_URL = process.env.SITE_URL || "https://andrewford.co.nz";
process.env.ALLOWED_ORIGINS =
  process.env.ALLOWED_ORIGINS ||
  "https://andrewford.co.nz,http://localhost:8888";

describe("chatrag Netlify Function", () => {
  it("should return 400 for missing question", async () => {
    const event = {
      body: JSON.stringify({}),
      headers: {
        "content-type": "application/json",
        origin: "https://andrewford.co.nz",
      },
      connection: {
        remoteAddress: "127.0.0.1",
      },
    };

    const result = await handler(event, {});

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Question is required");
  });

  it("should return 400 for question that is too short", async () => {
    const event = {
      body: JSON.stringify({ question: "Hi" }),
      headers: {
        "content-type": "application/json",
        origin: "https://andrewford.co.nz",
      },
      connection: {
        remoteAddress: "127.0.0.1",
      },
    };

    const result = await handler(event, {});

    expect(result.statusCode).toBe(400);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Question must be at least 10 characters long");
  });

  it("should include proper CORS headers", async () => {
    const event = {
      body: JSON.stringify({
        question: "What is your favorite programming language?",
      }),
      headers: {
        "content-type": "application/json",
        origin: "https://andrewford.co.nz",
      },
      connection: {
        remoteAddress: "127.0.0.1",
      },
    };

    const result = await handler(event, {});

    expect(result.headers).toHaveProperty("Access-Control-Allow-Origin");
    expect(result.headers).toHaveProperty("Access-Control-Allow-Headers");
    expect(result.headers).toHaveProperty("Access-Control-Allow-Methods");
  });
});
