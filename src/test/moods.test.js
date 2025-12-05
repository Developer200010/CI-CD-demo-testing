const request = require('supertest');
const app = require('../app');

describe('Mood API', () => {
  it('GET /api/moods returns an array', async () => {
    const res = await request(app).get('/api/moods');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/moods creates a new mood', async () => {
    const res = await request(app)
      .post('/api/moods')
      .send({ text: 'CI/CD is cool!' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.text).toBe('CI/CD is cool!');
  });
});
