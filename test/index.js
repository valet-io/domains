'use strict';

var nock   = require('nock');
var expect = require('chai').expect;
var config = require('../src/config');
var server = require('../src/server');
var uuid   = 'bbeae0da-49a0-490c-9614-9edcc52794c5';

describe('Domain Redirection', function () {

  var api;
  before(function (done) {
    config.set('api:base', 'https://api');
    config.set('api:path', '/campaigns?host=<%= host %>');
    config.set('app:base', 'https://app-base');
    config.set('app:path', '/pledges/create?campaign=<%= campaign.id %>');
    config.set('projector:base', 'https://projector-base');
    config.set('projector:path', '/campaigns/<%= campaign.id %>/projection');
    config.set('self:host', 'self.domain');
    api = nock(config.get('api:base'));
    server.start(done);
  });

  after(function (done) {
    server.stop(done);
  });

  afterEach(function () {
    api.done();
  });

  describe('getCampaignByHost', function () {

    afterEach(function (done) {
      server.methods.getCampaignByHost.cache.drop('host.org', done);
    });

    it('gets the campaign by host', function (done) {
      api.get('/campaigns?host=host.org').reply(200, [{id: uuid}]);
      server.methods.getCampaignByHost('host.org', function (err, campaign) {
        expect(campaign).to.have.property('id', uuid);
        done(err);
      });
    });

    it('caches the result', function (done) {
      api.get('/campaigns?host=host.org').reply(200, [{id: uuid}]);
      server.methods.getCampaignByHost('host.org', function (err) {
        if (err) return done(err);
        server.methods.getCampaignByHost('host.org', function (err, campaign) {
          expect(campaign).to.have.property('id', uuid);
          done(err);
        });
      });
    });

  });

  describe('Route', function () {

    it('serves an HTML response when visiting from own domain', function () {
      server.inject({
        url: '/',
        headers: {
          Host: 'self.domain'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain('html');
        expect(response.payload).to.contain('<title>Valet.io Domains</title>');
      });
    });

    it('gets redirects to the app endpoint', function (done) {
      api.get('/campaigns?host=host.org').reply(200, [{id: uuid}]);
      server.inject({
        url: '/',
        headers: {
          Host: 'host.org'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('https://app-base/pledges/create?campaign=' + uuid);
        server.methods.getCampaignByHost.cache.drop('host.org', done);
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
        expect(response.headers.location).to.equal('https://app-base/pledges/create?campaign=' + uuid);
        server.methods.getCampaignByHost.cache.drop('host.org', done);
      });
    });

    it('redirects to the projector URL', function (done) {
      api.get('/campaigns?host=host.org').reply(200, [{id: uuid}]);
      server.inject({
        url: '/',
        headers: {
          Host: 'projector.host.org'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('https://projector-base/campaigns/' + uuid + '/projection');
        server.methods.getCampaignByHost.cache.drop('host.org', done);
      });
    });

  });

});
