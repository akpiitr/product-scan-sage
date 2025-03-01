import request from 'supertest';
import app from '../src/app';

describe('Health Check Endpoint', () => {
  it('should return OK status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('should return Error status if database is disconnected', async () => {
    // Simulate database disconnection
    jest.spyOn(databaseService, 'checkDatabaseConnection').mockResolvedValue(false);
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(500);
    expect(res.body.status).toBe('Error');
  });
});
