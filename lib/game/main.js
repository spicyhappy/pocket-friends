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
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	geolocationTest: function(position) {
		if (navigator.geolocation) {
			return true;
		}

		else {
			errorUI.style.display = "inline-block";
      		errorUI.innerHTML = "Pocket Friends needs geolocation to work.";
		}
	},

	returnGeolocation: function(position) { 
		latitude = position.coords.latitude;
    	longitude = position.coords.longitude;
    	geolocationOn = true;
	},

	
	init: function() {

		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');


		var geolocationRange1 = [42.39177,-71.16085],
    		geolocationRange2 = [42.30626, -71.02180],
      		debugGeolocation = document.getElementById('debugGeolocation'),
      		errorUI = document.getElementById('errorUI'),
			geolocationOn = false;

      	if (this.geolocationTest()) {
      		this.loadLevel( LevelMap);
      	}
	},
	
	update: function() {
		this.parent();
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if (player) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		
		navigator.geolocation.getCurrentPosition(this.returnGeolocation);

		if (geolocationOn==true) {
			debugGeolocation.innerHTML = "<br>Latitude: "+latitude+"<br>Longitude: "+longitude;
			player.pos.x = 0;
			player.pos.y = 0;
		}
	},
	
	draw: function() {
		this.parent();
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
