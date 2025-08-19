const request = require("supertest");
const app = require("../../api/server.mjs").default;

describe("GET /api/lastplayed", () => {
  beforeEach(() => {
    process.env.LASTFM_API_KEY = "test-api-key";
  });

  it("should return last played track data", async () => {
    const mockLastFmResponse = {
      recenttracks: {
        track: {
          artist: { "#text": "Test Artist" },
          name: "Test Track",
          album: { "#text": "Test Album" },
          url: "http://test.url",
          image: [
            { "#text": "small.jpg" },
            { "#text": "medium.jpg" },
            { "#text": "large.jpg" },
          ],
        },
      },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLastFmResponse),
      })
    );

    const response = await request(app).get("/api/lastplayed").expect(200);

    expect(response.body).toEqual({
      artist: "Test Artist",
      trackName: "Test Track",
      album: "Test Album",
      url: "http://test.url",
      albumArt: "medium.jpg",
      albumArtLarge: "large.jpg",
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("ws.audioscrobbler.com"),
      expect.any(Object)
    );
  });

  it("should handle missing API key", async () => {
    delete process.env.LASTFM_API_KEY;

    const response = await request(app).get("/api/lastplayed").expect(500);

    expect(response.body).toHaveProperty("error_description");
    expect(response.body.error_description).toContain("LASTFM_API_KEY");
  });

  it("should handle API errors", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      })
    );

    const response = await request(app).get("/api/lastplayed").expect(500);

    expect(response.body).toHaveProperty("error_description");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
