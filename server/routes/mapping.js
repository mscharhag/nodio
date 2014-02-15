'use strict';

var server = rek('app').server,
	location = rek('location');

server.get('/location**', location.list);