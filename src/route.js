'use strict';

module.exports = function (server) {

  server.route({
    method: '*',
    path: '/{p*}',
    handler: function (request, reply) {
      server.methods.getUrlByHost(request.info.host, function (err, result) {
        reply(err || result);
      });
    }
  });

};
