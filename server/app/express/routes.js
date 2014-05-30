'use strict';

var app = rek('app'),
	locationController = rek('locationController'),
	playerController = rek('playerController');

var locationsUrl = app.config.locationsUrl;
var playerUrl = app.config.playerUrl;

var server = app.server;

server.get(locationsUrl + '**', locationController.getLocation);

server.post(playerUrl, playerController.updateStatus);
server.get(playerUrl, playerController.getStatus);
