import { test, expect } from "@playwright/test";

test.describe("Chatbot API Functionality", () => {
  const API_BASE = "http://localhost:3080/api";

  test("should respond to basic chatrag API request", async ({ request }) => {
    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        question: "What does Andrew Ford do professionally?",
      },
      timeout: 45000, // 45 seconds for AI response
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("answer");
    expect(data).toHaveProperty("sources");
    expect(typeof data.answer).toBe("string");
    expect(data.answer.length).toBeGreaterThan(0);
    expect(Array.isArray(data.sources)).toBe(true);
  });

  test("should return error for missing question", async ({ request }) => {
    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {},
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toContain("Question is required");
  });

  test("should return error for empty question", async ({ request }) => {
    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        question: "",
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toContain("Question is required");
  });

  test("should return error for question too short", async ({ request }) => {
    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        question: "Hi",
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toContain("at least 10 characters");
  });

  test("should return error for question too long", async ({ request }) => {
    const longQuestion = "A".repeat(501); // Exceeds 500 character limit

    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        question: longQuestion,
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty("error");
    expect(data.error).toContain("no more than 500 characters");
  });

  test("should handle various technical questions", async ({ request }) => {
    const questions = [
      "What technologies does Andrew work with?",
      "Tell me about Andrew's experience with React",
      "What articles has Andrew written about JavaScript?",
      "What is Andrew's background in web development?",
    ];

    for (const question of questions) {
      const response = await request.post(`${API_BASE}/chatrag`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { question },
      });

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("answer");
      expect(data.answer.length).toBeGreaterThan(10);
      expect(Array.isArray(data.sources)).toBe(true);
    }
  });

  test("should support streaming responses", async ({ request }) => {
    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      data: {
        question: "What does Andrew Ford do professionally?",
      },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/event-stream");

    const body = await response.text();
    expect(body).toContain("data:");

    // Parse SSE events
    const lines = body.split("\n").filter((line) => line.startsWith("data:"));
    expect(lines.length).toBeGreaterThan(0);

    // Check for proper JSON in data lines
    let hasChunk = false;
    let hasDone = false;

    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(5)); // Remove 'data:' prefix
        if (data.chunk) hasChunk = true;
        if (data.done) hasDone = true;
      } catch (e) {
        // Some lines might not be JSON, that's ok
      }
    }

    expect(hasChunk || hasDone).toBe(true);
  });

  test("should handle concurrent requests", async ({ request }) => {
    const questions = [
      "What does Andrew Ford do?",
      "What technologies does he use?",
      "Tell me about his experience",
    ];

    // Send all requests concurrently
    const promises = questions.map((question) =>
      request.post(`${API_BASE}/chatrag`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { question },
      })
    );

    const responses = await Promise.all(promises);

    // All should succeed
    for (const response of responses) {
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("answer");
      expect(data.answer.length).toBeGreaterThan(0);
    }
  });

  test("should sanitize malicious input", async ({ request }) => {
    const maliciousQuestions = [
      '<script>alert("xss")</script>What does Andrew do?',
      'What does Andrew do? <img src="x" onerror="console.log(\'hack\')">',
      "Tell me about Andrew's work <!-- malicious comment -->",
    ];

    for (const question of maliciousQuestions) {
      const response = await request.post(`${API_BASE}/chatrag`, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { question },
      });

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data).toHaveProperty("answer");
      // Response should not contain the malicious tags
      expect(data.answer).not.toContain("<script>");
      expect(data.answer).not.toContain("<img");
      expect(data.answer).not.toContain("<!--");
    }
  });

  test("should return appropriate CORS headers", async ({ request }) => {
    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3080",
      },
      data: {
        question: "What does Andrew Ford do professionally?",
      },
    });

    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers["access-control-allow-origin"]).toBeDefined();
    expect(headers["access-control-allow-headers"]).toBeDefined();
    expect(headers["access-control-allow-methods"]).toBeDefined();
  });

  test("should handle rate limiting gracefully", async ({ request }) => {
    // Send multiple rapid requests
    const rapidRequests = Array(5)
      .fill()
      .map((_, i) =>
        request.post(`${API_BASE}/chatrag`, {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            question: `Test question number ${
              i + 1
            } - What does Andrew Ford do?`,
          },
        })
      );

    const responses = await Promise.all(rapidRequests);

    // At least the first few should succeed
    const successfulResponses = responses.filter((r) => r.status() === 200);
    expect(successfulResponses.length).toBeGreaterThan(0);

    // Any rate-limited responses should return 429
    const rateLimitedResponses = responses.filter((r) => r.status() === 429);
    for (const response of rateLimitedResponses) {
      const data = await response.json();
      expect(data.error).toContain("rate limit");
    }
  });

  test("should respond within reasonable time", async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        question: "What does Andrew Ford do professionally?",
      },
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    expect(response.status()).toBe(200);

    // Response should be within 30 seconds (reasonable for AI processing)
    expect(responseTime).toBeLessThan(30000);

    const data = await response.json();
    expect(data).toHaveProperty("answer");
  });
});
