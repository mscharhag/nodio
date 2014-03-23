'use strict';

var app = rek('app'),
	tracks = rek('tracks'),
	player = rek('player');

var locationsUrl = app.config.locationsUrl
var playerUrl = app.config.playerUrl

var server = app.server;
server.get(locationsUrl + '**', tracks.locations);



server.get(playerUrl, player.setStatus)
server.get('/playerstatus', player.getStatus)


server.get('/test', function(req, res) {
	res.json({success: true})
});