'use strict';

module.exports = require('convict')({
  templates: {
    api: {
      format: String,
      default: null
    },
    projector: {
      format: String,
      default: null
    },
    pledge: {
      format: String,
      default: null
    }
  },
  port: {
    default: 0
  },
  host: {
    format: String,
    default: 'localhost'
  }
});
