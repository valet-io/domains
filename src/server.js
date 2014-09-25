'use strict';

var hapi     = require('hapi');
var campaign = require('./campaign');
var config   = require('./config');
var server   = new hapi.Server('0.0.0.0', +config.get('port'), {
  cache: require('catbox-memory')
});

server.method('getLocation', campaign.getUrlByHost, {
  cache: {
    expiresIn: 86400000
  }
});

if (!process.env.CI) {
  server.pack.register({
    plugin: require('good'),
    options: {
      subscribers: {
        'udp://logs.papertrailapp.com:44076': ['log', 'error'],
        console: ['log', 'error']
      }
    }
  }, function (err) {
    if (err) throw err;
  });
}

server.on('request', function (request, event, tags) {
  server.log(['log'], request);
});

require('./route')(server);

module.exports = server;
