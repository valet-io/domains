'use strict';

var _      = require('lodash');
var config = require('./config');

module.exports = function (server) {

  server.route({
    method: 'get',
    path: '/ping',
    handler: function (request, reply) {
      reply();
    }
  });

  server.route({
    method: '*',
    path: '/',
    handler: function (request, reply) {
      var host = request.info.host;
      var parsed = server.methods.parseHost(request.info.host);
      server.methods.getCampaignByDomain(parsed.domain, function (err, campaign) {
        if (err) return reply(err);
        reply.redirect(server.methods.destination(parsed, campaign));
      });
    }
  });

};
