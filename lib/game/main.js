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
	backgroundMap: new ig.Image( 'media/map-guide3.png'),

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
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
    },

    translatePosition: function(latitude,longitude) {
 
    	mapX = (longitude - this.geolocationRange1[1])/(this.geolocationRange2[1]-this.geolocationRange1[1])*1500;
    	mapY = (latitude - this.geolocationRange1[0])/(this.geolocationRange2[0]-this.geolocationRange1[0])*800;
    	return [mapX,mapY];
    },
	
	init: function() {

		// Bind keys for testing
		// ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		// ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		// ig.input.bind( ig.KEY.UP_ARROW, 'up');
		// ig.input.bind( ig.KEY.DOWN_ARROW, 'down');

    	this.geolocationRange1 = [42.358041,-71.074194];
    	this.geolocationRange2 = [42.351577,-71.062324];

		var debugGeolocation = document.getElementById('debugGeolocation'),
      		errorUI = document.getElementById('errorUI'),
      		gameUI = document.getElementById('gameUI');

      	this.loadLevel( LevelMap);

	},
	
	update: function() {
		this.parent();

		player = this.getEntitiesByType( EntityPlayer )[0];		
		// navigator.geolocation.getCurrentPosition(this.returnGeolocation);
		latitude = 42.358041;
		longitude = -71.074194;
		playerPosition = this.translatePosition(latitude,longitude);

		if (player&&(latitude<=this.geolocationRange1[0])&&(latitude>=this.geolocationRange2[0])&&(longitude<= this.geolocationRange2[1])&&(longitude>= this.geolocationRange1[1])) {

				this.removeUI();

				// Set camera position
				this.screen.x = player.pos.x - ig.system.width/2 + player.size.x/2;
				this.screen.y = player.pos.y - ig.system.height/2 + player.size.y/2;

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

    ig.main('#canvas', MyGame, 60, 160, 240, 2);

});
