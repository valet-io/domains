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
      var host = request.info.host.replace(/^www\./, '');
      server.log(['redirect'], {
        from: host,
        www_stripped: request.info.host !== host
      });
      server.methods.getLocation(host, function (err, location) {
        if (err) return reply(err);
        return reply().redirect(location);
      });
    }
  });

};
