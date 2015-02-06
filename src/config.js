'use strict';

module.exports = require('convict')({
  templates: {
    api: {
      env: 'API_TEMPLATE',
      format: String,
      default: null
    },
    projector: {
      env: 'PROJECTOR_TEMPLATE',
      format: String,
      default: null
    },
    pledge: {
      env: 'PLEDGE_TEMPLATE',
      format: String,
      default: null
    }
  },
  port: {
    env: 'PORT',
    format: Number,
    default: 0
  },
  host: {
    env: 'HOST',
    format: String,
    default: 'localhost'
  }
});
