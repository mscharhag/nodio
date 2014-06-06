'use strict';
var app = require('../app.js'),
	express = rek('express'),
	dto = rek('dto'),
	reqUtils = rek('request-util'),
	config = rek('config'),
	response = rek('response'),
	errorHandler = rek('errorHandler');

var server = app.server = express();

server.set('port', config.port);
server.set('view engine', 'ejs');
server.use(express.logger(/*'dev'*/));
server.use(express.json());
server.use(express.urlencoded());
server.use(express.methodOverride());
server.use(dto());
server.use(reqUtils());
server.use(server.router);
server.use(response());
server.use(errorHandler());

// development only
//if ('development' == server.get('env')) {
//	server.use(express.errorHandler());
//}

rek('routes');
