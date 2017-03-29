/* jshint : false */
var request = require('supertest');
var assert = require('assert');
var server = require('./dashboard/server.js');
describe('loading express', function () {



  it('get a non-existing user', function testSlash(done) {
  var response;
  request(server)
    .get('/api/user?gid=123')
    .expect(200, done)
    .expect(function(res) {
      response = res;

      assert.equal(response.body, null);

    });
  });
  it('get an existing user', function testSlash(done) {
  var response;
  request(server)
    .get('/api/user?gid=110075262560651210181')
    .expect(200, done)
    .expect( res => assert.equal(res.body.firstname, 'Emil') );
  });

  it('redirect to a 404 page', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(302, done);
  });


});
