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
    	debugGeolocation.innerHTML = "<br>Latitude: "+latitude+"<br>Longitude: "+longitude;
	},

	
	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');

		var x = ig.system.width/2,
			y = ig.system.height/2;

		var geolocationRange1 = [42.39177,-71.16085],
    		geolocationRange2 = [42.30626, -71.02180],
      		debugGeolocation = document.getElementById('debugGeolocation'),
      		errorUI = document.getElementById('errorUI');

      	if (this.geolocationTest()) {
      		this.loadLevel( LevelMap);
      	}
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if (player) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		this.parent();
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps

		navigator.geolocation.getCurrentPosition(this.returnGeolocation);

		this.parent();
		
		
		// Add your own drawing code here
		var x = ig.system.width/2,
			y = ig.system.height/2;
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
