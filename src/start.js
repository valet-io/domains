'use strict';

var server = require('./server');

server.log(['info'], 'Starting server...');
server.start(function () {
  server.log(['info'], 'Server started at '+ server.info.uri);
});
