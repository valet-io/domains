'use strict';

exports.register = function (server, options, next) {

  server.route({
    method: '*',
    path: '/{p*}',
    handler: {
      directory: {
        path: 'public',
        index: true
      }
    }
  });

  next();

};

exports.register.attributes = {
  name: 'instructions'
}
