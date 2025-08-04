const { test, expect } = require("@playwright/test");

test.describe("Chatbot Functionality", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage where the chatbot is available
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");
  });

  test("should display chat toggle button", async ({ page }) => {
    // Check if chat toggle button exists and is visible
    const chatToggle = page.locator("#chat-toggle");
    await expect(chatToggle).toBeVisible();
    await expect(chatToggle).toHaveAttribute("title", "Chat with Andrew Ford");
  });

  test("should open and close chat container", async ({ page }) => {
    // Chat container should be initially hidden
    const chatContainer = page.locator("#chat-container");
    await expect(chatContainer).toHaveCSS("display", "none");

    // Click toggle to open chat
    await page.click("#chat-toggle");

    // Wait for chat to open (animation)
    await page.waitForTimeout(500);

    // Chat container should now be visible
    await expect(chatContainer).toHaveClass(/show/);

    // Should display welcome message
    const welcomeMessage = page.locator(".chat-message.bot").first();
    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeMessage).toContainText("Hi, I'm Andrew's Chatbot");

    // Click toggle again to close chat
    await page.click("#chat-toggle");

    // Wait for chat to close (animation)
    await page.waitForTimeout(500);

    // Chat container should be hidden again
    await expect(chatContainer).toHaveCSS("display", "none");
  });

  test("should display chat interface elements when opened", async ({
    page,
  }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Check if all interface elements are present
    await expect(page.locator("#chat-messages")).toBeVisible();
    await expect(page.locator("#chat-input")).toBeVisible();
    await expect(page.locator("#chat-send")).toBeVisible();

    // Check placeholder text
    await expect(page.locator("#chat-input")).toHaveAttribute(
      "placeholder",
      "Enter your question here"
    );
  });

  test("should validate minimum message length", async ({ page }) => {
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

  test("should send message and receive response", async ({ page }) => {
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

    // Wait for loading to disappear and response to appear
    await page.waitForSelector(".loading-bubble", {
      state: "detached",
      timeout: 45000,
    });

    // Bot response should appear
    const botResponse = page.locator(".chat-message.bot").last();
    await expect(botResponse).toBeVisible();

    // Wait a bit more to ensure response is fully loaded
    await page.waitForTimeout(1000);

    // Response should contain relevant information about Andrew
    await expect(botResponse).toContainText(
      /developer|Andrew|professional|software|web/i
    );
  });

  test("should handle Enter key to send message", async ({ page }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Type message and press Enter
    const testMessage = "What technologies does Andrew work with?";
    await page.fill("#chat-input", testMessage);
    await page.press("#chat-input", "Enter");

    // User message should appear
    const userMessage = page.locator(".chat-message.user").last();
    await expect(userMessage).toContainText(testMessage);

    // Wait for loading to disappear and response to appear
    await page.waitForSelector(".loading-bubble", {
      state: "detached",
      timeout: 45000,
    });

    // Bot response should appear
    const botResponse = page.locator(".chat-message.bot").last();
    await expect(botResponse).toBeVisible();
  });

  test("should display source links when provided", async ({ page }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Send a message that should return sources
    const testMessage = "Tell me about Andrew Ford's experience";
    await page.fill("#chat-input", testMessage);
    await page.click("#chat-send");

    // Wait for loading to disappear and response to appear
    await page.waitForSelector(".loading-bubble", {
      state: "detached",
      timeout: 45000,
    });

    // Check if source links appear
    const sourceLinks = page.locator(".chat-source-link");
    if ((await sourceLinks.count()) > 0) {
      await expect(sourceLinks.first()).toBeVisible();
      await expect(sourceLinks.first()).toHaveAttribute("href");
      await expect(sourceLinks.first()).toHaveAttribute("target", "_blank");
    }
  });

  test("should show loading animation while waiting for response", async ({
    page,
  }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Send message
    const testMessage = "What articles has Andrew written about JavaScript?";
    await page.fill("#chat-input", testMessage);
    await page.click("#chat-send");

    // Loading animation should appear
    const loadingBubble = page.locator(".loading-bubble");
    await expect(loadingBubble).toBeVisible();

    // Loading dots should be present
    const loadingDots = page.locator(".loading-dots");
    await expect(loadingDots).toBeVisible();

    // Wait for response and loading should disappear
    await page.waitForSelector(".loading-bubble", {
      state: "detached",
      timeout: 45000,
    });
  });

  test("should handle multiple messages in conversation", async ({ page }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Send first message
    await page.fill("#chat-input", "What does Andrew Ford do?");
    await page.click("#chat-send");

    // Wait for first response
    await page.waitForSelector(".loading-bubble", {
      state: "detached",
      timeout: 45000,
    });

    // Send second message
    await page.fill("#chat-input", "What technologies does he use?");
    await page.click("#chat-send");

    // Wait for second response
    await page.waitForTimeout(2000); // Brief pause between messages
    await page.waitForSelector(".loading-bubble", {
      state: "detached",
      timeout: 45000,
    });

    // Should have multiple messages
    const userMessages = page.locator(".chat-message.user");
    const botMessages = page.locator(".chat-message.bot");

    await expect(userMessages).toHaveCount(2);
    await expect(botMessages).toHaveCount(3); // Welcome + 2 responses
  });

  test("should sanitize user input", async ({ page }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Try to send message with HTML content
    const maliciousMessage =
      '<script>alert("test")</script>What does Andrew do?';
    await page.fill("#chat-input", maliciousMessage);
    await page.click("#chat-send");

    // User message should be sanitized (HTML stripped)
    const userMessage = page.locator(".chat-message.user").last();
    await expect(userMessage).toContainText("What does Andrew do?");
    await expect(userMessage).not.toContainText("<script>");
  });

  test("should scroll messages into view", async ({ page }) => {
    // Open chat
    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    // Send multiple messages to test scrolling
    for (let i = 1; i <= 3; i++) {
      await page.fill(
        "#chat-input",
        `Test message number ${i} - What does Andrew Ford do professionally?`
      );
      await page.click("#chat-send");

      // Wait a bit between messages
      await page.waitForTimeout(2000);
    }

    // Wait for the last response
    await page.waitForTimeout(15000);

    // Messages container should be scrolled to bottom
    const messagesContainer = page.locator("#chat-messages");
    const scrollTop = await messagesContainer.evaluate((el) => el.scrollTop);
    const scrollHeight = await messagesContainer.evaluate(
      (el) => el.scrollHeight
    );
    const clientHeight = await messagesContainer.evaluate(
      (el) => el.clientHeight
    );

    // Should be scrolled close to the bottom (within a reasonable threshold)
    expect(scrollTop + clientHeight).toBeGreaterThan(scrollHeight - 50);
  });
});
