/* jshint node : true */
var request = require('supertest');
var assert = require('assert');
var server = require('./dashboard/server.js');
describe('loading express', function () {



  it('get a non-existing user', function testSlash(done) {
    request(server)
      .get('/api/user?gid=123')
      .expect(200, done)
      .expect(res => assert.equal(res.body, null) );
  });
  it('get an existing user', function testSlash(done) {
    request(server)
      .get('/api/user?gid=110075262560651210181')
      .expect(200, done)
      .expect( res => assert.equal(res.body.firstname, 'Emil') );
  });

  it('get issues for a non-existing user', function testSlash(done) {
    this.timeout(4000);
    request(server)
      .get('/api/user/123/issues')
      .expect(200, done)
      .expect( res => assert.equal(res.body.status, 'error') );
  });

  it('get issues for a user', function testSlash(done) {
    this.timeout(4000);
    request(server)
      .get('/api/user/105498442129427323426/issues')
      .expect(200, done)
      .expect( res => assert.equal(JSON.parse(res.text).length, 4) );
  });

  it('get dashboards for a user', function testSlash(done) {
    request(server)
      .get('/api/dashboards/105498442129427323426')
      .expect(200, done)
      .expect( res => assert.equal(JSON.parse(res.text).length, 3) );
  });


  it('get dashboards for a non-existing user', function testSlash(done) {
    request(server)
      .get('/api/dashboards/123')
      .expect(200, done)
      .expect( res => assert.equal(JSON.parse(res.text).length, 0) );
  });

  it('redirect to a 404 page', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(302, done);
  });


});
