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
    const downloadLink = player.getByRole("link", {
      name: "Download article audio",
    });
    await downloadLink.scrollIntoViewIfNeeded();
    const downloadBoxBeforeHover = await downloadLink.boundingBox();
    await downloadLink.hover();
    const downloadBoxAfterHover = await downloadLink.boundingBox();
    expect(downloadBoxAfterHover).toEqual(downloadBoxBeforeHover);
    await expect(downloadLink).toHaveCSS("border-radius", "50%");
    await expect(downloadLink).toHaveCSS("padding", "0px");
    await expect(player.getByText("Generated")).toHaveCount(0);
    await expect(player.locator("audio")).toHaveCount(1);
  });

  test("does not render for articles without audio metadata", async ({
    page,
  }) => {
    await page.goto("/articles/another-easy-eleventy-upgrade/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("[data-audio-player]")).toHaveCount(0);
  });

  test("keeps controls stable when playback fails", async ({ page }) => {
    await page.addInitScript(() => {
      window.audioUnhandledRejections = 0;
      window.addEventListener("unhandledrejection", () => {
        window.audioUnhandledRejections += 1;
      });

      HTMLMediaElement.prototype.play = function () {
        return Promise.reject(new Error("Simulated playback failure"));
      };
    });

    await page.goto("/articles/audio-player-fixture/");
    await page.waitForLoadState("networkidle");

    const player = page.locator("[data-audio-player]");
    await player
      .getByRole("button", { name: "Play Listen to this article" })
      .click();
    await page.waitForTimeout(100);

    expect(await page.evaluate(() => window.audioUnhandledRejections)).toBe(0);
    await expect(
      player.getByRole("button", { name: "Play Listen to this article" }),
    ).toBeVisible();
    await expect(player.locator("[data-audio-current]")).toHaveText("0:00");
  });

  test("resets visible progress when playback ends", async ({ page }) => {
    await page.goto("/articles/audio-player-fixture/");
    await page.waitForLoadState("networkidle");

    const player = page.locator("[data-audio-player]");
    const progress = player.getByRole("slider", { name: "Audio progress" });

    await player.locator("audio").evaluate((audio) => {
      Object.defineProperty(audio, "duration", {
        configurable: true,
        value: 9,
      });

      audio.currentTime = 9;
      audio.dispatchEvent(new Event("timeupdate"));
      audio.dispatchEvent(new Event("ended"));
    });

    await expect(player.locator("[data-audio-current]")).toHaveText("0:00");
    await expect(progress).toHaveValue("0");
    await expect(progress).toHaveAttribute("aria-valuetext", "0:00 of 0:09");
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
