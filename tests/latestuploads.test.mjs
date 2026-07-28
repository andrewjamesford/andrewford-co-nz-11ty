import { describe, it } from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../api/server.mjs";

describe("GET /api/latestUploads", () => {
  it("should return 500 with a descriptive error when YOUTUBE_API_KEY is not set", async () => {
    const previousApiKey = process.env.YOUTUBE_API_KEY;
    const previousChannelId = process.env.YOUTUBE_CHANNEL_ID;
    delete process.env.YOUTUBE_API_KEY;
    process.env.YOUTUBE_CHANNEL_ID = "test-channel-id";

    try {
      const response = await request(app).get("/api/latestUploads");

      assert.strictEqual(response.status, 500);
      assert.strictEqual(
        response.body.error_description,
        "YOUTUBE_API_KEY environment variable is not set",
      );
    } finally {
      if (previousApiKey !== undefined) {
        process.env.YOUTUBE_API_KEY = previousApiKey;
      } else {
        delete process.env.YOUTUBE_API_KEY;
      }
      if (previousChannelId !== undefined) {
        process.env.YOUTUBE_CHANNEL_ID = previousChannelId;
      } else {
        delete process.env.YOUTUBE_CHANNEL_ID;
      }
    }
  });

  it("should return 500 with a descriptive error when YOUTUBE_CHANNEL_ID is not set", async () => {
    const previousApiKey = process.env.YOUTUBE_API_KEY;
    const previousChannelId = process.env.YOUTUBE_CHANNEL_ID;
    process.env.YOUTUBE_API_KEY = "test-api-key";
    delete process.env.YOUTUBE_CHANNEL_ID;

    try {
      const response = await request(app).get("/api/latestUploads");

      assert.strictEqual(response.status, 500);
      assert.strictEqual(
        response.body.error_description,
        "YOUTUBE_CHANNEL_ID environment variable is not set",
      );
    } finally {
      if (previousApiKey !== undefined) {
        process.env.YOUTUBE_API_KEY = previousApiKey;
      } else {
        delete process.env.YOUTUBE_API_KEY;
      }
      if (previousChannelId !== undefined) {
        process.env.YOUTUBE_CHANNEL_ID = previousChannelId;
      }
    }
  });
});
