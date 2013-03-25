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
    battleMode: false,
    randomBattleTimer: new ig.Timer(0),

	setUIvariables: function () {
		var errorUI = document.getElementById('errorUI'),
      		gameUI = document.getElementById('gameUI'),
      		debugMessage = document.getElementById('debugMessage');
      		debugMessage2 = document.getElementById('debugMessage2');

      	this.debugMessage2 = debugMessage2;
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
		// speed = position.coords.speed;

		ig.game.geolocationOn = true;

		if ((latitude<=ig.game.worldPositionStart[0])&&(latitude>=ig.game.worldPositionEnd[0])&&(longitude<= ig.game.worldPositionEnd[1])&&(longitude>= ig.game.worldPositionStart[1])) {
			ig.game.inRange = true;
		}

		debugMessage.innerHTML = "Latitude: " + latitude + "<br>Longitude: " + longitude;
	},

	geolocationError: function(errorObject) {
		this.errorScreen("Geolocation is not working!");
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

		this.randomBattleTimer.reset();

		this.setUIvariables();
		this.loadLevel(LevelMap);
	},

	loadLevel: function(level) {
		this.parent(ig.copy(level));

		// Setup zones
		var zoneMap = ig.game.getMapByName('map');
    	this.zoneMap = new ig.ValueMap(zoneMap.tilesize, zoneMap.data, false);
	},

	update: function() {
		var player = this.getEntitiesByType( EntityPlayer )[0],
			playerPosX = player.pos.x,
			playerPosY = player.pos.y,
			playerHalfWidth = player.size.x/2,
			playerHalfHeight = player.size.y/2;
		
		// Change player position
		navigator.geolocation.getCurrentPosition(this.setGeolocation, this.geolocationError, {enableHighAccuracy:true, maximumAge: 0});
		// this.setPlayerLocation(player);
		
		var zoneValue = this.zoneMap.getValue(playerPosX+playerHalfWidth, playerPosY+playerHalfHeight*2);
		console.log(zoneValue);

		if (player.vel.x>.8 || player.vel.y>.8) {
			debugMessage2.innerHTML = "Velocity x = "+player.vel.x+"<br> Velocity y = "+player.vel.y;
			this.randomBattleTimer.reset();
	
			if (Math.random()<=.005 && zoneValue == 4) {
				this.battleMode = true;
			}
		}

		else if (this.randomBattleTimer.delta()>1.5) {
				debugMessage2.innerHTML = "not in battle mode";
				this.moving = false;
		}


		this.parent();		

		// Set camera
		this.screen.x = playerPosX - ig.system.width/2 + playerHalfWidth;
		this.screen.y = playerPosY - ig.system.height/2 + playerHalfHeight;

	},

	draw: function() {

		this.parent();

		if(this.battleMode) {
			console.log('yes');
		}

	// 	if (!this.geolocationOn) {
	// 		this.errorScreen("Searching for location...");
	// 	}

	// 	else if (!this.inRange) {
	// 		this.errorScreen("Out of range! Pocket Friends only works in the Boston Commons.");
	// 	}

	// 	else {
	// 		this.removeAllScreens();
	// 	}
	}

});

ig.main('#canvas', MyGame, 60, 160, 240, 2);

});