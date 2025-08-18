const { test, expect } = require("@playwright/test");

test.describe("Chatbot Simple Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("should display and open chat interface", async ({ page }) => {
    // Check if chat toggle button exists and is visible
    const chatToggle = page.locator("#chat-toggle");
    await expect(chatToggle).toBeVisible();

    // Click to open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Chat container should be visible
    const chatContainer = page.locator("#chat-container");
    await expect(chatContainer).toHaveClass(/show/);

    // Should display welcome message
    const welcomeMessage = page.locator(".chat-message.bot").first();
    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeMessage).toContainText("Hi, I'm Andrew's Chatbot");
  });

  test("should validate message input", async ({ page }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Try to send a message that's too short
    await page.fill("#chat-input", "Hi");
    await page.click("#chat-send");

    // Should display validation error
    const errorMessage = page.locator(".chat-message.bot").last();
    await expect(errorMessage).toContainText(
      "Please enter a message with at least 10 characters"
    );
  });

  test("should send message and get loading state", async ({ page }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Send a valid test message
    const testMessage = "What does Andrew Ford do professionally?";
    await page.fill("#chat-input", testMessage);
    await page.click("#chat-send");

    // User message should appear
    const userMessage = page.locator(".chat-message.user").last();
    await expect(userMessage).toContainText(testMessage);

    // Input should be cleared
    await expect(page.locator("#chat-input")).toHaveValue("");

    // Loading animation should appear
    const loadingBubble = page.locator(".loading-bubble");
    await expect(loadingBubble).toBeVisible();

    // Loading dots should be present
    const loadingDots = page.locator(".loading-dots");
    await expect(loadingDots).toBeVisible();
  });
});

test.describe("Chatbot API Simple Tests", () => {
  const API_BASE = "http://localhost:3000/api";

  test("should handle basic API validation", async ({ request }) => {
    // Test missing question
    const response1 = await request.post(`${API_BASE}/chatrag`, {
      headers: { "Content-Type": "application/json" },
      data: {},
    });
    expect(response1.status()).toBe(400);

    // Test empty question
    const response2 = await request.post(`${API_BASE}/chatrag`, {
      headers: { "Content-Type": "application/json" },
      data: { question: "" },
    });
    expect(response2.status()).toBe(400);

    // Test question too short
    const response3 = await request.post(`${API_BASE}/chatrag`, {
      headers: { "Content-Type": "application/json" },
      data: { question: "Hi" },
    });
    expect(response3.status()).toBe(400);
  });

  test("should respond to valid API request", async ({ request }) => {
    test.setTimeout(90000); // Extend timeout for this test

    // Add delay to reduce concurrent load
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 1000)
    );

    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: { "Content-Type": "application/json" },
      data: { question: "What does Andrew Ford do professionally?" },
      timeout: 60000,
    });

    // Log response details for debugging
    if (response.status() !== 200) {
      const errorText = await response.text();
      console.log("API Error Response:", response.status(), errorText);
    }

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("answer");
    expect(data).toHaveProperty("sources");
    expect(typeof data.answer).toBe("string");
    expect(data.answer.length).toBeGreaterThan(0);
    expect(Array.isArray(data.sources)).toBe(true);
  });
});
