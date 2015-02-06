'use strict';

var template = require('lodash.template');

exports.register = function (server, options, next) {
  server.expose('templates', Object.keys(options.templates)
    .reduce(function (templates, name) {
      templates[name] = template(options.templates[name]);
      return templates;
    }, {}));

  server.expose('subdomains', ['www', 'projector']);

  server.bind(server.plugins.redirect);
  var methods = require('./methods');
  var oneHour = 1000 * 60 * 60;
  server.method([
    {
      name: 'parseHost',
      method: methods.parse,
      options: {
        callback: false
      }
    },
    {
      name: 'campaign.getByDomain',
      method: methods.getCampaignByDomain,
      options: {
        cache: {
          expiresIn: oneHour
        }
      }
    },
    {
      name: 'destination',
      method: methods.destination,
      options: {
        callback: false
      }
    }
  ]);

  server.route({
    method: '*',
    path: '/',
    handler: function (request, reply) {
      var rawHost = request.info.host;
      var host = server.methods.parseHost(rawHost);
      server.methods.campaign.getByDomain(host.domain, function (err, campaign) {
        if (err) return reply(err);
        reply.redirect(server.methods.destination(host.subdomain, campaign));
      });
    }
  });

  next();

};

exports.register.attributes = {
  name: 'redirect'
};
