'use strict';

var nock   = require('nock');
var expect = require('chai').expect;
var config = require('../src/config');
var uuid   = 'bbeae0da-49a0-490c-9614-9edcc52794c5';

describe('Domain Redirection', function () {

  var api, server;
  before(function (done) {
    config.set('templates.api', 'https://api.valet.io/domains/${domain.name}?expand[]=campaign');
    config.set('templates.pledge', 'https://pledge.valet.io/pledges/create?campaign=${campaign.id}');
    config.set('templates.projector', 'https://app.valet.io/campaigns/${campaign.id}/projector');
    config.set('host', 'thehost');
    api = nock('https://api.valet.io');
    server = require('../src/server');
    server.start(done);
  });

  after(function (done) {
    server.stop(done);
  });

  afterEach(function () {
    api.done();
  });

  describe('Route', function () {

    it('serves an HTML response when visiting from own domain', function (done) {
      server.inject({
        url: '/',
        headers: {
          Host: 'thehost'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(200);
        expect(response.headers['content-type']).to.contain('html');
        expect(response.payload).to.contain('<title>Valet.io Domains</title>');
        done();
      });
    });

    it('gets redirects to the app endpoint', function (done) {
      api.get('/domains/host.org?expand[]=campaign').reply(200, {
        name: 'host.org',
        campaign_id: uuid,
        campaign: {
          id: uuid
        }
      });
      server.inject({
        url: '/',
        headers: {
          Host: 'host.org'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('https://pledge.valet.io/pledges/create?campaign=' + uuid);
        server.methods.campaign.getByDomain.cache.drop('host.org', done);
      });
    });

    it('strips www', function (done) {
      api.get('/domains/host.org?expand[]=campaign').reply(200, {
        name: 'host.org',
        campaign_id: uuid,
        campaign: {
          id: uuid
        }
      });
      server.inject({
        url: '/',
        headers: {
          Host: 'www.host.org'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('https://pledge.valet.io/pledges/create?campaign=' + uuid);
        server.methods.campaign.getByDomain.cache.drop('host.org', done);
      });
    });

    it('redirects to the projector URL', function (done) {
      api.get('/domains/host.org?expand[]=campaign').reply(200, {
        name: 'host.org',
        campaign_id: uuid,
        campaign: {
          id: uuid
        }
      });
      server.inject({
        url: '/',
        headers: {
          Host: 'projector.host.org'
        }
      }, function (response) {
        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('https://app.valet.io/campaigns/' + uuid + '/projector');
        server.methods.campaign.getByDomain.cache.drop('host.org', done);
      });
    });

  });

});
