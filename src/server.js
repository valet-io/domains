'use strict';

var hapi     = require('hapi');
var config   = require('./config');
var server   = new hapi.Server({
  cache: require('catbox-memory'),
  app: config
});

server.connection({port: server.settings.app.get('port')});

var reporters = [
  {
    reporter: require('good-console'),
    args: [{request: '*', log: '*', error: '*'}]
  }
];

if (config.get('papertrail.endpoint')) {
  reporters.push({
    reporter: require('good-udp'),
    args: [{request: '*', log: '*', error: '*'}, config.get('papertrail.endpoint'), {
      threshold: config.get('papertrail.threshold')
    }]
  });
}

server.register([
  {
    register: require('good'),
    options: {
      reporters: reporters
    }
  },
  require('hapi-monit')
], throwIf);

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

server.on('start', function () {
  try {
    config.validate();
  }
  catch (e) {
    server.log('error', e.message); 
  }
});

module.exports = server;

function throwIf (err) {
  if (err) throw err;
}
