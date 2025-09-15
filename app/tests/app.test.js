const request = require('supertest');

// Use an environment variable for the base URL, with a default for local testing
const appUrl = process.env.APP_URL || 'http://localhost:3000';

describe('Server', () => {
  it('Check if server is up and running', async () => {
    try {
      const response = await request(appUrl).get('/');
      expect(response.statusCode).toBe(200);
    } catch (error) {
      // If the server is not running, the request will fail.
      throw new Error(`Server is not running or not accessible at ${appUrl}. Please start the server before running tests`);
    }
  });
});
