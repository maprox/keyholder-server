process.env.JWT_SECRET = 'test-jwt-secret';

jest.mock('../src/storage', () => {
  const store = new Map();
  return {
    get: jest.fn((key, cb) => {
      cb(null, store.has(key) ? store.get(key) : null);
    }),
    set: jest.fn((key, value, cb) => {
      store.set(key, value);
      cb(null, 'OK');
    }),
    __clear: () => store.clear(),
    __store: store,
  };
});

const request = require('supertest');
const storage = require('../src/storage');
const { createApp } = require('../src/app');

describe('API', () => {
  let app;

  beforeEach(() => {
    storage.__clear();
    app = createApp();
  });

  describe('POST /api/sign_up', () => {
    test('returns 400 when login or secret missing', async () => {
      const res = await request(app)
        .post('/api/sign_up')
        .type('form')
        .send({ login: 'alice' });
      expect(res.status).toBe(400);
    });

    test('registers user and returns token and data', async () => {
      const res = await request(app)
        .post('/api/sign_up')
        .type('form')
        .send({ login: 'alice', secret: 's3cret', data: 'blob' });
      expect(res.status).toBe(200);
      expect(res.body.token).toEqual(expect.any(String));
      expect(res.body.data).toBe('blob');
    });

    test('rejects duplicate login', async () => {
      await request(app)
        .post('/api/sign_up')
        .type('form')
        .send({ login: 'alice', secret: 's3cret' });
      const res = await request(app)
        .post('/api/sign_up')
        .type('form')
        .send({ login: 'alice', secret: 'other' });
      expect(res.status).toBe(401);
      expect(res.text).toMatch(/already exists/i);
    });
  });

  describe('POST /api/sign_in', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/sign_up')
        .type('form')
        .send({ login: 'bob', secret: 'pass', data: 'stored' });
    });

    test('returns token and data for valid credentials', async () => {
      const res = await request(app)
        .post('/api/sign_in')
        .type('form')
        .send({ login: 'bob', secret: 'pass' });
      expect(res.status).toBe(200);
      expect(res.body.token).toEqual(expect.any(String));
      expect(res.body.data).toBe('stored');
    });

    test('rejects wrong secret', async () => {
      const res = await request(app)
        .post('/api/sign_in')
        .type('form')
        .send({ login: 'bob', secret: 'wrong' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/storage', () => {
    test('returns 401 without Authorization', async () => {
      const res = await request(app).get('/api/storage');
      expect(res.status).toBe(401);
    });

    test('returns stored data with Bearer token', async () => {
      const signUp = await request(app)
        .post('/api/sign_up')
        .type('form')
        .send({ login: 'carol', secret: 'x', data: 'payload' });
      const res = await request(app)
        .get('/api/storage')
        .set('Authorization', `Bearer ${signUp.body.token}`);
      expect(res.status).toBe(200);
      expect(res.text).toBe('payload');
    });
  });

  describe('PUT /api/storage', () => {
    test('updates data for authenticated user', async () => {
      const signUp = await request(app)
        .post('/api/sign_up')
        .type('form')
        .send({ login: 'dave', secret: 'x', data: 'old' });
      const put = await request(app)
        .put('/api/storage')
        .set('Authorization', `Bearer ${signUp.body.token}`)
        .type('form')
        .send({ data: 'new' });
      expect(put.status).toBe(204);

      const get = await request(app)
        .get('/api/storage')
        .set('Authorization', `Bearer ${signUp.body.token}`);
      expect(get.text).toBe('new');
    });

    test('returns 400 when data missing', async () => {
      const signUp = await request(app)
        .post('/api/sign_up')
        .type('form')
        .send({ login: 'eve', secret: 'x', data: 'old' });
      const res = await request(app)
        .put('/api/storage')
        .set('Authorization', `Bearer ${signUp.body.token}`)
        .type('form')
        .send({});
      expect(res.status).toBe(400);
    });
  });
});
