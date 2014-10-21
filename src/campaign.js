'use strict';

var Promise = require('bluebird');
var needle  = require('needle');
var hoek    = require('hoek');
var _       = require('lodash');
var config  = require('./config');
var get     = Promise.promisify(needle.get, needle);

exports.byHost = function (host, next) {
  var generateUrl = _.template(config.get('api:base') + config.get('api:path'));
  return get(generateUrl({
    host: host
  }))
  .spread(function (response, body) {
    hoek.assert(response.statusCode === 200, 'Request failed');
    return body[0];
  })
  .nodeify(next);
};
