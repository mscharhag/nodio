'use strict';

var app = rek('app'),
	locationController = rek('locationController'),
	playerController = rek('playerController');

var locationsUrl = app.config.locationsUrl;
var playerUrl = app.config.playerUrl;

var server = app.server;
server.get(locationsUrl + '**', locationController.getLocation);



server.get(playerUrl, playerController.updateStatus);
server.get('/playerstatus', playerController.getStatus);


server.get('/test', function(req, res) {
	res.json({success: true})
});