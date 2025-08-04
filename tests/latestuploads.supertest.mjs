import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import request from "supertest";
import { createTestApp, mockEnv } from "./helpers/netlify-function-helper.mjs";

// Mock fetch
const mockFetch = jest.fn();
jest.unstable_mockModule("node-fetch", () => ({
  default: mockFetch,
}));

// Mock dotenv
const mockDotenvConfig = jest.fn();
jest.unstable_mockModule("dotenv", () => ({
  default: {
    config: mockDotenvConfig,
  },
  config: mockDotenvConfig,
}));

const { handler } = await import("../functions/latestUploads.mjs");

describe("YouTube Latest Uploads Function - Supertest", () => {
  let app;
  let restoreEnv;

  beforeEach(() => {
    // Create test app
    app = createTestApp(handler);

    // Mock environment variables
    restoreEnv = mockEnv({
      YOUTUBE_API_KEY: "test-youtube-api-key",
      YOUTUBE_CHANNEL_ID: "test-channel-id",
    });

    // Clear mocks
    mockFetch.mockClear();
    mockDotenvConfig.mockClear();
  });

  afterEach(() => {
    // Restore environment
    restoreEnv();
  });

  describe("GET /", () => {
    test("should return 200 with video data on successful API call", async () => {
      const mockYouTubeResponse = {
        items: [
          {
            id: { videoId: "video123" },
            snippet: {
              title: "Test Video 1",
              description: "Test description 1",
              thumbnails: {
                default: { url: "thumb1.jpg" },
              },
            },
          },
          {
            id: { videoId: "video456" },
            snippet: {
              title: "Test Video 2",
              description: "Test description 2",
              thumbnails: {
                default: { url: "thumb2.jpg" },
              },
            },
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockYouTubeResponse),
      });

      const response = await request(app)
        .get("/")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual(mockYouTubeResponse.items);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=test-channel-id&maxResults=10&order=date&type=video&key=test-youtube-api-key",
        { method: "GET" }
      );
    });

    test("should handle missing YOUTUBE_API_KEY", async () => {
      delete process.env.YOUTUBE_API_KEY;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      });

      const response = await request(app)
        .get("/")
        .expect(500)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        error_description: "HTTP error! status: 403 Forbidden",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=test-channel-id&maxResults=10&order=date&type=video&key=undefined",
        { method: "GET" }
      );
    });

    test("should handle missing YOUTUBE_CHANNEL_ID", async () => {
      delete process.env.YOUTUBE_CHANNEL_ID;

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      });

      const response = await request(app)
        .get("/")
        .expect(500)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        error_description: "HTTP error! status: 400 Bad Request",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=undefined&maxResults=10&order=date&type=video&key=test-youtube-api-key",
        { method: "GET" }
      );
    });

    test("should handle YouTube API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
      });

      const response = await request(app)
        .get("/")
        .expect(500)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        error_description: "HTTP error! status: 429 Too Many Requests",
      });
    });

    test("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("ECONNREFUSED"));

      const response = await request(app)
        .get("/")
        .expect(500)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        error_description: "ECONNREFUSED",
      });
    });

    test("should handle empty results", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ items: [] }),
      });

      const response = await request(app)
        .get("/")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual([]);
    });

    test("should handle invalid JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockRejectedValueOnce(new Error("Invalid JSON")),
      });

      const response = await request(app)
        .get("/")
        .expect(500)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        error_description: "Invalid JSON",
      });
    });

    test("should call dotenv.config", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ items: [] }),
      });

      await request(app).get("/").expect(200);

      expect(mockDotenvConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe("POST /", () => {
    test("should work with POST method as well", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ items: [] }),
      });

      const response = await request(app)
        .post("/")
        .expect(200)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual([]);
    });
  });
});
