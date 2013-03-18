ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.levels.map'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	font: new ig.Font( 'media/04b03.font.png' ),


	errorScreen: function(message) {
		errorUI.innerHTML = message;
		errorUI.style.display = "block";
		gameUI.style.display = "block";
		gameUI.style.backgroundColor = "#000000";
	},

	removeUI: function() {
		errorUI.style.display = "none";
		gameUI.style.display = "none";
	},

	returnGeolocation: function(position) { 
		// latitude = position.coords.latitude;
		// longitude = position.coords.longitude;

		// Testing numbers
		latitude = 42.35;
		longitude = -71.08;
    },

    translatePosition: function(latitude,longitude) {
 
    	mapX = (longitude - this.geolocationRange1[1])/(this.geolocationRange2[1]-this.geolocationRange1[1])*2000;
    	mapY = (latitude - this.geolocationRange1[0])/(this.geolocationRange2[0]-this.geolocationRange1[0])*1600;
    	return [mapX,mapY];
    },
	
	init: function() {

		// Bind keys for testing
		// ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		// ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		// ig.input.bind( ig.KEY.UP_ARROW, 'up');
		// ig.input.bind( ig.KEY.DOWN_ARROW, 'down');

		this.clearColor = null;

		this.geolocationRange1 = [42.39177, -71.16085];
    	this.geolocationRange2 = [42.30626, -71.02180];

		var debugGeolocation = document.getElementById('debugGeolocation'),
      		errorUI = document.getElementById('errorUI'),
      		gameUI = document.getElementById('gameUI');

      	this.loadLevel( LevelMap);

	},
	
	update: function() {
		this.parent();

		player = this.getEntitiesByType( EntityPlayer )[0];		
		navigator.geolocation.getCurrentPosition(this.returnGeolocation);
		playerPosition = this.translatePosition(latitude,longitude);

		if (player&&(latitude<42.39177)&&(latitude>42.30626)&&(longitude< -71.02180)&&(longitude> -71.16085)) {

				this.removeUI();

				// Set camera position
				this.screen.x = player.pos.x - ig.system.width/2;
				this.screen.y = player.pos.y - ig.system.height/2;

				// Set player position to latitude and longitude
				player.pos.x = playerPosition[0];
				player.pos.y = playerPosition[1];

			}

		else {
			this.errorScreen("Pocket Monsters only works in certain areas of Boston, sorry!");
		}
		
		debugGeolocation.innerHTML = "<br>Latitude: "+latitude+"<br>Longitude: "+longitude;
	},
	
	draw: function() {
		this.parent();

	}
});

ig.main('#canvas', MyGame, 60, 320, 240, 2);

});
