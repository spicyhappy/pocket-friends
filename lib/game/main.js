ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.map',
	'game.entities.player'
)
.defines(function() {

MyGame = ig.Game.extend({
	
	worldPositionStart: [42.358041,-71.074194],
    worldPositionEnd: 	[42.351577,-71.062324],
    geolocationOn: false,
    inRange: false,

	setUIvariables: function () {
		var errorUI = document.getElementById('errorUI'),
      		gameUI = document.getElementById('gameUI');
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

		console.log(position.coords.speed);
		ig.game.errorScreen(position.coords.speed);

		ig.game.geolocationOn = true;

		if ((latitude<=ig.game.worldPositionStart[0])&&(latitude>=ig.game.worldPositionEnd[0])&&(longitude<= ig.game.worldPositionEnd[1])&&(longitude>= ig.game.worldPositionStart[1])) {
			ig.game.inRange = true;
		}
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

		latitude = 42.358041;
		longitude = -71.074194;
		this.setUIvariables();
		this.loadLevel(LevelMap);
	},

	update: function() {
		var player = this.getEntitiesByType( EntityPlayer )[0];
		console.log("updating");
		// Change player position
		navigator.geolocation.getCurrentPosition(this.setGeolocation);
		// this.setPlayerLocation(player);
		
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