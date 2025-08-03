import express from 'express';

/**
 * Creates an Express app wrapper for a Netlify serverless function
 * This allows us to test Netlify functions with Supertest
 * 
 * @param {Function} handler - The Netlify function handler
 * @returns {express.Application} Express app configured to call the handler
 */
export function createTestApp(handler) {
  const app = express();
  
  // Parse JSON bodies
  app.use(express.json());
  app.use(express.text());
  app.use(express.urlencoded({ extended: true }));
  
  // Handle all HTTP methods
  app.all('*', async (req, res) => {
    // Convert Express request to Netlify event format
    const event = {
      httpMethod: req.method,
      headers: req.headers,
      path: req.path,
      queryStringParameters: req.query,
      body: typeof req.body === 'object' ? JSON.stringify(req.body) : req.body,
      isBase64Encoded: false
    };
    
    // Mock Netlify context
    const context = {
      functionName: 'test-function',
      functionVersion: '1',
      invokeid: 'test-invoke-id',
      awsRequestId: 'test-request-id',
      getRemainingTimeInMillis: () => 30000
    };
    
    try {
      // Call the handler
      const response = await handler(event, context);
      
      // Set status code
      res.status(response.statusCode || 200);
      
      // Set headers
      if (response.headers) {
        Object.entries(response.headers).forEach(([key, value]) => {
          res.set(key, value);
        });
      }
      
      // Handle streaming responses
      if (response.headers?.['Content-Type'] === 'text/event-stream') {
        res.set('Content-Type', 'text/event-stream');
        res.set('Cache-Control', 'no-cache');
        res.set('Connection', 'keep-alive');
        res.write(response.body);
        res.end();
        return;
      }
      
      // Send body
      if (response.body) {
        // If body is already a string, parse it to send as JSON
        try {
          const parsedBody = JSON.parse(response.body);
          res.json(parsedBody);
        } catch {
          // If not valid JSON, send as text
          res.send(response.body);
        }
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Handler error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  return app;
}

/**
 * Mock environment variables for testing
 * @param {Object} env - Environment variables to mock
 * @returns {Function} Cleanup function to restore original env
 */
export function mockEnv(env) {
  const originalEnv = {};
  
  // Store current values and set new ones
  Object.entries(env).forEach(([key, value]) => {
    originalEnv[key] = process.env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });
  
  // Return cleanup function
  return () => {
    Object.entries(originalEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  };
}