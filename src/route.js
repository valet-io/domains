'use strict';

module.exports = function (server) {

  server.route({
    method: '*',
    path: '/{p*}',
    handler: function (request, reply) {
      server.methods.getLocation(request.info.host, function (err, location) {
        if (err) return reply(err);
        return reply().redirect(location)
      });
    }
  });

};
