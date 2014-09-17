'use strict';

module.exports = function (server) {

  server.route({
    method: 'get',
    path: '/ping',
    handler: function (request, reply) {
      reply();
    }
  });

  server.route({
    method: '*',
    path: '/{p*}',
    handler: function (request, reply) {
      server.log(['redirect'], {
        from: request.info.host
      });
      server.methods.getLocation(request.info.host, function (err, location) {
        if (err) return reply(err);
        return reply().redirect(location);
      });
    }
  });

};
