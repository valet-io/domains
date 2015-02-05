'use strict';

require('array.prototype.find');

module.exports = function (server) {
  return function parseHost (host) {
    var subdomain = server.plugins.url.subdomains.find(function (subdomain) {
      return new RegExp('^' + subdomain + '\\.').test(host);
    });
    if (subdomain) {
      return {
        domain: host.substring(subdomain.length + 1),
        subdomain: subdomain
      };
    }
    else {
      return {
        domain: host
      };
    }
  };
}
