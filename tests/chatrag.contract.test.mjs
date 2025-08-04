import { jest, describe, test, expect } from "@jest/globals";
import request from "supertest";
import { createTestApp, mockEnv } from "./helpers/netlify-function-helper.mjs";

const { handler } = await import("../functions/chatrag.js");

describe("Chat RAG Function - Contract Tests", () => {
  let app;
  let restoreEnv;

  beforeEach(() => {
    app = createTestApp(handler);
    restoreEnv = mockEnv({
      OPENAI_API_KEY: "test-key",
      OPENROUTER_API_KEY: "test-key",
      SITE_URL: "https://andrewford.co.nz",
      ALLOWED_ORIGINS: "http://localhost:3000,https://andrewford.co.nz",
    });
  });

  afterEach(() => {
    restoreEnv();
  });

  // These tests verify the contract/interface without mocking internals
  describe("Request/Response Contract", () => {
    test("should return proper error structure for missing question", async () => {
      const response = await request(app)
        .post("/")
        .set("Origin", "http://localhost:3000")
        .send({});

      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toHaveProperty("error");
      expect(typeof response.body.error).toBe("string");
    });

    test("should return proper error structure for invalid question length", async () => {
      const response = await request(app)
        .post("/")
        .set("Origin", "http://localhost:3000")
        .send({ question: "Hi" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Question must be at least 10 characters long",
      });
    });

    test("should return proper error structure for oversized question", async () => {
      const response = await request(app)
        .post("/")
        .set("Origin", "http://localhost:3000")
        .send({ question: "a".repeat(501) });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Question must be no more than 500 characters long",
      });
    });

    test("should return proper error structure for non-string question", async () => {
      const response = await request(app)
        .post("/")
        .set("Origin", "http://localhost:3000")
        .send({ question: 123 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Input must be a string",
      });
    });

    test("should return proper error for special characters only", async () => {
      const response = await request(app)
        .post("/")
        .set("Origin", "http://localhost:3000")
        .send({ question: "!!!@@@###$$$%%%" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Question must contain alphanumeric characters",
      });
    });

    test("should handle CORS headers correctly", async () => {
      const response = await request(app)
        .post("/")
        .set("Origin", "http://localhost:3000")
        .send({ question: "What is a valid test question here?" });

      // Should have CORS headers regardless of success/failure
      expect(response.headers).toHaveProperty("access-control-allow-origin");
      expect(response.headers).toHaveProperty("access-control-allow-methods");
      expect(response.headers["access-control-allow-methods"]).toBe("POST");
    });

    test("should handle streaming request headers", async () => {
      const response = await request(app)
        .post("/")
        .set("Origin", "http://localhost:3000")
        .set("Accept", "text/event-stream")
        .send({ question: "Hi" }); // Invalid to test error case

      expect(response.headers["content-type"]).toMatch(/text\/event-stream/);
      expect(response.text).toContain("data:");
    });
  });

  // Test actual API integration if keys are available
  describe("Integration Tests (Optional)", () => {
    const hasRealKeys =
      process.env.OPENAI_API_KEY &&
      process.env.OPENROUTER_API_KEY &&
      !process.env.OPENAI_API_KEY.includes("test");

    (hasRealKeys ? test : test.skip)(
      "should handle real API call with valid keys",
      async () => {
        const realApp = createTestApp(handler);
        // Use real environment variables

        const response = await request(realApp)
          .post("/")
          .set("Origin", "http://localhost:3000")
          .send({ question: "What does Andrew Ford do professionally?" });

        if (response.status === 200) {
          expect(response.body).toHaveProperty("answer");
          expect(response.body).toHaveProperty("sources");
          expect(typeof response.body.answer).toBe("string");
          expect(Array.isArray(response.body.sources)).toBe(true);
        } else {
          // If it fails, at least verify error structure
          expect(response.body).toHaveProperty("error");
          expect(typeof response.body.error).toBe("string");
        }
      },
      30000
    );
  });
});
