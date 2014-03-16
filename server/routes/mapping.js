'use strict';

var server = rek('app').server,
	tracks = rek('tracks'),
	player = rek('player');

server.get('/location**', tracks.list);



server.get('/player', player.setStatus)
server.get('/playerstatus', player.getStatus)


server.get('/test', function(req, res) {
	res.json({success: true})
});