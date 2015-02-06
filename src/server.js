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
  }, throwIf);
}

server.register(require('hapi-monit'), throwIf);

server.route({
  method: 'get',
  path: '/ping',
  handler: function (request, reply) {
    reply();
  }
});

server.register({
  register: require('./instructions')
},
{
  routes: {
    vhost: config.get('host')
  }
}, throwIf);

server.register({
  register: require('./redirect'),
  options: {
    templates: config.get('templates')
  }
}, throwIf);

module.exports = server;

function throwIf (err) {
  if (err) throw err;
}
