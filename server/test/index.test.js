const request = require('supertest');
const app = require('../src/app.js');

describe('GET /', function() {
  it('return a redirect', function() {
    return request(app)
      .get('/')
      .expect(302)
  })
});
