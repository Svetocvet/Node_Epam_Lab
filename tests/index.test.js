const assert = require('assert');
const app = require('../index').app;
const request = require('supertest');

describe('App`s Bad Request', function() {
    it('should return Router not found with status 400', function(done) {
        request(app)
            .get('/error')
            .expect(400)
            .expect(function(response) {
                assert.deepStrictEqual(response.body, {
                    message: 'Router not found',
                });
            })
            .end(done);
    });
});
