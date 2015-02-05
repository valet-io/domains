'use strict';

exports.register = function (server, options, next) {
  server.dependency('campaign');
  server.expose('templates', require('./templates')(server));
  server.expose('subdomains', ['www', 'projector']);
  server.method('parseHost', require('./parse')(server), {
    callback: false
  });
  server.method('destination', require('./destination')(server), {
    callback: false
  });
  next();
};

exports.register.attributes = {
  name: 'url'
};
