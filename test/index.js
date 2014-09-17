'use strict';

var nock   = require('nock');
var expect = require('chai').expect;
var config = require('../src/config');
var server = require('../src/server');
var uuid   = 'bbeae0da-49a0-490c-9614-9edcc52794c5';

describe('Domain Redirection', function () {

  var host = 'host.org';
  var api;
  before(function (done) {
    config.set('api', 'https://api');
    config.set('app:base', 'https://base');
    config.set('app:path', '/pledges/create');
    api = nock(config.get('api'));
    server.start(done);
  });

  after(function (done) {
    server.stop(done);
  });

  afterEach(function () {
    api.done();
  });

  describe('getLocation', function () {

    afterEach(function (done) {
      server.methods.getLocation.cache.drop(host, done);
    });

    it('gets the app URL by host', function (done) {
      api.get('/campaigns?host=host.org').reply(200, [
        {
          id: uuid  
        }
      ]);
      server.methods.getLocation(host, function (err, location) {
        expect(location).to.equal('https://base/pledges/create?campaign=' + uuid);
        done(err);
      });
    });

    it('caches the result', function (done) {
      api.get('/campaigns?host=host.org').reply(200, [{id: uuid}]);
      server.methods.getLocation(host, function (err, location) {
        server.methods.getLocation(host, function (err, location) {
          expect(location).to.equal('https://base/pledges/create?campaign=' + uuid);
          done(err);
        });
      });
    });

  });

  describe('Route', function () {

    it('gets redirects to the app endpoint', function (done) {
      api.get('/campaigns?host=host.org').reply(200, [{id: uuid}]);
      server.inject({
        url: '/',
        headers: {
          Host: 'host.org'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('https://base/pledges/create?campaign=' + uuid);
        server.methods.getLocation.cache.drop('host.org', done);
      });
    });

    it('strips www', function (done) {
      api.get('/campaigns?host=host.org').reply(200, [{id: uuid}]);
      server.inject({
        url: '/',
        headers: {
          Host: 'www.host.org'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('https://base/pledges/create?campaign=' + uuid);
        done();
      });
    });

  });

});
