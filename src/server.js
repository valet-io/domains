'use strict';

var hapi   = require('hapi');
var config = require('./config');

var server = module.exports = new hapi.Server('localhost', +config.get('port'), {
  cache: require('catbox-memory')
});

server.method('getLocation', require('./campaign').getUrlByHost, {
  cache: {
    expiresIn: 86400000
  }
});

require('./route')(server);
