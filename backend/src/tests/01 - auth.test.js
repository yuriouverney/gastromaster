// auth.test.js

const request = require('supertest');
const app = require('../index'); // Path to your Express start file

describe('Authentication Tests', () => {
  beforeAll(async () => {
    let response = await request(app)
      .post('/app/auth/register')
      .send({ form: { name: 'Test', email: 'test@example.com', password: 'password123' } });

    expect(response.statusCode).toBe(200);

    response = await request(app)
      .post('/app/auth/login')
      .send({ form: { email: 'test@example.com', password: 'password123' } });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');

    global.token = response.body.token;
  });

  test('GET /app/auth/getuserdata - Should return user data', async () => {
    const response = await request(app)
      .get('/app/auth/getuserdata')
      .set('Authorization', `Bearer ${global.token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('session');
  });
});
