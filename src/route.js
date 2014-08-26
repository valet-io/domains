'use strict';

var campaign = require('./campaign');

module.exports = function (server) {

  server.route({
    method: '*',
    path: '/{p*}',
    handler: function (request, reply) {
      campaign.getUrlByHost(request.info.host)
        .done(reply.redirect);
    }
  });

};
