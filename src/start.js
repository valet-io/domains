'use strict';

var server = require('./server');

server.start(function () {
  server.log(['info'], 'Server started at '+ server.info.uri);
});
