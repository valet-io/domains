'use strict';

var Promise = require('bluebird');
var needle  = require('needle');
var hoek    = require('hoek');
var config  = require('./config');

var get = Promise.promisify(needle.get, needle);

exports.getUrlByHost = function (host, next) {
  return getCampaign(host).then(function (campaign) {
    return config.get('app:base') + config.get('app:path') + '?campaign=' + campaign.id;
  })
  .nodeify(next);
};

function getCampaign (host) {
  return get(config.get('api') + '/campaigns?host=' + host)
    .spread(function (response, body) {
      hoek.assert(response.statusCode === 200, 'Request failed');
      return body[0];
    });
}
