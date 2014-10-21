'use strict';

module.exports = require('nconf')
  .use('memory')
  .env({
    separator: '__'
  })
  .defaults({
    port: 0
  });
