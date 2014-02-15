'use strict';

var app = require('./app/app'),
	http = require('http'),
	express = rek('express');

var server = app.server = express();

server.set('port', process.env.PORT || 3000);
server.set('view engine', 'ejs');
server.use(express.favicon());
server.use(express.logger('dev'));
server.use(express.json());
server.use(express.urlencoded());
server.use(express.methodOverride());
server.use(server.router);

// development only
if ('development' == server.get('env')) {
	server.use(express.errorHandler());
}

rek('mapping');

http.createServer(server).listen(server.get('port'), function(){
  console.log('Express server listening on port ' + server.get('port'));
});
