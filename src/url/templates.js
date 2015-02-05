'use strict';

var template = require('lodash.template');

module.exports = function (server) {
  var templates = server.settings.app.get('templates');
  return Object.keys(templates)
    .reduce(function (acc, name) {
      acc[name] = template(templates[name]);
      return acc;
    }, {})
};
