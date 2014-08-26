'use strict';

module.exports = require('nconf').env('__').defaults({
  port: process.env.PORT || 8000
})
