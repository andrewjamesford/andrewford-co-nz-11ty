import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import { createTestApp, mockEnv } from './helpers/netlify-function-helper.mjs';

// Mock fetch
const mockFetch = jest.fn();
jest.unstable_mockModule('node-fetch', () => ({
  default: mockFetch,
}));

// Mock dotenv
const mockDotenvConfig = jest.fn();
jest.unstable_mockModule('dotenv', () => ({
  default: {
    config: mockDotenvConfig,
  },
  config: mockDotenvConfig,
}));

const { handler } = await import('../functions/lastplayed.mjs');

describe('Last.fm API Function - Supertest', () => {
  let app;
  let restoreEnv;
  
  beforeEach(() => {
    // Create test app
    app = createTestApp(handler);
    
    // Mock environment variables
    restoreEnv = mockEnv({
      LASTFM_API_KEY: 'test-api-key',
      ALLOWED_ORIGINS: 'http://localhost:8888,https://andrewford.co.nz'
    });
    
    // Clear mocks
    mockFetch.mockClear();
    mockDotenvConfig.mockClear();
  });
  
  afterEach(() => {
    // Restore environment
    restoreEnv();
  });
  
  describe('GET /', () => {
    test('should return 200 with track data on successful API call', async () => {
      const mockLastFmResponse = {
        recenttracks: {
          track: [{
            artist: { '#text': 'Test Artist' },
            name: 'Test Track',
            album: { '#text': 'Test Album' },
            url: 'https://last.fm/track/123',
            image: [
              { '#text': 'small.jpg' },
              { '#text': 'medium.jpg' },
              { '#text': 'large.jpg' }
            ]
          }]
        }
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce(mockLastFmResponse)
      });
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:8888')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        artist: 'Test Artist',
        trackName: 'Test Track',
        album: 'Test Album',
        url: 'https://last.fm/track/123',
        albumArt: 'medium.jpg',
        albumArtLarge: 'large.jpg'
      });
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=indysonic&api_key=test-api-key&format=json',
        { method: 'GET' }
      );
      
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:8888');
    });
    
    test('should handle missing API key', async () => {
      // Remove API key
      delete process.env.LASTFM_API_KEY;
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:8888')
        .expect(500)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error_description: 'LASTFM_API_KEY environment variable is not set'
      });
      
      expect(mockFetch).not.toHaveBeenCalled();
    });
    
    test('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:8888')
        .expect(500)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error_description: 'Last.fm API request failed: 403 Forbidden'
      });
    });
    
    test('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:8888')
        .expect(500)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error_description: 'Network error'
      });
    });
    
    test('should handle invalid API response structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce({ invalid: 'response' })
      });
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:8888')
        .expect(500)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error_description: 'Invalid response structure from Last.fm API'
      });
    });
    
    test('should handle empty track list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          recenttracks: {
            track: []
          }
        })
      });
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:8888')
        .expect(500)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error_description: 'No recent tracks found'
      });
    });
    
    test('should handle missing track data fields gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          recenttracks: {
            track: [{
              artist: { '#text': 'Test Artist' },
              name: 'Test Track'
              // Missing album, url, and image
            }]
          }
        })
      });
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'http://localhost:8888')
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        artist: 'Test Artist',
        trackName: 'Test Track',
        album: 'Unknown Album',
        url: '',
        albumArt: '',
        albumArtLarge: ''
      });
    });
    
    test('should handle CORS with allowed origins', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          recenttracks: {
            track: [{
              artist: { '#text': 'Test' },
              name: 'Test'
            }]
          }
        })
      });
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'https://andrewford.co.nz')
        .expect(200);
      
      expect(response.headers['access-control-allow-origin']).toBe('https://andrewford.co.nz');
      expect(response.headers['access-control-allow-methods']).toBe('GET');
    });
    
    test('should handle CORS with disallowed origins', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          recenttracks: {
            track: [{
              artist: { '#text': 'Test' },
              name: 'Test'
            }]
          }
        })
      });
      
      const response = await request(app)
        .get('/')
        .set('Origin', 'https://evil.com')
        .expect(200);
      
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:8888');
    });
  });
});