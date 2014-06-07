'use strict';
var app = require('../app.js'),
	express = rek('express'),
	dto = rek('dto'),
	reqUtils = rek('request-util'),
	config = rek('config'),
	responseTransformer = rek('responseTransformer'),
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
server.use(responseTransformer(app.config.corsDomains));
server.use(server.router);
server.use(errorHandler());

// development only
//if ('development' == server.get('env')) {
//	server.use(express.errorHandler());
//}

rek('routes');
