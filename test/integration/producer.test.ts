import request from 'supertest';
import { createApp } from '../../src/app';
import { AppDataSource } from '../../src/utils/database';

describe('Producer API Integration Tests', () => {
  it('should return producer stats in correct format', async () => {
    const app = await createApp();
    const response = await request(app).get('/api/producers/stats');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('min');
    expect(response.body).toHaveProperty('max');

    // Check the structure of min and max arrays
    if (response.body.min.length > 0) {
      expect(response.body.min[0]).toHaveProperty('producer');
      expect(response.body.min[0]).toHaveProperty('interval');
      expect(response.body.min[0]).toHaveProperty('previousWin');
      expect(response.body.min[0]).toHaveProperty('followingWin');
    }

    if (response.body.max.length > 0) {
      expect(response.body.max[0]).toHaveProperty('producer');
      expect(response.body.max[0]).toHaveProperty('interval');
      expect(response.body.max[0]).toHaveProperty('previousWin');
      expect(response.body.max[0]).toHaveProperty('followingWin');
    }
  });

  it('should return valid interval values', async () => {
    const app = await createApp();
    const response = await request(app).get('/api/producers/stats');

    expect(response.status).toBe(200);

    // Check that intervals are positive numbers
    response.body.min.forEach((item: any) => {
      expect(typeof item.interval).toBe('number');
      expect(item.interval).toBeGreaterThan(0);
      expect(item.followingWin).toBeGreaterThan(item.previousWin);
    });

    response.body.max.forEach((item: any) => {
      expect(typeof item.interval).toBe('number');
      expect(item.interval).toBeGreaterThan(0);
      expect(item.followingWin).toBeGreaterThan(item.previousWin);
    });
  });

  it('should handle health check endpoint', async () => {
    const app = await createApp();
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.text).toBe('OK');
  });

  it('should return 404 for unknown endpoints', async () => {
    const app = await createApp();
    const response = await request(app).get('/api/unknown');

    expect(response.status).toBe(404);
  });
});