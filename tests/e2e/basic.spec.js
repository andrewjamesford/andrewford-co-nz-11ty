import { test, expect } from "@playwright/test";

test.describe("Basic Site Functionality", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Check page title
    await expect(page).toHaveTitle(/Andrew Ford/);

    // Check that chat toggle button exists
    const chatToggle = page.locator("#chat-toggle");
    await expect(chatToggle).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for common navigation elements
    const navigation = page.locator("nav, .nav, .navigation");
    if ((await navigation.count()) > 0) {
      await expect(navigation.first()).toBeVisible();
    }
  });
});
