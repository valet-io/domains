'use strict';

var hapi     = require('hapi');
var campaign = require('./campaign');
var config   = require('./config');
var server = module.exports = new hapi.Server('0.0.0.0', +config.get('port'), {
  cache: require('catbox-memory')
});

server.method('getLocation', campaign.getUrlByHost, {
  cache: {
    expiresIn: 86400000
  }
});

require('./route')(server);
