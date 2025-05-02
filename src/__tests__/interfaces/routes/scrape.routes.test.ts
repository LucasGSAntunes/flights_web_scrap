import request from 'supertest';
import app from '../../../app';

describe('POST /api/scrape  (controller MOCKED)', () => {

  it('→ deve retornar 400', async () => {
    const res = await request(app).post('/api/scrape');
    expect(res.status).toBe(400);
  });
});
