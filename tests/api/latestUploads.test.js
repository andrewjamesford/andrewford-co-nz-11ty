const request = require('supertest');
const app = require('../../api/server');

describe('GET /api/latestUploads', () => {
  beforeEach(() => {
    process.env.YOUTUBE_API_KEY = 'test-api-key';
    process.env.YOUTUBE_CHANNEL_ID = 'test-channel-id';
  });

  it('should return latest YouTube videos', async () => {
    const mockYouTubeResponse = {
      items: [
        {
          id: { videoId: 'test-video-1' },
          snippet: {
            title: 'Test Video 1',
            description: 'Test Description 1',
            publishedAt: '2023-01-01T00:00:00Z'
          }
        },
        {
          id: { videoId: 'test-video-2' },
          snippet: {
            title: 'Test Video 2',
            description: 'Test Description 2',
            publishedAt: '2023-01-02T00:00:00Z'
          }
        }
      ]
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockYouTubeResponse),
      })
    );

    const response = await request(app)
      .get('/api/latestUploads')
      .expect(200);

    expect(response.body).toEqual(mockYouTubeResponse.items);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('googleapis.com/youtube/v3/search'),
      expect.any(Object)
    );
  });

  it('should handle missing API key', async () => {
    delete process.env.YOUTUBE_API_KEY;

    const response = await request(app)
      .get('/api/latestUploads')
      .expect(500);

    expect(response.body).toHaveProperty('error_description');
    expect(response.body.error_description).toContain('YOUTUBE_API_KEY');
  });

  it('should handle missing channel ID', async () => {
    delete process.env.YOUTUBE_CHANNEL_ID;

    const response = await request(app)
      .get('/api/latestUploads')
      .expect(500);

    expect(response.body).toHaveProperty('error_description');
    expect(response.body.error_description).toContain('YOUTUBE_CHANNEL_ID');
  });

  it('should handle API errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      })
    );

    const response = await request(app)
      .get('/api/latestUploads')
      .expect(500);

    expect(response.body).toHaveProperty('error_description');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});