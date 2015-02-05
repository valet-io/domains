'use strict';

module.exports = function (server) {
  return function redirectDestination (host, campaign, next) {
    var app = host.subdomain === 'projector' ? 'projector' : 'pledge';
    return server.plugins.url.templates[app]({
      campaign: campaign
    });
  };
};
