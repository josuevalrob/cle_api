import request from 'supertest';

// const app = require('../src/App');
import app from '../App'
import {stopDatabase} from '../configs/bd.config';

afterAll(async () => {
  await stopDatabase();
});

test('Starting server should return 200', async() => {
  await request(app).get('/').expect(200)
});
