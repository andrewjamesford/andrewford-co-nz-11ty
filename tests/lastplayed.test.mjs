import { describe, it } from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../api/server.mjs";

describe("GET /api/lastplayed", () => {
  it("should return 500 with a descriptive error when LASTFM_API_KEY is not set", async () => {
    const previousKey = process.env.LASTFM_API_KEY;
    delete process.env.LASTFM_API_KEY;

    try {
      const response = await request(app).get("/api/lastplayed");

      assert.strictEqual(response.status, 500);
      assert.strictEqual(
        response.body.error_description,
        "LASTFM_API_KEY environment variable is not set",
      );
    } finally {
      if (previousKey !== undefined) {
        process.env.LASTFM_API_KEY = previousKey;
      }
    }
  });
});
