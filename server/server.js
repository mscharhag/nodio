'use strict';
//"speaker": "0.0.10",
var app = require('./app/app'),
	http = require('http'),
	express = rek('express'),
	dto = rek('dto'),
	errorHandler = rek('errorHandler');

var server = app.server = express();

server.set('port', process.env.PORT || 3000);
server.set('view engine', 'ejs');
server.use(express.favicon());
server.use(express.logger('dev'));
server.use(express.json());
server.use(express.urlencoded());
server.use(express.methodOverride());
server.use(dto());
server.use(server.router);
server.use(errorHandler());

// development only
//if ('development' == server.get('env')) {
//	server.use(express.errorHandler());
//}



rek('mapping');

http.createServer(server).listen(server.get('port'), function(){
  console.log('Express server listening on port ' + server.get('port'));
});
