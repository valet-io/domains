'use strict';

module.exports = require('nconf')
  .use('memory')
  .env({
    separator: '__',
    whitelist: ['port', 'app__base', 'app__path', 'api']
  })
  .defaults({
    port: 0
  });
