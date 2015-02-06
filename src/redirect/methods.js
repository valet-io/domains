'use strict';

var Promise = require('bluebird');
var got     = Promise.promisifyAll(require('got'));

require('array.prototype.find');

exports.parse = function parseHost (rawHost) {
  var subdomain = this.subdomains.find(function (subdomain) {
    return new RegExp('^' + subdomain + '\\.').test(rawHost);
  });
  if (subdomain) {
    return {
      domain: rawHost.substring(subdomain.length + 1),
      subdomain: subdomain
    };
  }
  else {
    return {
      domain: rawHost
    };
  }
};

exports.getCampaignByDomain = function getCampaignByDomain (domainName, next) {
  return got.getAsync(this.templates.api({
    domain: {
      name: domainName
    }
  }))
  .get(0)
  .bind(JSON)
  .then(JSON.parse)
  .then(function (domain) {
    if (!domain.campaign.id) {
      throw new Error('No campaign found for domain ' + domainName);
    }
    else {
      return domain.campaign;
    }
  })
  .nodeify(next);
};

exports.destination = function redirectDestination (subdomain, campaign) {
  var app = (subdomain === 'projector') ? 'projector' : 'pledge';
  return this.templates[app]({
    campaign: campaign
  });
};
