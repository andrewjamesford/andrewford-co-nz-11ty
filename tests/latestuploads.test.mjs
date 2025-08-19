import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from "@jest/globals";
import request from "supertest";
import {
  createTestAppFromRouter,
  mockEnv,
} from "./helpers/function-test-helper.mjs";

// Create an explicit mock function for fetch
const mockFetch = jest.fn();

// Mock dotenv with a proper mock implementation
const mockDotenvConfig = jest.fn();

// Use unstable_mockModule for ES modules
jest.unstable_mockModule("node-fetch", () => ({
  default: mockFetch,
}));

jest.unstable_mockModule("dotenv", () => ({
  default: {
    config: mockDotenvConfig,
  },
  config: mockDotenvConfig,
}));

const { default: latestUploadsRouter } = await import(
  "../api/routes/latestUploads.mjs"
);

describe("latestUploads API Endpoint", () => {
  let app;
  let restoreEnv;
  const mockApiKey = "test-api-key";
  const mockChannelId = "test-channel-id";

  beforeEach(() => {
    // Create test app
    app = createTestAppFromRouter(latestUploadsRouter);

    // Mock environment variables
    restoreEnv = mockEnv({
      YOUTUBE_API_KEY: mockApiKey,
      YOUTUBE_CHANNEL_ID: mockChannelId,
    });

    // Clear mock calls
    mockDotenvConfig.mockClear();
    mockFetch.mockClear();
  });

  afterEach(() => {
    // Restore environment
    restoreEnv();
  });

  test("should return 200 and video data on successful API call", async () => {
    const mockYouTubeApiResponse = {
      items: [
        { id: { videoId: "123" }, snippet: { title: "Test Video 1" } },
        { id: { videoId: "456" }, snippet: { title: "Test Video 2" } },
      ],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockYouTubeApiResponse),
      status: 200,
    });

    const response = await request(app).get("/").expect(200);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${mockChannelId}&maxResults=10&order=date&type=video&key=${mockApiKey}`,
      { method: "GET" }
    );
    expect(response.body).toEqual(mockYouTubeApiResponse.items);
  });

  test("should return 500 if YouTube API returns an error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      statusText: "Forbidden",
    });

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      error_description: "HTTP error! status: 403 Forbidden",
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      new Error("HTTP error! status: 403 Forbidden")
    );
  });

  test("should return 500 if fetch throws a network error", async () => {
    const networkError = new Error("Network failure");
    mockFetch.mockRejectedValueOnce(networkError);

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      error_description: "Network failure",
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(networkError);
  });

  test("should return 500 if YOUTUBE_API_KEY is missing and API call fails", async () => {
    // Explicitly set to undefined instead of deleting
    process.env.YOUTUBE_API_KEY = undefined;

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "API key not valid",
    });

    const response = await handler(mockEvent, mockContext);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${mockChannelId}&maxResults=10&order=date&type=video&key=undefined`,
      { method: "GET" }
    );
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      error_description: "HTTP error! status: 400 API key not valid",
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  test("should return 500 if YOUTUBE_CHANNEL_ID is missing and API call fails", async () => {
    // Explicitly set to undefined instead of deleting
    process.env.YOUTUBE_CHANNEL_ID = undefined;

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Channel ID missing",
    });

    const response = await handler(mockEvent, mockContext);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=undefined&maxResults=10&order=date&type=video&key=${mockApiKey}`,
      { method: "GET" }
    );
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      error_description: "HTTP error! status: 400 Channel ID missing",
    });
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });
});
