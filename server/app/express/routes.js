'use strict';

var app = rek('app'),
	locationController = rek('locationController'),
	player = rek('player');

var locationsUrl = app.config.locationsUrl
var playerUrl = app.config.playerUrl

var server = app.server;
server.get(locationsUrl + '**', locationController.getLocation);



server.get(playerUrl, player.setStatus)
server.get('/playerstatus', player.getStatus)


server.get('/test', function(req, res) {
	res.json({success: true})
});