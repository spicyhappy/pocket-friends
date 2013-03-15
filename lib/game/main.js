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
    },

    translatePosition: function(latitude,longitude) {
    	
    	var mapX = Math.abs(2000*longitude/(this.geolocationRange2[1]-this.geolocationRange1[1]));
    	var mapY = Math.abs(2000*latitude/(this.geolocationRange2[0]-this.geolocationRange1[0]));

    	console.log(mapX);

    	// mapScale = 2000/(this.geolocationRange2[1]-this.geolocationRange1[1]);
    	// xPostition = mapScale*(longitude-this.geolocationRange1[0]);
    	// yPosition = mapScale*(latitude-this.geolocationRange1[1]);
    	// console.log('map scale: '+mapScale);
    	// console.log('geolocationRange 1: '+this.geolocationRange1[1]);
    	// console.log('geolocationRange 2: '+this.geolocationRange2[1]);
    	// console.log(this.geolocationRange2[1]);
    	// console.log(xPostition+" "+yPosition);
    },
	
	init: function() {

		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');

		this.geolocationRange1 = [42.39177, -71.16085];
    	this.geolocationRange2 = [42.30626, -71.02180];

		var debugGeolocation = document.getElementById('debugGeolocation'),
      		errorUI = document.getElementById('errorUI');

  		// navigator.geolocation.getCurrentPosition(this.returnGeolocation);

      	this.loadLevel( LevelMap);

	},
	
	update: function() {
		player = this.getEntitiesByType( EntityPlayer )[0];
		this.translatePosition(42.39177,-71.16085);

		this.parent();

		if (player) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		
		// navigator.geolocation.getCurrentPosition(this.returnGeolocation);
		// debugGeolocation.innerHTML = "<br>Latitude: "+latitude+"<br>Longitude: "+longitude;
		this.translatePosition(42.35,-71.15);
	},
	
	draw: function() {
		this.parent();
	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
