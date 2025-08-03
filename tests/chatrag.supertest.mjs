import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import { createTestApp, mockEnv } from './helpers/netlify-function-helper.mjs';

// Mock modules
const mockFetch = jest.fn();
jest.unstable_mockModule('node-fetch', () => ({
  default: mockFetch,
}));

const mockDotenvConfig = jest.fn();
jest.unstable_mockModule('dotenv', () => ({
  default: {
    config: mockDotenvConfig,
  },
  config: mockDotenvConfig,
}));

// Mock OpenAI and LangChain modules
const mockEmbeddings = jest.fn();
const mockLLM = jest.fn();
const mockVectorStore = {
  asRetriever: jest.fn()
};
const mockRetriever = {
  getRelevantDocuments: jest.fn()
};

jest.unstable_mockModule('@langchain/openai', () => ({
  OpenAIEmbeddings: jest.fn(() => mockEmbeddings),
  ChatOpenAI: jest.fn(() => mockLLM)
}));

jest.unstable_mockModule('@langchain/community/vectorstores/faiss', () => ({
  FaissStore: {
    load: jest.fn().mockResolvedValue(mockVectorStore)
  }
}));

jest.unstable_mockModule('langchain/chains/combine_documents', () => ({
  createStuffDocumentsChain: jest.fn().mockResolvedValue('documentChain')
}));

jest.unstable_mockModule('langchain/chains/retrieval', () => ({
  createRetrievalChain: jest.fn().mockImplementation(({ combineDocsChain }) => ({
    invoke: jest.fn().mockResolvedValue({
      answer: 'Test answer from the blog posts.',
      context: [
        {
          pageContent: 'slug: "test-article" content here',
          metadata: { source: '/content/articles/test-article/index.md' }
        }
      ]
    }),
    stream: jest.fn().mockImplementation(async function* () {
      yield { answer: 'Test ' };
      yield { answer: 'streaming ' };
      yield { answer: 'answer.' };
    })
  }))
}));

const { handler } = await import('../functions/chatrag.mjs');

describe('Chat RAG Function - Supertest', () => {
  let app;
  let restoreEnv;
  
  beforeEach(() => {
    // Create test app
    app = createTestApp(handler);
    
    // Mock environment variables
    restoreEnv = mockEnv({
      OPENAI_API_KEY: 'test-openai-key',
      OPENROUTER_API_KEY: 'test-openrouter-key',
      OPENROUTER_MODEL: 'test-model',
      SITE_URL: 'https://andrewford.co.nz',
      ALLOWED_ORIGINS: 'http://localhost:3000,https://andrewford.co.nz'
    });
    
    // Setup mock implementations
    mockVectorStore.asRetriever.mockReturnValue(mockRetriever);
    mockRetriever.getRelevantDocuments.mockResolvedValue([
      {
        pageContent: 'slug: "test-article" Test content',
        metadata: { source: '/content/articles/test-article/index.md' }
      }
    ]);
    
    // Clear mocks
    mockDotenvConfig.mockClear();
  });
  
  afterEach(() => {
    // Restore environment
    restoreEnv();
    jest.clearAllMocks();
  });
  
  describe('POST / - Non-streaming', () => {
    test('should return answer with sources for valid question', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: 'What is the latest blog post about?' })
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        answer: 'Test answer from the blog posts.',
        sources: ['https://andrewford.co.nz/articles/test-article/']
      });
      
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
    
    test('should return 400 for missing question', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({})
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error: 'Question is required'
      });
    });
    
    test('should return 400 for question that is too short', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: 'Hi' })
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error: 'Question must be at least 10 characters long'
      });
    });
    
    test('should return 400 for question that is too long', async () => {
      const longQuestion = 'a'.repeat(501);
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: longQuestion })
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error: 'Question must be no more than 500 characters long'
      });
    });
    
    test('should return 400 for non-string question', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: 123 })
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error: 'Input must be a string'
      });
    });
    
    test('should sanitize HTML in questions', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: '<script>alert("xss")</script>What is the latest post?' })
        .expect(200)
        .expect('Content-Type', /json/);
      
      expect(response.body.answer).toBe('Test answer from the blog posts.');
    });
    
    test('should return 400 for questions with only special characters', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: '!!!@@@###$$$%%%' })
        .expect(400)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error: 'Question must contain alphanumeric characters'
      });
    });
    
    test('should handle CORS with allowed origins', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'https://andrewford.co.nz')
        .send({ question: 'What are the recent posts about?' })
        .expect(200);
      
      expect(response.headers['access-control-allow-origin']).toBe('https://andrewford.co.nz');
      expect(response.headers['access-control-allow-methods']).toBe('POST');
    });
    
    test('should handle CORS with disallowed origins', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'https://evil.com')
        .send({ question: 'What are the recent posts about?' })
        .expect(200);
      
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });
  
  describe('POST / - Streaming', () => {
    test('should stream response when Accept header includes text/event-stream', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .set('Accept', 'text/event-stream')
        .send({ question: 'Tell me about the latest posts' })
        .expect(200)
        .expect('Content-Type', /text\/event-stream/);
      
      const responseText = response.text;
      expect(responseText).toContain('data: {"chunk":"Test "}');
      expect(responseText).toContain('data: {"chunk":"streaming "}');
      expect(responseText).toContain('data: {"chunk":"answer."}');
      expect(responseText).toContain('data: {"done":true,"sources":["https://andrewford.co.nz/articles/test-article/"]}');
      
      expect(response.headers['cache-control']).toBe('no-cache');
      expect(response.headers['connection']).toBe('keep-alive');
    });
    
    test('should handle errors in streaming mode', async () => {
      // Mock an error in the retrieval chain
      const { createRetrievalChain } = await import('langchain/chains/retrieval');
      createRetrievalChain.mockImplementationOnce(() => ({
        stream: jest.fn().mockRejectedValue(new Error('Streaming error'))
      }));
      
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .set('Accept', 'text/event-stream')
        .send({ question: 'Tell me about the latest posts' })
        .expect(500)
        .expect('Content-Type', /text\/event-stream/);
      
      expect(response.text).toContain('data: {"error":"An unexpected error occurred. Please try again later."}');
    });
    
    test('should validate input in streaming mode', async () => {
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .set('Accept', 'text/event-stream')
        .send({ question: 'Hi' })
        .expect(400)
        .expect('Content-Type', /text\/event-stream/);
      
      expect(response.text).toContain('data: {"error":"Question must be at least 10 characters long"}');
    });
  });
  
  describe('Error Handling', () => {
    test('should handle OpenRouter authentication errors', async () => {
      const { createRetrievalChain } = await import('langchain/chains/retrieval');
      createRetrievalChain.mockImplementationOnce(() => ({
        invoke: jest.fn().mockRejectedValue({
          response: { status: 401 }
        })
      }));
      
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: 'What is the latest blog post?' })
        .expect(500)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error: 'Authentication error. Please check API configuration.'
      });
    });
    
    test('should handle rate limit errors', async () => {
      const { createRetrievalChain } = await import('langchain/chains/retrieval');
      createRetrievalChain.mockImplementationOnce(() => ({
        invoke: jest.fn().mockRejectedValue({
          response: { status: 429 }
        })
      }));
      
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: 'What is the latest blog post?' })
        .expect(429)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error: 'Model rate limit reached. Please try again later.'
      });
    });
    
    test('should handle generic errors', async () => {
      const { createRetrievalChain } = await import('langchain/chains/retrieval');
      createRetrievalChain.mockImplementationOnce(() => ({
        invoke: jest.fn().mockRejectedValue(new Error('Unknown error'))
      }));
      
      const response = await request(app)
        .post('/')
        .set('Origin', 'http://localhost:3000')
        .send({ question: 'What is the latest blog post?' })
        .expect(500)
        .expect('Content-Type', /json/);
      
      expect(response.body).toEqual({
        error: 'An unexpected error occurred. Please try again later.'
      });
    });
  });
});