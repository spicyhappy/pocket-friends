ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.map',
	'game.entities.player',
	'plugins.value-map'
)
.defines(function() {

MyGame = ig.Game.extend({
	
	worldPositionStart: [42.358041,-71.074194],
    worldPositionEnd: 	[42.351577,-71.062324],
    geolocationOn: false,
    inRange: false,

	setUIvariables: function () {
		var errorUI = document.getElementById('errorUI'),
      		gameUI = document.getElementById('gameUI'),
      		debugMessage = document.getElementById('debugMessage');
      		debugMessage2 = document.getElementById('debugMessage2');
	},

	errorScreen: function(message) {
		errorUI.innerHTML = message;
		errorUI.style.display = "block";
		gameUI.style.display = "block";
		gameUI.style.backgroundColor = "#000000";
	},

	removeAllScreens: function() {
		errorUI.style.display = "none";
		gameUI.style.display = "none";
	},

	setGeolocation: function (position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		speed = position.coords.speed;

		ig.game.geolocationOn = true;
		if ((latitude<=ig.game.worldPositionStart[0])&&(latitude>=ig.game.worldPositionEnd[0])&&(longitude<= ig.game.worldPositionEnd[1])&&(longitude>= ig.game.worldPositionStart[1])) {
			ig.game.inRange = true;
		}

		debugMessage.innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude + "<br>Speed: " + speed;
	},

	geolocationError: function(errorObject) {
		debugMessage2.innerHTML = "Geolocation broken. :(";
	},

	setPlayerLocation: function (player) {
		playerPosition = this.translatePosition(latitude,longitude);
		player.pos.x = playerPosition[0]- player.size.x/2;
		player.pos.y = playerPosition[1]- player.size.y/2;
	},

	translatePosition: function(latitude,longitude) {
    	mapX = (longitude - this.worldPositionStart[1])/(this.worldPositionEnd[1]-this.worldPositionStart[1])*1100;
    	mapY = (latitude - this.worldPositionStart[0])/(this.worldPositionEnd[0]-this.worldPositionStart[0])*800;
    	return [mapX,mapY];
    },

	init: function() {
		// Bind keys for testing
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');

		// Create the ability to hide map layers
		ig.BackgroundMap.inject({visible:true, draw:function () { "use strict"; if (!this.visible) return; this.parent(); }});

		latitude = 42.358041;
		longitude = -71.074194;
		this.setUIvariables();
		this.loadLevel(LevelMap);
		navigator.geolocation.watchPosition(this.setGeolocation, this.geolocationError, {enableHighAccuracy:true, maximumAge: 0});
	},

	loadLevel: function(level) {
		this.parent(ig.copy(level));

		// Setup zones
		var zoneMap = ig.game.getMapByName('zones');
    	this.zoneMap = new ig.ValueMap(zoneMap.tilesize, zoneMap.data, false);
	},

	update: function() {
		var player = this.getEntitiesByType( EntityPlayer )[0];
		// Change player position
		// this.setPlayerLocation(player);
		
		var zoneValue = this.zoneMap.getValue(player.pos.x, player.pos.y);
		if (zoneValue == 0) {
			// reached a zone!
		}


		this.parent();		

		// Set camera
		this.screen.x = player.pos.x - ig.system.width/2 + player.size.x/2;
		this.screen.y = player.pos.y - ig.system.height/2 + player.size.y/2;

	},

	draw: function() {

		this.parent();
		

		// if (!this.geolocationOn) {
		// 	this.errorScreen("Searching for location...");
		// }

		// else if (!this.inRange) {
		// 	this.errorScreen("Out of range! Pocket Friends only works in the Boston Commons.");
		// }

		// else {
		// 	this.removeAllScreens();
		// }
	}

});

ig.main('#canvas', MyGame, 60, 160, 240, 2);

});