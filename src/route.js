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
    path: '/{p*}',
    handler: function (request, reply) {
      var host = request.info.host;
      var parsedHost;
      if (/^www./.test(host) || /^projector./.test(host)) {
        var parts = host.split('.');
        parsedHost = {
          subdomain: parts[0],
          base: parts.slice(1, parts.length).join('.')
        };
      }
      else {
        parsedHost = {
          base: host
        };
      }

      var appUrl = _.template(config.get('app:base') + config.get('app:path'));
      var projectorUrl = _.template(config.get('projector:base') + config.get('projector:path'));

      function generateUrl (campaign) {
        return (parsedHost.subdomain === 'projector' ? projectorUrl : appUrl)({
          campaign: campaign
        });
      }

      if (parsedHost.base === config.get('self:host')) {
        reply.file(__dirname + '/index.html');
      }
      else {
        server.methods.getCampaignByHost(parsedHost.base, function (err, campaign) {
          if (err) {
            reply(err);
          }
          else {
            reply().redirect(generateUrl(campaign));
          }
        });
      }
    }
  });

};
