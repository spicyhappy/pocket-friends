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
	backgroundMap: new ig.Image('media/map-guide.png'),

	loadLevel: function( level ) {
		this.parent( level );
	    
	    // Enable the pre-rendered background mode for all mobile devices
	    if( ig.ua.mobile ) {
	        for( var i = 0; i < this.backgroundMaps.length; i++ ) {
	            this.backgroundMaps[i].preRender = true;
	        }
	    }
	},

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
 
    	mapX = (longitude - this.geolocationRange1[1])/(this.geolocationRange2[1]-this.geolocationRange1[1])*2000;
    	mapY = (latitude - this.geolocationRange1[0])/(this.geolocationRange2[0]-this.geolocationRange1[0])*1600;
    	return [mapX,mapY];
    },
	
	init: function() {

		// ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		// ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		// ig.input.bind( ig.KEY.UP_ARROW, 'up');
		// ig.input.bind( ig.KEY.DOWN_ARROW, 'down');

		this.clearColor = null;
		
		this.geolocationRange1 = [42.39177, -71.16085];
    	this.geolocationRange2 = [42.30626, -71.02180];

		var debugGeolocation = document.getElementById('debugGeolocation'),
      		errorUI = document.getElementById('errorUI');

  		// navigator.geolocation.getCurrentPosition(this.returnGeolocation)
      	this.loadLevel( LevelMap);

	},
	
	update: function() {
		this.parent();


		player = this.getEntitiesByType( EntityPlayer )[0];

		if (player) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}
		
		navigator.geolocation.getCurrentPosition(this.returnGeolocation);
		
		playerPosition = this.translatePosition(latitude,longitude);
		player.pos.x = playerPosition[0];
		player.pos.y = playerPosition[1];
		
		debugGeolocation.innerHTML = "<br>Latitude: "+latitude+"<br>Longitude: "+longitude;
	},
	
	draw: function() {
		
		this.backgroundMap.draw(0,0);
		this.parent();

	}
});

// Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
