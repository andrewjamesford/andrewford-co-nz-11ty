const request = require('supertest');
const app = require('../../api/server');
const fs = require('fs');

jest.mock('fs');
jest.mock('@langchain/openai');

describe('POST /api/chatrag', () => {
  const mockVectorStore = {
    documents: [
      {
        pageContent: 'Test content about React development',
        metadata: { source: '/content/articles/react-tutorial/index.md' },
        embedding: new Array(1536).fill(0.1)
      }
    ]
  };

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
    
    fs.readFileSync.mockReturnValue(JSON.stringify(mockVectorStore));
    
    const { OpenAIEmbeddings, ChatOpenAI } = require('@langchain/openai');
    
    OpenAIEmbeddings.mockImplementation(() => ({
      embedQuery: jest.fn().mockResolvedValue(new Array(1536).fill(0.1))
    }));
    
    ChatOpenAI.mockImplementation(() => ({
      invoke: jest.fn().mockResolvedValue({ content: 'Test response from AI' }),
      stream: jest.fn().mockImplementation(async function* () {
        yield { content: 'Test ' };
        yield { content: 'streaming ' };
        yield { content: 'response' };
      })
    }));
  });

  it('should return AI response for valid question', async () => {
    const response = await request(app)
      .post('/api/chatrag')
      .send({ question: 'What is React development?' })
      .expect(200);

    expect(response.body).toHaveProperty('answer');
    expect(response.body).toHaveProperty('sources');
    expect(response.body.answer).toBe('Test response from AI');
  });

  it('should handle streaming requests', async () => {
    const response = await request(app)
      .post('/api/chatrag')
      .set('Accept', 'text/event-stream')
      .send({ question: 'What is React development?' })
      .expect(200);

    expect(response.headers['content-type']).toContain('text/event-stream');
    expect(response.text).toContain('data:');
  });

  it('should reject empty questions', async () => {
    const response = await request(app)
      .post('/api/chatrag')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Question is required');
  });

  it('should reject questions that are too short', async () => {
    const response = await request(app)
      .post('/api/chatrag')
      .send({ question: 'Hi' })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('at least 10 characters');
  });

  it('should reject questions that are too long', async () => {
    const longQuestion = 'x'.repeat(501);
    
    const response = await request(app)
      .post('/api/chatrag')
      .send({ question: longQuestion })
      .expect(400);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('no more than 500 characters');
  });

  it('should handle missing vector store', async () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    const response = await request(app)
      .post('/api/chatrag')
      .send({ question: 'What is React development?' })
      .expect(200);

    expect(response.body.answer).toContain('knowledge base is not available');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});