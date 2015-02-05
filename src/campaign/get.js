'use strict';

var got = require('got');

module.exports = function (server) {

  function path (host) {
    return server.plugins.url.templates.api({
      domain: {
        name: host
      }
    });
  }
  return function getCampaignByDomain (host, next) {
    got.get(path(host), function (err, data) {
      if (err) return next(err);
      data = JSON.parse(data);
      if (!data.campaign.id) return next(new Error('No campaign found for domain ' + host));
      return next(null, data.campaign);
    });
  };
  
};
