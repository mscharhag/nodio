'use strict';

require('./app/express/express-setup.js');
var	http = require('http'),
	app = rek('app');

var server = app.server;

http.createServer(server).listen(server.get('port'), function(){
  console.log('Server listening on port ' + server.get('port'));
});
