import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const pinnedDOMPurifyVersion = JSON.parse(
  readFileSync(new URL("../../package.json", import.meta.url), "utf8"),
).dependencies.dompurify;

test.describe("Chatbot sanitizer regressions", () => {
  let submittedQuestions;
  const responseText =
    '<img src=x onerror="window.__xssExecuted=true"><script>window.__xssExecuted=true</script>';

  test.beforeEach(async ({ page }) => {
    submittedQuestions = [];
    // Keep these tests independent of CDNs, analytics and paid chatbot APIs.
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname === "/api/chatrag") {
        submittedQuestions.push(route.request().postDataJSON().question);
        await route.fulfill({
          status: 200,
          contentType: "text/event-stream",
          body: [
            `data: ${JSON.stringify({ chunk: responseText })}`,
            'data: {"done":true}',
            "",
          ].join("\n\n"),
        });
      } else if (url.origin === "http://localhost:3080") {
        await route.continue();
      } else {
        await route.abort();
      }
    });
    await page.goto("/");
    await page.click("#chat-toggle");
  });

  test("submits with the same-origin pinned npm sanitizer", async ({
    page,
  }) => {
    const script = page.locator('script[src*="dompurify"]');
    await expect(script).toHaveAttribute(
      "src",
      `/scripts/vendor/dompurify-${pinnedDOMPurifyVersion}.min.js`,
    );
    expect(await script.getAttribute("async")).toBeNull();
    expect(await page.evaluate(() => window.DOMPurify.version)).toBe(
      pinnedDOMPurifyVersion,
    );

    const question = "Tell me about Andrew Ford's background.";
    await page.fill("#chat-input", question);
    await page.click("#chat-send");
    await expect(page.locator(".chat-message.bot").last()).toHaveText(
      responseText,
    );
    expect(submittedQuestions).toEqual([question]);
    await expect(page.locator("#chat-send")).toBeEnabled();
  });

  for (const markup of [
    '<img src=x onerror="window.__xssExecuted=true"><script>window.__xssExecuted=true</script>',
    '<svg onload="window.__xssExecuted=true"><a href="javascript:window.__xssExecuted=true"></a></svg>',
  ]) {
    test(`keeps malicious markup inert: ${markup.slice(0, 4)}`, async ({
      page,
    }) => {
      await page.fill(
        "#chat-input",
        `<b>Tell me about Andrew Ford.</b>${markup}`,
      );
      await page.click("#chat-send");
      await expect(page.locator(".chat-message.bot").last()).toHaveText(
        responseText,
      );
      expect(submittedQuestions).toEqual(["Tell me about Andrew Ford."]);
      await expect(page.locator(".chat-message.user").last()).toHaveText(
        "Tell me about Andrew Ford.",
      );
      await expect(
        page.locator(
          "#chat-messages img, #chat-messages script, #chat-messages svg",
        ),
      ).toHaveCount(0);
      expect(await page.evaluate(() => window.__xssExecuted)).toBeUndefined();
    });
  }
});

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
      "Please enter a message with at least 10 characters",
    );
  });

  test("should show loading state when sending message", async ({ page }) => {
    // Delay the mock response so the loading state is reliably observable,
    // regardless of whether a live /api/chatrag endpoint exists (e.g. in CI's
    // static-file-server mode a real request would 404 almost instantly).
    await page.route("**/api/chatrag", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: [
          'data: {"chunk":"Mock response from chatbot."}',
          'data: {"done":true,"sources":["https://andrewford.co.nz/articles/mock-response/"]}',
          "",
        ].join("\n\n"),
      });
    });

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

  test("should disable chat controls while a request is in flight", async ({
    page,
  }) => {
    let requestCount = 0;

    await page.route("**/api/chatrag", async (route) => {
      requestCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: [
          'data: {"chunk":"Mock response from chatbot."}',
          'data: {"done":true,"sources":["https://andrewford.co.nz/articles/mock-response/"]}',
          "",
        ].join("\n\n"),
      });
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.click("#chat-toggle");
    await page.waitForTimeout(500);

    await page.fill("#chat-input", "Tell me about Andrew Ford's background.");
    await page.click("#chat-send");

    await expect(page.locator("#chat-input")).toBeDisabled();
    await expect(page.locator("#chat-send")).toBeDisabled();

    await page.waitForSelector(".loading-bubble", {
      state: "detached",
      timeout: 5000,
    });

    await expect(page.locator(".chat-message.user")).toHaveCount(1);
    await expect(page.locator("#chat-input")).toBeEnabled();
    await expect(page.locator("#chat-send")).toBeEnabled();
    expect(requestCount).toBe(1);
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
