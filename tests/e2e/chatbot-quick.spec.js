const { test, expect } = require("@playwright/test");

test.describe("Chatbot Quick Tests", () => {
  test("should display chat toggle button", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const chatToggle = page.locator("#chat-toggle");
    await expect(chatToggle).toBeVisible();
    await expect(chatToggle).toHaveAttribute("title", "Chat with Andrew Ford");
  });

  test("should open chat and show welcome message", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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

    // Should have input elements
    await expect(page.locator("#chat-input")).toBeVisible();
    await expect(page.locator("#chat-send")).toBeVisible();
  });

  test("should validate message length", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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

  test("should show loading state when sending message", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Send a valid message
    const testMessage = "What does Andrew Ford do professionally?";
    await page.fill("#chat-input", testMessage);
    await page.click("#chat-send");

    // User message should appear
    const userMessage = page.locator(".chat-message.user").last();
    await expect(userMessage).toContainText(testMessage);

    // Loading animation should appear briefly
    const loadingBubble = page.locator(".loading-bubble");
    await expect(loadingBubble).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Chatbot API Quick Tests", () => {
  const API_BASE = "http://localhost:3080/api";

  test("should validate API input", async ({ request }) => {
    // Skip in CI since static server doesn't handle API routes
    test.skip(!!process.env.CI, "Skipping API test in CI");

    // Test missing question
    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: { "Content-Type": "application/json" },
      data: {},
      timeout: 10000,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("Question is required");
  });

  test("should validate short questions", async ({ request }) => {
    // Skip in CI since static server doesn't handle API routes
    test.skip(!!process.env.CI, "Skipping API test in CI");

    const response = await request.post(`${API_BASE}/chatrag`, {
      headers: { "Content-Type": "application/json" },
      data: { question: "Hi" },
      timeout: 10000,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.error).toContain("at least 10 characters");
  });
});
