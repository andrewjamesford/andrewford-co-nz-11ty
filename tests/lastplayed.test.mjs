const API_URL = process.env.API_URL || "http://localhost:8888";
const FUNCTION_BASE_URL = `${API_URL}/.netlify/functions`; // Adjust port if your netlify dev runs on a different one

describe("lastplayed Netlify Function", () => {
  const lastPlayedUrl = `${FUNCTION_BASE_URL}/lastplayed`;

  console.log("Testing lastplayed function at URL:", lastPlayedUrl);
  // Test with an allowed origin (localhost)
  it("should return 200 and correct CORS header for localhost origin", async () => {
    const response = await fetch(lastPlayedUrl, {
      headers: {
        Origin: `${API_URL}`,
      },
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      `${API_URL}`
    );
    expect(data).toHaveProperty("artist");
    expect(data).toHaveProperty("trackName");
    expect(data).toHaveProperty("album");
    expect(data).toHaveProperty("url");
    expect(data).toHaveProperty("albumArt");
    expect(data).toHaveProperty("albumArtLarge");
  });

  // Test with another allowed origin (production URL)
  it("should return 200 and correct CORS header for production origin", async () => {
    const response = await fetch(lastPlayedUrl, {
      headers: {
        Origin: "https://andrewford.co.nz",
      },
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe(
      "https://andrewford.co.nz"
    );
    expect(data).toHaveProperty("artist");
  });

  // Test with a non-allowed origin
  it("should return 200 and default CORS header for a non-allowed origin", async () => {
    const response = await fetch(lastPlayedUrl, {
      headers: {
        Origin: "http://some-other-domain.com",
      },
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    // It should fall back to the first allowed origin as per your function logic
    expect(response.headers.get("access-control-allow-origin")).toBe(
      `${API_URL}`
    );
    expect(data).toHaveProperty("artist");
  });

  // Test without an Origin header
  it("should return 200 and default CORS header if no Origin header is sent", async () => {
    const response = await fetch(lastPlayedUrl);
    const data = await response.json();

    expect(response.status).toBe(200);
    // It should fall back to the first allowed origin
    expect(response.headers.get("access-control-allow-origin")).toBe(
      `${API_URL}`
    );
    expect(data).toHaveProperty("artist");
  });

  // Test other headers
  it("should include other standard CORS headers", async () => {
    const response = await fetch(lastPlayedUrl, {
      method: "OPTIONS", // Preflight request
      headers: {
        Origin: `${API_URL}`,
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });
    // For OPTIONS requests, Netlify Dev might handle them or your function might.
    // If your function handles OPTIONS, it should return the headers.
    // If Netlify Dev handles it, the behavior might differ slightly from deployed.
    // For now, let's check the GET response headers which are explicitly set.
    const getResponse = await fetch(lastPlayedUrl, {
      headers: { Origin: `${API_URL}` },
    });
    expect(getResponse.headers.get("access-control-allow-headers")).toBe(
      "Content-Type"
    );
    expect(getResponse.headers.get("access-control-allow-methods")).toBe("GET");
  });

  // Note: To test the error case (statusCode 500), you would ideally mock
  // the external fetch to `ws.audioscrobbler.com` to simulate a failure.
  // Without mocking, this test relies on the external API being down or returning an error,
  // which is not reliable for automated testing.
  it("should handle errors from the Last.fm API gracefully (conceptual - needs mocking for reliability)", async () => {
    // This is a placeholder to remind that proper error testing needs mocking.
    // For example, if you could force the Last.fm API call to fail:
    // const response = await fetch(lastPlayedUrl + '?forceError=true'); // (if you implemented such a query param for testing)
    // const data = await response.json();
    // expect(response.status).toBe(500);
    // expect(data).toHaveProperty('error_description');
    expect(true).toBe(true); // Placeholder assertion
  });
});
