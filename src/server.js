'use strict';

var hapi     = require('hapi');
var config   = require('./config');
var server   = new hapi.Server({
  cache: require('catbox-memory'),
  app: config
});

server.connection({port: server.settings.app.get('port')});

if (!process.env.CI) {
  server.register({
    register: require('good'),
    options: {
      reporters: [{
        reporter: require('good-console'),
        args: [{log: '*', error: '*'}]
      }]
    }
  },
  function (err) {
    if (err) throw err;
  });
}

server.register(require('hapi-monit'), function (err) {
  if (err) throw err;
});

server.register([
  require('./campaign'),
  require('./url')
], function (err) {
  if (err) throw err;
})

require('./route')(server);

module.exports = server;
