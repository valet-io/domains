'use strict';

exports.register = function (server, options, next) {
  server.method('getCampaignByDomain', require('./get')(server), {
    cache: {
      expiresIn: 1000 * 60 * 60
    }
  });
  next();
};

exports.register.attributes = {
  name: 'campaign'
};
