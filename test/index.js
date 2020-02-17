import http from 'http';
import assert from 'assert';

import server from '../src/index.js';

describe('Example Node Server', () => {
  it('should return 200', done => {
    http.get('http://127.0.0.1:8000', res => {
      console.log('🙅🏻‍♂️', res.statusCode)
      assert.equal(200, res.statusCode);
      server.close();
      done();
    });
  });
});
