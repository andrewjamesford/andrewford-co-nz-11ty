import { test, expect } from "@playwright/test";

test.describe("Article audio player", () => {
  test("renders enhanced controls for an article with audio", async ({
    page,
  }) => {
    await page.goto("/articles/audio-player-fixture/");
    await page.waitForLoadState("networkidle");

    const player = page.locator("[data-audio-player]");
    await expect(player).toBeVisible();
    await expect(player.getByText("Listen to this article")).toBeVisible();
    await expect(
      player.getByText("AI narrated using Andrew's voice"),
    ).toBeVisible();
    await expect(
      player.getByRole("button", { name: "Play Listen to this article" }),
    ).toBeVisible();
    await expect(
      player.getByRole("slider", { name: "Audio progress" }),
    ).toBeVisible();
    await expect(
      player.getByRole("combobox", { name: "Playback speed" }),
    ).toBeVisible();
    await expect(
      player.getByRole("link", { name: "Download article audio" }),
    ).toHaveAttribute("href", "/audio/posts/audio-player-fixture.mp3");
    await expect(player.getByText("Generated")).toHaveCount(0);
    await expect(player.locator("audio")).toHaveCount(1);
  });

  test("does not render for articles without audio metadata", async ({
    page,
  }) => {
    await page.goto("/articles/creative-process-with-ai-on-ipad/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("[data-audio-player]")).toHaveCount(0);
  });

  test("fits within a mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/articles/audio-player-fixture/");
    await page.waitForLoadState("networkidle");

    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    expect(overflow).toBe(false);
    await expect(page.locator("[data-audio-player]")).toBeVisible();
  });
});
