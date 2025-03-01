import request from 'supertest';
import app from '../src/index';

describe('API Tests', () => {
    it('should return a 200 response for the root endpoint', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });

    // Add more tests for other endpoints and functionalities as needed
});