'use strict';

var server = rek('app').server,
	locations = rek('locations'),
	player = rek('player');

server.get('/location**', locations.list);
server.get('/player', player.play)