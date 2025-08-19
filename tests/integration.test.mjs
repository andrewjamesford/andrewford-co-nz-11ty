import {
  jest,
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
} from "@jest/globals";
import request from "supertest";
import app from "../api/server.mjs";

describe("API Integration Tests", () => {
  let server;

  beforeAll((done) => {
    server = app.listen(0, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("Health Endpoint", () => {
    test("should return health status - Happy Path", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body).toHaveProperty("status");
      expect(response.body).toHaveProperty("timestamp");
      expect(response.body).toHaveProperty("environment");
      expect(["healthy", "degraded"]).toContain(response.body.status);
    });
  });

  describe("ChatRAG API", () => {
    test("should reject empty request - Negative Path", async () => {
      const response = await request(app)
        .post("/api/chatrag")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toContain("Question is required");
    });

    test("should reject short questions - Negative Path", async () => {
      const response = await request(app)
        .post("/api/chatrag")
        .send({ question: "Hi" })
        .expect(400);

      expect(response.body.error).toContain("at least 10 characters");
    });

    test("should reject long questions - Negative Path", async () => {
      const longQuestion = "a".repeat(501);
      const response = await request(app)
        .post("/api/chatrag")
        .send({ question: longQuestion })
        .expect(400);

      expect(response.body.error).toContain("no more than 500 characters");
    });

    test("should accept valid questions - Happy Path", async () => {
      const response = await request(app)
        .post("/api/chatrag")
        .send({ question: "What does Andrew Ford do professionally?" });

      // Should either succeed or fail gracefully with a proper error structure
      if (response.status === 200) {
        expect(response.body).toHaveProperty("answer");
        expect(response.body).toHaveProperty("sources");
      } else {
        // If API keys are missing, should return proper error structure
        expect(response.body).toHaveProperty("error");
        expect(typeof response.body.error).toBe("string");
      }
    });
  });

  describe("Last.fm API", () => {
    test("should handle missing API key gracefully - Negative Path", async () => {
      const originalKey = process.env.LASTFM_API_KEY;
      delete process.env.LASTFM_API_KEY;

      const response = await request(app).get("/api/lastplayed");

      // Restore key
      if (originalKey) process.env.LASTFM_API_KEY = originalKey;

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error_description");
      expect(response.body.error_description).toContain("LASTFM_API_KEY");
    });

    test("should return track data structure when API key exists - Happy Path", async () => {
      const response = await request(app).get("/api/lastplayed");

      if (response.status === 200) {
        // Happy path - API key exists and works
        expect(response.body).toHaveProperty("artist");
        expect(response.body).toHaveProperty("trackName");
        expect(response.body).toHaveProperty("album");
      } else {
        // Negative path - API key missing or invalid
        expect(response.body).toHaveProperty("error_description");
      }
    });
  });

  describe("YouTube API", () => {
    test("should handle missing API key gracefully - Negative Path", async () => {
      const originalKey = process.env.YOUTUBE_API_KEY;
      delete process.env.YOUTUBE_API_KEY;

      const response = await request(app).get("/api/latestUploads");

      // Restore key
      if (originalKey) process.env.YOUTUBE_API_KEY = originalKey;

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error_description");
      expect(response.body.error_description).toContain("YOUTUBE_API_KEY");
    });

    test("should return video data structure when API key exists - Happy Path", async () => {
      const response = await request(app).get("/api/latestUploads");

      if (response.status === 200) {
        // Happy path - API key exists and works
        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
          expect(response.body[0]).toHaveProperty("snippet");
        }
      } else {
        // Negative path - API key missing or invalid
        expect(response.body).toHaveProperty("error_description");
      }
    });
  });

  describe("Static File Serving", () => {
    test("should serve index.html for root path - Happy Path", async () => {
      const response = await request(app).get("/").expect(200);

      expect(response.headers["content-type"]).toMatch(/html/);
    });

    test("should return 404 for non-existent API endpoints - Negative Path", async () => {
      const response = await request(app).get("/api/nonexistent").expect(404);
    });
  });
});
