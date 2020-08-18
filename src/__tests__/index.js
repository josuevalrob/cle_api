import request from 'supertest';
// Following: 
// https://www.sisense.com/blog/rest-api-testing-strategy-what-exactly-should-you-test/
// const app = require('../src/App');
import app from '../App'
import {stopDatabase} from '../configs/bd.config';

afterAll(async () => {
  await stopDatabase();
});

test('Starting server should return 200', async() => {
  await request(app).get('/').expect(200)
});
